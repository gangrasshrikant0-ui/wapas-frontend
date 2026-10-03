/**
 * Central API client.
 *
 * Configuration (see .env.example):
 *   VITE_API_BASE_URL   Base URL of the WAPAS backend / agent gateway.
 *   VITE_USE_MOCK_API   "true" serves sample data from ./mock, "false" calls the backend.
 *
 * ---------------------------------------------------------------------------
 * ENDPOINTS THE FRONTEND EXPECTS (connect the real backend here)
 *
 *   GET    /health                          connection check (Settings page)
 *   GET    /cases                           -> Case[]
 *   GET    /cases/:id                       -> Case
 *   GET    /cases/:id/agent/status          -> { status, message, requiredAction, details?, updatedAt }
 *   GET    /cases/:id/activity              -> ActivityItem[]   (oldest first)
 *   POST   /cases/:id/agent/messages        body: { type, ...payload } -> agent status
 *   GET    /activity?limit=                 -> ActivityItem[]   (recent across cases)
 *   GET    /documents?case_id=&type=&status=&q=   -> Document[]
 *   POST   /documents                       multipart: file, case_id -> Document
 *   PUT    /documents/:id                   multipart: file -> Document   (replace)
 *   GET    /documents/:id/download          -> file bytes
 *   GET    /documents/:id/content           -> inline file for preview
 *   GET    /transcriptions?case_id=         -> Transcript[]
 *   POST   /transcriptions                  multipart: audio, case_id? -> Transcript | { jobId }
 *   GET    /transcriptions/:jobId           -> Transcript | { status: "processing" }
 *
 * Shapes are documented next to each service function.
 * ---------------------------------------------------------------------------
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK_API ?? 'true') === 'true';

export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Attach authentication here (for example an Authorization header from your
 * auth layer). Never put API keys in this bundle: anything in a Vite build is public.
 */
function getAuthHeaders() {
  return {};
}

async function request(path, { method = 'GET', body, signal, as = 'json' } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: as === 'json' ? 'application/json' : '*/*',
        ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
        ...getAuthHeaders(),
      },
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Network request failed', { code: 'NETWORK' });
  }

  if (!response.ok) {
    let detail = null;
    try {
      detail = await response.json();
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(detail?.message || `Request failed with status ${response.status}`, {
      status: response.status,
      code: detail?.code,
    });
  }

  if (response.status === 204) return null;
  return as === 'blob' ? response.blob() : response.json();
}

export const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  blob: (path, options) => request(path, { ...options, as: 'blob' }),
};

export const buildQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'all') q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
};

/** Technical errors are never shown to the user; this returns copy that is safe to display. */
export function toUserMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof ApiError && error.code === 'NETWORK') {
    return "We couldn't reach the server. Check your connection and try again.";
  }
  return fallback;
}

export async function checkConnection() {
  if (USE_MOCK) return { ok: true, mode: 'mock' };
  await api.get('/health');
  return { ok: true, mode: 'live' };
}
