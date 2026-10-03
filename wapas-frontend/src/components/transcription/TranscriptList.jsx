import { FileAudio } from 'lucide-react';
import { formatDate, formatDuration } from '../../utils/format.js';

export default function TranscriptList({ items, selectedId, onSelect, caseTitles = {} }) {
  return (
    <ul className="divide-y divide-zinc-200">
      {items.map((t) => {
        const selected = t.id === selectedId;
        return (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onSelect(t)}
              aria-current={selected ? 'true' : undefined}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors sm:px-5 ${selected ? 'bg-accent-50' : 'hover:bg-zinc-50'}`}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-500">
                <FileAudio className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-zinc-900">{t.fileName}</span>
                <span className="mt-0.5 block text-xs text-zinc-500">
                  {formatDuration(t.duration)}, {formatDate(t.createdAt)}
                </span>
                {t.caseId && <span className="mt-0.5 block truncate text-xs text-zinc-500">{caseTitles[t.caseId] ?? t.caseId}</span>}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
