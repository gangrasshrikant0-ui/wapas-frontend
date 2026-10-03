import { Link } from 'react-router-dom';
import { Cog, User } from 'lucide-react';
import { formatDateTime } from '../../utils/format.js';

/** Recent activity across cases, newest first. */
export default function ActivityFeed({ items }) {
  return (
    <ul className="divide-y divide-zinc-200">
      {items.map((a) => {
        const Icon = a.actor === 'user' ? User : Cog;
        return (
          <li key={a.id} className="flex gap-3 px-4 py-3 sm:px-5">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${a.actor === 'user' ? 'bg-accent-50 text-accent-700' : 'bg-zinc-100 text-zinc-500'}`}>
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900">{a.title}</p>
              <p className="mt-0.5 text-[13px] text-zinc-600">
                <Link to={`/cases/${a.caseId}`} className="hover:text-accent-700 hover:underline">{a.caseTitle}</Link>
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{formatDateTime(a.at)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
