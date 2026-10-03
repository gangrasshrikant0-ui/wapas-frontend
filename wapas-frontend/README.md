# WAPAS frontend

Workflow for Autonomous Payout & Account Settlement: a React interface for tracking refund, claim and reimbursement cases.
The agent/backend is a separate system. This app talks to it through `src/services/` and runs on sample data until it is connected.

## Run

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. `.env` is already copied from `.env.example`.

## Connecting the real backend

1. In `.env`, set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL` to the backend URL.
2. Make the backend match the endpoints listed at the top of `src/services/api.js`.
3. Add authentication in `getAuthHeaders()` in the same file. Do not put API keys in this app.

| Service file | What the agent team implements |
|---|---|
| `agentService.js` | `sendToAgent`, `getAgentStatus`, `getCaseUpdates`, `getRecentActivity` |
| `documentService.js` | list, upload, replace, download, preview URL |
| `transcriptionService.js` | `transcribeAudio(file)` (direct response or `{ jobId }` polling), `listTranscripts` |
| `caseService.js` | `listCases`, `getCase` |

Response shapes are documented as comments beside each function.

### Agent contract

The UI renders whatever the agent reports and assumes nothing about how it works:

```js
{
  status: "awaiting_user_action",   // idle | processing | awaiting_user_action | completed | unrecoverable | failed
  message: "The return has been verified. The next step requires your confirmation.",
  requiredAction: "user_confirmation", // user_confirmation | upload_document | physical_action | null
  details: [{ label: "Order value", value: "₹82,490" }],  // optional, shown for the user to check
  updatedAt: "2026-10-02T16:45:00+05:30"
}
```

User actions go back through `sendToAgent(caseId, { type })` with `user_confirmation`, `document_uploaded` or `physical_action_completed`.
The case page polls every 10 seconds while the status is `processing`.

### Transcript contract

```js
{ text: "...", segments: [{ start: 0, end: 4.2, text: "..." }] }
```

`segments` is optional. Timestamps appear in the viewer only when it is present.

## Mock mode

Everything under `src/services/mock/` and `src/data/mockData.js` exists only for demos and is the only code that knows about sample data.
Mock mode is labelled "Sample data" in the top bar. It does not analyse audio: transcription returns a fixed sample transcript.
Name a file with `fail` in it (for example `fail.pdf`) to see upload and transcription error states.
State resets on page reload.

## Structure

```
src/
  components/{layout,cases,documents,transcription,common}
  pages/           Dashboard, Cases, CaseDetails, Documents, Transcription, Settings
  services/        api.js + one service per concern; mock/ holds the demo backend
  hooks/           useAsync, useTranscription, useDocumentActions, ...
  utils/           formatting, file helpers, status labels (constants.js)
  data/mockData.js
```

Status labels and colours live in `src/utils/constants.js`. Colours are tokens in `tailwind.config.js`.
