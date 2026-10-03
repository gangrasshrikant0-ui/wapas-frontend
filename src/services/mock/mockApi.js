/**
 * Mock implementation of the backend, used only when VITE_USE_MOCK_API=true.
 * State lives in memory and resets on reload. This module is the only place
 * that knows about sample data; UI components never import it.
 *
 * Demo tip: give a file a name containing "fail" to see upload and
 * transcription error states.
 */
import {
  seedCases,
  seedDocuments,
  seedActivities,
  seedAgentStates,
  seedTranscripts,
  sampleTranscript,
  joinSegments,
} from '../../data/mockData';
import { getExtension, triggerDownload } from '../../utils/files';

const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
const nowIso = () => new Date().toISOString();
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const notFound = (what) => Object.assign(new Error(`${what} not found`), { status: 404 });
const byDateDesc = (key) => (a, b) => new Date(b[key]) - new Date(a[key]);

const db = {
  cases: clone(seedCases),
  documents: clone(seedDocuments),
  activities: clone(seedActivities),
  agent: clone(seedAgentStates),
  transcripts: clone(seedTranscripts),
};
// Files uploaded during this session, kept so View/Download work in the demo.
const files = new Map();

const withPreview = (d) => ({ ...d, previewUrl: files.get(d.id)?.url ?? null });

// Inserts a finished step before any in-progress / upcoming steps.
function insertActivity(caseId, item) {
  const list = (db.activities[caseId] ||= []);
  const idx = list.findIndex((a) => a.status === 'current' || a.status === 'pending');
  const entry = { id: newId('act'), caseId, at: nowIso(), status: 'done', ...item };
  if (idx === -1) list.push(entry);
  else list.splice(idx, 0, entry);
}

const touchCase = (caseId) => {
  const c = db.cases.find((x) => x.id === caseId);
  if (c) c.updatedAt = nowIso();
};

const guessType = (name) => {
  const n = name.toLowerCase();
  if (n.includes('invoice') || n.includes('bill')) return 'Invoice';
  if (n.includes('receipt')) return 'Receipt';
  if (n.includes('claim')) return 'Claim form';
  if (/mail|letter|chat|conversation/.test(n)) return 'Correspondence';
  if (n.includes('request')) return 'Request';
  return 'Other';
};

// ---- Cases ---------------------------------------------------------------

export async function listCases() {
  await delay(350);
  return clone(db.cases).sort(byDateDesc('updatedAt'));
}

export async function getCase(id) {
  await delay(250);
  const found = db.cases.find((c) => c.id === id);
  if (!found) throw notFound('Case');
  return clone(found);
}

// ---- Documents -----------------------------------------------------------

export async function listDocuments({ caseId, type, status, q } = {}) {
  await delay(350);
  const term = (q || '').trim().toLowerCase();
  return db.documents
    .filter((d) => !caseId || caseId === 'all' || d.caseId === caseId)
    .filter((d) => !type || type === 'all' || d.type === type)
    .filter((d) => !status || status === 'all' || d.status === status)
    .filter((d) => !term || d.name.toLowerCase().includes(term))
    .map(withPreview)
    .sort(byDateDesc('uploadedAt'));
}

export async function uploadDocument(file, caseId, { onStatus } = {}) {
  onStatus?.('uploading');
  await delay(900);
  if (/fail/i.test(file.name)) throw new Error('Mock upload failure');
  onStatus?.('processing');
  await delay(1400);
  const created = {
    id: newId('doc'),
    caseId,
    name: file.name,
    type: guessType(file.name),
    size: file.size,
    status: 'processed',
    uploadedAt: nowIso(),
    uploadedBy: 'You',
  };
  files.set(created.id, { file, url: URL.createObjectURL(file) });
  db.documents.unshift(created);
  insertActivity(caseId, { actor: 'user', title: 'Document uploaded', description: `${file.name} was added.` });
  insertActivity(caseId, { actor: 'system', title: 'Document processed', description: `${file.name} was read and filed.` });
  touchCase(caseId);
  return withPreview(created);
}

export async function replaceDocument(documentId, file, { onStatus } = {}) {
  onStatus?.('uploading');
  await delay(900);
  if (/fail/i.test(file.name)) throw new Error('Mock replace failure');
  const target = db.documents.find((d) => d.id === documentId);
  if (!target) throw notFound('Document');
  const previous = files.get(documentId);
  if (previous) URL.revokeObjectURL(previous.url);
  files.set(documentId, { file, url: URL.createObjectURL(file) });
  const oldName = target.name;
  Object.assign(target, { name: file.name, size: file.size, status: 'processed', uploadedAt: nowIso(), uploadedBy: 'You' });
  insertActivity(target.caseId, { actor: 'user', title: 'Document replaced', description: `${oldName} was replaced with ${file.name}.` });
  touchCase(target.caseId);
  return withPreview(target);
}

