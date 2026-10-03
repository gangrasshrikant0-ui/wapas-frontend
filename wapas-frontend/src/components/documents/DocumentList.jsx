import StatusBadge from '../common/StatusBadge.jsx';
import FileTypeIcon from './FileTypeIcon.jsx';
import DocumentActions from './DocumentActions.jsx';
import { formatBytes, formatDate } from '../../utils/format.js';

/** Row list used inside a case. The Document Center uses DocumentTable. */
export default function DocumentList({ documents, onView, onDownload, onReplace }) {
  return (
    <ul className="divide-y divide-zinc-200">
      {documents.map((d) => (
        <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <FileTypeIcon name={d.name} />
            <div className="min-w-0">
              <p className="truncate font-medium text-zinc-900">{d.name}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{d.type}, {formatBytes(d.size)}, added {formatDate(d.uploadedAt)}</p>
            </div>
          </div>
          <StatusBadge status={d.status} kind="document" />
          <DocumentActions doc={d} onView={onView} onDownload={onDownload} onReplace={onReplace} />
        </li>
      ))}
    </ul>
  );
}
