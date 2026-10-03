# main.py
"""
FastAPI backend for the WAPAS React frontend.
Matches the contracts documented in the frontend README.
Replace the in-memory store + agent stub with your friends' real agent.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Literal, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# App + CORS (frontend runs on http://localhost:5173 by default)
# ---------------------------------------------------------------------------
app = FastAPI(title="WAPAS Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic models — mirror the documented frontend contracts
# ---------------------------------------------------------------------------
AgentStatus = Literal[
    "idle", "processing", "awaiting_user_action",
    "completed", "unrecoverable", "failed",
]
RequiredAction = Literal[
    "user_confirmation", "upload_document", "physical_action",
]
UserActionType = Literal[
    "user_confirmation", "document_uploaded", "physical_action_completed",
]


class AgentDetails(BaseModel):
    label: str
    value: str


class AgentStatusOut(BaseModel):
    status: AgentStatus
    message: str
    requiredAction: Optional[RequiredAction] = None
    details: list[AgentDetails] = Field(default_factory=list)
    updatedAt: datetime


class SendToAgentIn(BaseModel):
    type: UserActionType


class CaseUpdate(BaseModel):
    id: str
    caseId: str
    timestamp: datetime
    message: str
    kind: str = "info"  # info | success | warning | error


class ActivityItem(BaseModel):
    id: str
    caseId: str
    message: str
    timestamp: datetime


class CaseSummary(BaseModel):
    id: str
    title: str
    status: AgentStatus
    amount: Optional[str] = None
    updatedAt: datetime


class CaseDetail(CaseSummary):
    description: Optional[str] = None
    details: list[AgentDetails] = Field(default_factory=list)


class DocumentOut(BaseModel):
    id: str
    caseId: str
    name: str
    size: int
    contentType: str
    uploadedAt: datetime
    previewUrl: str
    downloadUrl: str


class TranscriptSegment(BaseModel):
    start: float
    end: float
    text: str


class TranscriptOut(BaseModel):
    id: str
    text: str
    segments: Optional[list[TranscriptSegment]] = None
    createdAt: datetime


# ---------------------------------------------------------------------------
# In-memory store — swap this out for your agent's real persistence layer
# ---------------------------------------------------------------------------
def _now() -> datetime:
    return datetime.now(timezone.utc)


DB: dict[str, Any] = {
    "cases": {},
    "documents": {},
    "transcripts": {},
    "updates": {},
    "activity": [],
    "agent_status": {},
    "transcription_jobs": {},
}


def _seed_demo_case() -> str:
    case_id = "case-001"
    DB["cases"][case_id] = CaseDetail(
        id=case_id,
        title="Refund — Order #82490",
        status="awaiting_user_action",
        amount="₹82,490",
        updatedAt=_now(),
        description="Return verified. Awaiting customer confirmation.",
        details=[
            AgentDetails(label="Order value", value="₹82,490"),
            AgentDetails(label="Return window", value="Open"),
        ],
    ).model_dump()
    DB["agent_status"][case_id] = AgentStatusOut(
        status="awaiting_user_action",
        message="The return has been verified. The next step requires your confirmation.",
        requiredAction="user_confirmation",
        details=[AgentDetails(label="Order value", value="₹82,490")],
        updatedAt=_now(),
    ).model_dump()
    return case_id


_seed_demo_case()


# ---------------------------------------------------------------------------
# Agent endpoints  (agentService.js)
# ---------------------------------------------------------------------------
@app.post("/api/cases/{case_id}/agent", response_model=AgentStatusOut)
def send_to_agent(case_id: str, payload: SendToAgentIn) -> AgentStatusOut:
    """User action goes back to the agent: user_confirmation,
    document_uploaded, or physical_action_completed."""
    if case_id not in DB["cases"]:
        raise HTTPException(404, "Case not found")

    # >>> Replace this block with a call to your friends' WAPAS agent <<<
    if payload.type == "user_confirmation":
        new_status = "processing"
        message = "Confirmation received. Processing your request."
        required = None
    elif payload.type == "document_uploaded":
        new_status = "processing"
        message = "Document received. Analysing."
        required = None
    elif payload.type == "physical_action_completed":
        new_status = "processing"
        message = "Physical action logged. Verifying."
        required = None
    else:
        raise HTTPException(400, "Unknown action type")

    status_out = AgentStatusOut(
        status=new_status,
        message=message,
        requiredAction=required,
        details=[],
        updatedAt=_now(),
    )
    DB["agent_status"][case_id] = status_out.model_dump()
    DB["cases"][case_id]["status"] = new_status
    DB["cases"][case_id]["updatedAt"] = _now()
    return status_out


@app.get("/api/cases/{case_id}/agent/status", response_model=AgentStatusOut)
def get_agent_status(case_id: str) -> AgentStatusOut:
    if case_id not in DB["agent_status"]:
        raise HTTPException(404, "No agent status for this case")
    return AgentStatusOut(**DB["agent_status"][case_id])


@app.get("/api/cases/{case_id}/agent/updates", response_model=list[CaseUpdate])
def get_case_updates(case_id: str) -> list[CaseUpdate]:
    return [CaseUpdate(**u) for u in DB["updates"].get(case_id, [])]


@app.get("/api/activity/recent", response_model=list[ActivityItem])
def get_recent_activity(limit: int = 20) -> list[ActivityItem]:
    items = sorted(DB["activity"], key=lambda a: a["timestamp"], reverse=True)
    return [ActivityItem(**a) for a in items[:limit]]


# ---------------------------------------------------------------------------
# Case endpoints  (caseService.js)
# ---------------------------------------------------------------------------
@app.get("/api/cases", response_model=list[CaseSummary])
def list_cases() -> list[CaseSummary]:
    return [CaseSummary(**c) for c in DB["cases"].values()]


@app.get("/api/cases/{case_id}", response_model=CaseDetail)
def get_case(case_id: str) -> CaseDetail:
    if case_id not in DB["cases"]:
        raise HTTPException(404, "Case not found")
    return CaseDetail(**DB["cases"][case_id])


# ---------------------------------------------------------------------------
# Document endpoints  (documentService.js)
# ---------------------------------------------------------------------------
@app.get("/api/cases/{case_id}/documents", response_model=list[DocumentOut])
def list_documents(case_id: str) -> list[DocumentOut]:
    docs = [d for d in DB["documents"].values() if d["caseId"] == case_id]
    return [DocumentOut(**d) for d in docs]


@app.post(
    "/api/cases/{case_id}/documents",
    response_model=DocumentOut,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(case_id: str, file: UploadFile = File(...)) -> DocumentOut:
    if case_id not in DB["cases"]:
        raise HTTPException(404, "Case not found")

    doc_id = str(uuid.uuid4())
    contents = await file.read()

    # The mock frontend treats filenames containing "fail" as errors.
    # Keeping that behaviour makes the real backend a drop-in replacement.
    if "fail" in (file.filename or "").lower():
        raise HTTPException(422, "Upload failed (simulated by filename)")

    doc = DocumentOut(
        id=doc_id,
        caseId=case_id,
        name=file.filename or "unnamed",
        size=len(contents),
        contentType=file.content_type or "application/octet-stream",
        uploadedAt=_now(),
        previewUrl=f"/api/documents/{doc_id}/preview",
        downloadUrl=f"/api/documents/{doc_id}/download",
    )
    DB["documents"][doc_id] = {**doc.model_dump(), "content": contents}
    return doc


@app.put(
    "/api/cases/{case_id}/documents/{doc_id}",
    response_model=DocumentOut,
)
async def replace_document(
    case_id: str, doc_id: str, file: UploadFile = File(...)
) -> DocumentOut:
    if doc_id not in DB["documents"]:
        raise HTTPException(404, "Document not found")
    contents = await file.read()
    if "fail" in (file.filename or "").lower():
        raise HTTPException(422, "Replace failed (simulated by filename)")
    doc = DB["documents"][doc_id]
    doc.update(
        name=file.filename or doc["name"],
        size=len(contents),
        contentType=file.content_type or doc["contentType"],
        uploadedAt=_now(),
        content=contents,
    )
    return DocumentOut(**{k: v for k, v in doc.items() if k != "content"})


@app.get("/api/documents/{doc_id}/download")
def download_document(doc_id: str):
    doc = DB["documents"].get(doc_id)
    if not doc:
        raise HTTPException(404, "Document not found")
    import io
    return FileResponse(
        io.BytesIO(doc["content"]),
        media_type=doc["contentType"],
        filename=doc["name"],
    )


@app.get("/api/documents/{doc_id}/preview")
def preview_document(doc_id: str):
    doc = DB["documents"].get(doc_id)
    if not doc:
        raise HTTPException(404, "Document not found")
    import io
    return FileResponse(
        io.BytesIO(doc["content"]),
        media_type=doc["contentType"],
        filename=doc["name"],
    )


# ---------------------------------------------------------------------------
# Transcription endpoints  (transcriptionService.js)
# ---------------------------------------------------------------------------
@app.post("/api/transcription", response_model=TranscriptOut)
async def transcribe_audio(file: UploadFile = File(...)) -> TranscriptOut:
    """Direct-response transcription. Return { jobId } instead if you want
    the frontend to poll — see /api/transcription/jobs/{job_id}."""
    if "fail" in (file.filename or "").lower():
        raise HTTPException(422, "Transcription failed (simulated by filename)")

    await file.read()  # discard bytes in this stub
    tx_id = str(uuid.uuid4())
    transcript = TranscriptOut(
        id=tx_id,
        text="Sample transcript generated by the WAPAS backend stub.",
        segments=[
            TranscriptSegment(start=0.0, end=2.0, text="Sample transcript"),
            TranscriptSegment(start=2.0, end=4.2, text="generated by the WAPAS backend stub."),
        ],
        createdAt=_now(),
    )
    DB["transcripts"][tx_id] = transcript.model_dump()
    return transcript


@app.get("/api/transcription/jobs/{job_id}")
def transcription_job_status(job_id: str):
    """Optional polling endpoint. Only wire this up if transcriptionService
    falls back to polling when the direct response has no `text`."""
    job = DB["transcription_jobs"].get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job


@app.get("/api/transcripts", response_model=list[TranscriptOut])
def list_transcripts() -> list[TranscriptOut]:
    return [TranscriptOut(**t) for t in DB["transcripts"].values()]


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}