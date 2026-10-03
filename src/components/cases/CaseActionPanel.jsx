import { useState } from 'react';
import { CheckCircle2, Clock, Loader2, MapPin, ShieldCheck, Upload, UserCheck } from 'lucide-react';
import Button from '../common/Button.jsx';
import ConfirmationDialog from '../common/ConfirmationDialog.jsx';
import { Skeleton } from '../common/LoadingState.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import ClosedCaseNotice from './ClosedCaseNotice.jsx';
import { formatDateTime } from '../../utils/format.js';

const HEADINGS = {
  awaiting_user_action: 'Action required from you',
  processing: 'In progress, handled by the system',
  completed: 'Completed',
  idle: 'No active step',
  failed: 'Needs attention',
};

function StateIcon({ status, requiredAction }) {
  if (status === 'awaiting_user_action') {
    const Icon = requiredAction === 'physical_action' ? MapPin : UserCheck;
    return <Icon className="h-4 w-4" aria-hidden />;
  }
  if (status === 'processing') return <Loader2 className="h-4 w-4 animate-spin" aria-hidden />;
  if (status === 'completed') return <CheckCircle2 className="h-4 w-4" aria-hidden />;
  return <Clock className="h-4 w-4" aria-hidden />;
}

const iconTone = {
  awaiting_user_action: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
};

/**
 * Shows what the agent reported and, when the agent needs the user, the matching call to action.
 * Everything here is driven by AgentStatus { status, message, requiredAction, details }.
 */
export default function CaseActionPanel({ caseData, agent, loading, onAction, onRequestUpload }) {
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [physicalOpen, setPhysicalOpen] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  if (caseData.status === 'unrecoverable' || agent?.status === 'unrecoverable') {
    return <ClosedCaseNotice caseData={caseData} />;
  }
  if (!agent) {
    return loading ? <Skeleton className="h-28 w-full" /> : null;
  }

  const waiting = agent.status === 'awaiting_user_action';
  const action = agent.requiredAction;

  const confirm = (type, close) => async () => {
    const ok = await onAction({ type });
    if (ok) {
      close();
      setReviewed(false);
    }
  };

  return (
    <section className={`rounded-lg border bg-white ${waiting ? 'border-amber-300' : 'border-zinc-200'}`}>
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconTone[agent.status] ?? 'bg-zinc-100 text-zinc-600'}`}>
            <StateIcon status={agent.status} requiredAction={action} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-zinc-900">{HEADINGS[agent.status] ?? 'Current step'}</p>
              <StatusBadge status={agent.status} kind="agent" />
            </div>
            <p className="mt-1.5 max-w-2xl text-sm text-zinc-700">{agent.message}</p>
            {agent.status === 'processing' && <p className="mt-1 text-[13px] text-zinc-500">No action is needed from you right now.</p>}
            <p className="mt-1.5 text-xs text-zinc-500">Updated {formatDateTime(agent.updatedAt)}</p>
          </div>
        </div>

        {waiting && (
          <div className="flex shrink-0 flex-wrap gap-2">
            {action === 'user_confirmation' && (
              <>
                <Button icon={Upload} onClick={onRequestUpload}>Upload document</Button>
                <Button variant="primary" icon={ShieldCheck} onClick={() => setVerifyOpen(true)}>Verify information</Button>
              </>
            )}
            {action === 'upload_document' && (
              <Button variant="primary" icon={Upload} onClick={onRequestUpload}>Upload document</Button>
            )}
            {action === 'physical_action' && (
              <Button variant="primary" icon={CheckCircle2} onClick={() => setPhysicalOpen(true)}>Mark as completed</Button>
            )}
          </div>
        )}
      </div>

      {agent.details?.length > 0 && (
        <div className="border-t border-zinc-200 bg-zinc-50/60 px-4 py-4 sm:px-5">
          <p className="text-xs font-medium text-zinc-500">
            {action === 'user_confirmation' ? 'Prepared by the system, please check each item' : 'Details'}
          </p>
          <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {agent.details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs text-zinc-500">{d.label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-zinc-900">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <ConfirmationDialog
        open={verifyOpen}
        title="Verify information"
        description="The prepared request will be submitted once you confirm. You remain responsible for the accuracy of the details shown on this page."
        confirmLabel="Confirm and continue"
        confirmDisabled={!reviewed}
        onCancel={() => { setVerifyOpen(false); setReviewed(false); }}
        onConfirm={confirm('user_confirmation', () => setVerifyOpen(false))}
      >
        <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-zinc-800">
          <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-accent-600" />
          I have checked these details against my documents.
        </label>
      </ConfirmationDialog>

      <ConfirmationDialog
        open={physicalOpen}
        title="Mark this step as completed?"
        description="Confirm only if you have completed this step in person. The system will continue from here."
        confirmLabel="Yes, it is done"
        onCancel={() => setPhysicalOpen(false)}
        onConfirm={confirm('physical_action_completed', () => setPhysicalOpen(false))}
      />
    </section>
  );
}
