import { api, USE_MOCK } from './api';
import * as mock from './mock/mockApi';
import { listDocuments } from './documentService';
import { listTranscripts } from './transcriptionService';
import { getRecentActivity } from './agentService';
import { ACTIVE_CASE_STATUSES, PENDING_ACTION_STATUSES } from '../utils/constants';

/*
 * Case shape:
 * { id, title, type, status, amount, createdAt, updatedAt, nextAction, reference, counterparty }
 * `status` is one of CASE_STATUS in utils/constants.js.
 */

export async function listCases() {
  if (USE_MOCK) return mock.listCases();
  const data = await api.get('/cases');
  return data.cases ?? data;
}

export async function getCase(id) {
  if (USE_MOCK) return mock.getCase(id);
  return api.get(`/cases/${encodeURIComponent(id)}`);
}

/** Aggregates what the dashboard needs. Replace with a single /dashboard endpoint if the backend offers one. */
export async function getDashboardSummary() {
  const [cases, documents, transcripts, activity] = await Promise.all([
    listCases(),
    listDocuments(),
    listTranscripts(),
    getRecentActivity(8),
  ]);
  const byUpdated = [...cases].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return {
    stats: {
      totalCases: cases.length,
      activeCases: cases.filter((c) => ACTIVE_CASE_STATUSES.includes(c.status)).length,
      documentsProcessed: documents.filter((d) => d.status === 'processed').length,
      documentsTotal: documents.length,
      transcripts: transcripts.length,
      transcriptCases: new Set(transcripts.map((t) => t.caseId).filter(Boolean)).size,
      pendingActions: cases.filter((c) => PENDING_ACTION_STATUSES.includes(c.status)).length,
    },
    attention: byUpdated.filter((c) => PENDING_ACTION_STATUSES.includes(c.status)),
    recent: byUpdated.slice(0, 5),
    activity,
  };
}
