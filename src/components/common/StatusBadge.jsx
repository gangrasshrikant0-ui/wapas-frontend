import { AGENT_STATUS, CASE_STATUS, DOCUMENT_STATUS, JOB_STATUS, TRANSCRIPT_STATUS } from '../../utils/constants';

const registry = { case: CASE_STATUS, document: DOCUMENT_STATUS, agent: AGENT_STATUS, job: JOB_STATUS, transcript: TRANSCRIPT_STATUS };

const tones = {
  neutral: { badge: 'bg-zinc-50 text-zinc-700 ring-zinc-200', dot: 'bg-zinc-400' },
  info: { badge: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-500' },
  warning: { badge: 'bg-amber-50 text-amber-800 ring-amber-200', dot: 'bg-amber-500' },
  danger: { badge: 'bg-red-50 text-red-700 ring-red-200', dot: 'bg-red-500' },
  success: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  closed: { badge: 'bg-zinc-800 text-zinc-50 ring-zinc-800', dot: 'bg-zinc-400' },
};

export default function StatusBadge({ status, kind = 'case', className = '' }) {
  const config = registry[kind]?.[status] ?? { label: status, tone: 'neutral' };
  const tone = tones[config.tone] ?? tones.neutral;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tone.badge} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden />
      {config.label}
    </span>
  );
}
