import { api, USE_MOCK, buildQuery } from './api';
import * as mock from './mock/mockApi';

/*
 * Transcript shape (what the backend should return):
 * {
 *   id?: string,
 *   text: string,
 *   segments?: [{ start: number, end: number, text: string }],   // seconds
 *   duration?: number,
 *   language?: string,
 *   fileName?: string, caseId?: string | null, createdAt?: ISO string
 * }
 * Segments are optional. The viewer shows timestamps only when they exist.
 */

function normalizeTranscript(raw, file, caseId) {
  const segments = Array.isArray(raw.segments) ? raw.segments : [];
  return {
    id: raw.id ?? `local-${Date.now()}`,
    text: raw.text ?? segments.map((s) => s.text).join(' '),
    segments,
    duration: raw.duration ?? null,
    language: raw.language ?? null,
    fileName: raw.fileName ?? file.name,
    caseId: raw.caseId ?? caseId ?? null,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Transcribes an audio file.
 * `onStatus` receives "uploading" and then "transcribing".
 *
 * Live mode supports two backend styles:
 *   1. Synchronous: POST /transcriptions returns the transcript directly.
 *   2. Job based:   POST /transcriptions returns { jobId }; the transcript is
 *                   polled from GET /transcriptions/:jobId until it is ready.
 */
export async function transcribeAudio(file, { caseId, duration, onStatus } = {}) {
  if (USE_MOCK) return mock.transcribeAudio(file, { caseId, duration, onStatus });

  onStatus?.('uploading');
  const form = new FormData();
  form.append('audio', file);
  if (caseId) form.append('case_id', caseId);
  let result = await api.post('/transcriptions', form);

  if (result?.jobId) {
    onStatus?.('transcribing');
    const jobId = result.jobId;
    for (let attempt = 0; attempt < 120; attempt += 1) {
      await wait(2000);
      result = await api.get(`/transcriptions/${encodeURIComponent(jobId)}`);
      if (result?.status === 'failed') throw new Error('Transcription failed');
      if (result?.text !== undefined || result?.segments) break;
    }
  }
  if (!result || (result.text === undefined && !result.segments)) throw new Error('Transcription timed out');
  return normalizeTranscript(result, file, caseId);
}

export async function listTranscripts({ caseId } = {}) {
  if (USE_MOCK) return mock.listTranscripts({ caseId });
  return api.get(`/transcriptions${buildQuery({ case_id: caseId })}`);
}
