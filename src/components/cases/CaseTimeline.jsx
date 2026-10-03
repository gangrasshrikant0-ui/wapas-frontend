import { AlertCircle, Check, Cog, Lock, User } from 'lucide-react';
import { formatDateTime } from '../../utils/format.js';

const markers = {
  done: 'bg-emerald-600 text-white',
  current: 'border-2 border-accent-600 bg-white',
  pending: 'border border-dashed border-zinc-300 bg-white',
  failed: 'bg-red-600 text-white',
  closed: 'bg-zinc-800 text-white',
};

function Marker({ status }) {
  return (
    <span className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${markers[status] ?? markers.pending}`}>
      {status === 'done' && <Check className="h-3 w-3" strokeWidth={3} aria-hidden />}
      {status === 'current' && <span className="h-1.5 w-1.5 rounded-full bg-accent-600" />}
      {status === 'failed' && <AlertCircle className="h-3 w-3" aria-hidden />}
      {status === 'closed' && <Lock className="h-2.5 w-2.5" aria-hidden />}
    </span>
  );
}

function ActorTag({ actor }) {
  const isUser = actor === 'user';
  const Icon = isUser ? User : Cog;
  return (
    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${isUser ? 'bg-accent-50 text-accent-700' : 'bg-zinc-100 text-zinc-600'}`}>
      <Icon className="h-3 w-3" aria-hidden />
      {isUser ? 'You' : 'System'}
    </span>
  );
}

export default function CaseTimeline({ items }) {
  return (
    <ol>
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
          {i < items.length - 1 && <span aria-hidden className="absolute bottom-0 left-[9.5px] top-5 w-px bg-zinc-200" />}
          <Marker status={item.status} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className={`text-sm font-medium ${item.status === 'pending' ? 'text-zinc-500' : 'text-zinc-900'}`}>{item.title}</p>
              <ActorTag actor={item.actor} />
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">{item.at ? formatDateTime(item.at) : 'Upcoming'}</p>
            {item.description && <p className="mt-1 text-[13px] leading-5 text-zinc-600">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
