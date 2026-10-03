import { api, API_BASE_URL, USE_MOCK, buildQuery } from './api';
import * as mock from './mock/mockApi';
import { triggerDownload } from '../utils/files';

/*
 * Document shape:
 * { id, caseId, name, type, size (bytes), status, uploadedAt, uploadedBy }
 * `status` is one of DOCUMENT_STATUS in utils/constants.js.
 */

export const NO_FILE = 'NO_FILE_AVAILABLE';

export async function listDocuments(filters = {}) {
  if (USE_MOCK) return mock.listDocuments(filters);
  const { caseId, type, status, q } = filters;
  return api.get(`/documents${buildQuery({ case_id: caseId, type, status, q })}`);
}

/**
 * Uploads a document for a case and resolves with the created Document.
 * `onStatus` receives "uploading" | "processing" while work is in flight so the
 * UI can show progress. Backends that process asynchronously can simply return
 * a document with status "processing" and the list will pick up the final
 * state on the next fetch.
 */
export async function uploadDocument(file, caseId, { onStatus } = {}) {
  if (USE_MOCK) return mock.uploadDocument(file, caseId, { onStatus });
  onStatus?.('uploading');
  const form = new FormData();
  form.append('file', file);
  form.append('case_id', caseId);
  return api.post('/documents', form);
}

/** Replaces the file behind an existing document. */
export async function replaceDocument(documentId, file, { onStatus } = {}) {
  if (USE_MOCK) return mock.replaceDocument(documentId, file, { onStatus });
  onStatus?.('uploading');
  const form = new FormData();
  form.append('file', file);
  return api.put(`/documents/${encodeURIComponent(documentId)}`, form);
}

export async function downloadDocument(doc) {
  if (USE_MOCK) return mock.downloadDocument(doc);
  const blob = await api.blob(`/documents/${encodeURIComponent(doc.id)}/download`);
  triggerDownload(blob, doc.name);
}

/**
 * URL used for the inline preview, or null when no preview is available.
 * In live mode this points at the backend; it must be reachable by the browser
 * (cookie auth or a signed URL). Swap for a signed-URL request if needed.
 */
export function getDocumentPreviewUrl(doc) {
  if (USE_MOCK) return doc.previewUrl ?? null;
  return `${API_BASE_URL}/documents/${encodeURIComponent(doc.id)}/content`;
}