export async function downloadDocument(doc) {
  await delay(200);
  const stored = files.get(doc.id);
  if (!stored) throw Object.assign(new Error('No file attached to sample record'), { code: 'NO_FILE_AVAILABLE' });
  triggerDownload(stored.file, doc.name);
}

// ---- Transcriptions ------------------------------------------------------

export async function listTranscripts({ caseId } = {}) {
  await delay(300);
  return clone(db.transcripts.filter((t) => !caseId || t.caseId === caseId)).sort(byDateDesc('createdAt'));
}

// Returns a fixed sample transcript. No audio is analysed in mock mode.
export async function transcribeAudio(file, { caseId, duration, onStatus } = {}) {
  onStatus?.('uploading');
  await delay(1100);
  if (/fail/i.test(file.name)) throw new Error('Mock transcription failure');
  onStatus?.('transcribing');
  await delay(1800);
  const created = {
    id: newId('tr'),
    caseId: caseId || null,
    fileName: file.name,
    duration: duration ?? sampleTranscript.duration,
    createdAt: nowIso(),
    language: 'en',
    text: joinSegments(sampleTranscript.segments),
    segments: sampleTranscript.segments,
  };
  db.transcripts.unshift(created);
  if (caseId) {
    insertActivity(caseId, { actor: 'user', title: 'Audio uploaded', description: `${file.name} was added.` });
    insertActivity(caseId, { actor: 'system', title: 'Transcript generated', description: `${file.name} was transcribed.` });
    touchCase(caseId);
  }
  return clone(created);
}

// ---- Agent ---------------------------------------------------------------

export async function getAgentStatus(caseId) {
  await delay(250);
  return clone(db.agent[caseId]) ?? { status: 'idle', message: 'There is no active step for this case.', requiredAction: null, updatedAt: nowIso() };
}

export async function getCaseUpdates(caseId) {
  await delay(300);
  return clone(db.activities[caseId] ?? []);
}

export async function getRecentActivity(limit = 8) {
  await delay(300);
  const titles = Object.fromEntries(db.cases.map((c) => [c.id, c.title]));
  return Object.values(db.activities)
    .flat()
    .filter((a) => a.at && a.status !== 'pending')
    .sort(byDateDesc('at'))
    .slice(0, limit)
    .map((a) => ({ ...clone(a), caseTitle: titles[a.caseId] ?? a.caseId }));
}

const TRANSITIONS = {
  user_confirmation: {
    userTitle: 'Information verified',
    userDesc: 'You confirmed the extracted details.',
    nextTitle: 'Request submitted',
    nextDesc: 'The prepared request was sent. A response is awaited.',
    message: 'Your confirmation was received. The request has been submitted and a response is awaited.',
    nextAction: 'Awaiting external response',
  },
  document_uploaded: {
    userTitle: 'Document provided',
    userDesc: 'You supplied the requested document.',
    nextTitle: 'Reviewing new document',
    nextDesc: 'The document is being checked against the request.',
    message: 'The new document was received and is being reviewed.',
    nextAction: 'Awaiting document review',
  },
  physical_action_completed: {
    userTitle: 'In-person step completed',
    userDesc: 'You confirmed the step was done.',
    nextTitle: 'Awaiting provider confirmation',
    nextDesc: 'The provider has been asked to confirm the refund.',
    message: 'Your confirmation was received. The provider is being asked to confirm the refund.',
    nextAction: 'Awaiting provider confirmation',
  },
};

export async function sendToAgent(caseId, payload = {}) {
  await delay(900);
  const target = db.cases.find((c) => c.id === caseId);
  if (!target) throw notFound('Case');
  const t = TRANSITIONS[payload.type];
  if (!t) throw new Error('Unsupported message type');

  const at = nowIso();
  const kept = (db.activities[caseId] ?? [])
    .filter((a) => a.status !== 'pending')
    .map((a) => (a.status === 'current' || a.status === 'failed' ? { ...a, status: 'done' } : a));
  kept.push({ id: newId('act'), caseId, at, actor: 'user', title: t.userTitle, description: t.userDesc, status: 'done' });
  kept.push({ id: newId('act'), caseId, at, actor: 'system', title: t.nextTitle, description: t.nextDesc, status: 'current' });
  db.activities[caseId] = kept;

  Object.assign(target, { status: 'processing', nextAction: t.nextAction, updatedAt: at });
  db.agent[caseId] = { status: 'processing', message: t.message, requiredAction: null, updatedAt: at };
  return clone(db.agent[caseId]);
}
