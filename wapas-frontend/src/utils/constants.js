// Display configuration for every status the UI can show.
// `tone` maps to the colour treatment in StatusBadge.

export const CASE_STATUS = {
  new: { label: 'New', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'info' },
  awaiting_verification: { label: 'Awaiting verification', tone: 'warning' },
  action_required: { label: 'Action required', tone: 'danger' },
  completed: { label: 'Completed', tone: 'success' },
  unrecoverable: { label: 'Unrecoverable', tone: 'closed' },
};

export const DOCUMENT_STATUS = {
  uploaded: { label: 'Uploaded', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'info' },
  processed: { label: 'Processed', tone: 'success' },
  requires_review: { label: 'Requires review', tone: 'warning' },
  failed: { label: 'Failed', tone: 'danger' },
};

// Status values the agent is expected to return from getAgentStatus().
export const AGENT_STATUS = {
  idle: { label: 'No active step', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'info' },
  awaiting_user_action: { label: 'Awaiting user action', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
  unrecoverable: { label: 'Closed', tone: 'closed' },
  failed: { label: 'Needs attention', tone: 'danger' },
};

export const JOB_STATUS = {
  idle: { label: 'Not started', tone: 'neutral' },
  uploading: { label: 'Uploading audio…', tone: 'info' },
  transcribing: { label: 'Transcribing…', tone: 'info' },
  ready: { label: 'Complete', tone: 'success' },
  error: { label: 'Failed', tone: 'danger' },
};

export const TRANSCRIPT_STATUS = {
  pending: { label: 'Not available', tone: 'neutral' },
  ready: { label: 'Transcript ready', tone: 'success' },
  error: { label: 'Not available', tone: 'danger' },
};

export const ACTIVE_CASE_STATUSES = ['new', 'processing', 'awaiting_verification', 'action_required'];
export const PENDING_ACTION_STATUSES = ['awaiting_verification', 'action_required'];

export const DOCUMENT_TYPES = ['Invoice', 'Request', 'Receipt', 'Correspondence', 'Claim form', 'Contract', 'Medical record', 'Other'];

export const ACCEPTED_DOC_EXT = ['pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
export const ACCEPTED_AUDIO_EXT = ['mp3', 'wav', 'm4a', 'webm'];
export const MAX_DOC_MB = 25;
export const MAX_AUDIO_MB = 100;
export const toAcceptAttr = (exts) => exts.map((e) => `.${e}`).join(',');
