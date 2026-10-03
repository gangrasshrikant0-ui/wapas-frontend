import { api, USE_MOCK, buildQuery } from './api';
import * as mock from './mock/mockApi';

/**
 * The agent is a separate system. The UI only relies on this contract:
 *
 * AgentStatus {
 *   status: "idle" | "processing" | "awaiting_user_action" | "completed" | "unrecoverable" | "failed",
 *   message: string,                 // plain-language summary shown to the user
 *   requiredAction: "user_confirmation" | "upload_document" | "physical_action" | null,
 *   details?: { label: string, value: string }[],   // optional items for the user to verify
 *   updatedAt: ISO string
 * }
 *
 * ActivityItem {
 *   id, caseId, at (ISO | null), actor: "system" | "user", title, description,
 *   status: "done" | "current" | "pending" | "failed" | "closed"
 * }
 */

/**
 * Sends something the user did (or an event) to the agent.
 * payload.type examples: "user_confirmation", "document_uploaded", "physical_action_completed".
 * Returns the agent's new AgentStatus.
 */
export async function sendToAgent(caseId, payload) {
  if (USE_MOCK) return mock.sendToAgent(caseId, payload);
  return api.post(`/cases/${encodeURIComponent(caseId)}/agent/messages`, payload);
}

export async function getAgentStatus(caseId) {
  if (USE_MOCK) return mock.getAgentStatus(caseId);
  return api.get(`/cases/${encodeURIComponent(caseId)}/agent/status`);
}

/** Chronological activity for one case, oldest first. */
export async function getCaseUpdates(caseId) {
  if (USE_MOCK) return mock.getCaseUpdates(caseId);
  return api.get(`/cases/${encodeURIComponent(caseId)}/activity`);
}

/** Recent activity across all cases, newest first. Each item also carries caseTitle. */
export async function getRecentActivity(limit = 8) {
  if (USE_MOCK) return mock.getRecentActivity(limit);
  return api.get(`/activity${buildQuery({ limit })}`);
}
