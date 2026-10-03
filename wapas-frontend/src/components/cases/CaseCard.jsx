import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

/** Compact case summary used in the mobile list. */
export default function CaseCard({ caseData: c }) {
  return (
    <Link to={`/cases/${c.id}`} className="block px-4 py-3.5 transition-colors hover:bg-zinc-50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-zinc-900">{c.title}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{c.type}</p>
        </div>
        <p className="shrink-0 font-medium tabular-nums text-zinc-900">{formatCurrency(c.amount)}</p>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <StatusBadge status={c.status} />
        <p className="text-xs text-zinc-500">Updated {formatDate(c.updatedAt)}</p>
      </div>
      <p className="mt-2 text-[13px] text-zinc-600">{c.nextAction}</p>
    </Link>
  );
}
