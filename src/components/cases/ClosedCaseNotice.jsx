import { Lock } from 'lucide-react';
import { formatDate } from '../../utils/format.js';

export default function ClosedCaseNotice({ caseData }) {
  return (
    <section className="rounded-lg border border-zinc-300 bg-zinc-50 p-4 sm:p-5">
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white">
          <Lock className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-medium text-zinc-500">Case closed</p>
          <p className="mt-1 text-sm font-semibold tracking-wide text-zinc-900">UNRECOVERABLE</p>
          <p className="mt-2 max-w-xl text-sm text-zinc-700">
            The available recovery paths have been exhausted. No further automated action is available for this case.
          </p>
          <p className="mt-2 text-xs text-zinc-500">Closed on {formatDate(caseData.updatedAt)}</p>
        </div>
      </div>
    </section>
  );
}
