import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.jsx';
import CaseCard from './CaseCard.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

export default function CaseTable({ cases, compact = false }) {
  const navigate = useNavigate();
  const headers = [
    { key: 'case', label: 'Case' },
    !compact && { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'updated', label: 'Last updated' },
    { key: 'amount', label: 'Amount', align: 'right' },
    !compact && { key: 'next', label: 'Next action' },
  ].filter(Boolean);

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/70">
              {headers.map((h) => (
                <th key={h.key} scope="col" className={`px-5 py-2.5 text-xs font-medium text-zinc-500 ${h.align === 'right' ? 'text-right' : ''}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {cases.map((c) => (
              <tr
                key={c.id}
                onClick={(e) => {
                  if (!e.target.closest('a')) navigate(`/cases/${c.id}`);
                }}
                className="cursor-pointer transition-colors hover:bg-zinc-50"
              >
                <td className="px-5 py-3">
                  <Link to={`/cases/${c.id}`} className="font-medium text-zinc-900 hover:text-accent-700 hover:underline">
                    {c.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-zinc-500">{c.id}</p>
                </td>
                {!compact && <td className="px-5 py-3 text-zinc-700">{c.type}</td>}
                <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                <td className="whitespace-nowrap px-5 py-3 text-zinc-600">{formatDate(c.updatedAt)}</td>
                <td className="whitespace-nowrap px-5 py-3 text-right font-medium tabular-nums text-zinc-900">{formatCurrency(c.amount)}</td>
                {!compact && <td className="px-5 py-3 text-zinc-600">{c.nextAction}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-zinc-200 md:hidden">
        {cases.map((c) => (
          <li key={c.id}><CaseCard caseData={c} /></li>
        ))}
      </ul>
    </>
  );
}
