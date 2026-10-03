import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.jsx';
import FileTypeIcon from './FileTypeIcon.jsx';
import DocumentActions from './DocumentActions.jsx';
import { formatBytes, formatDate } from '../../utils/format.js';

export default function DocumentTable({ documents, caseTitles, onView, onDownload, onReplace }) {
  const caseLink = (d) => (
    <Link to={`/cases/${d.caseId}`} className="text-zinc-700 hover:text-accent-700 hover:underline">
      {caseTitles[d.caseId] ?? d.caseId}
    </Link>
  );

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/70">
              {['Document', 'Case', 'Type', 'Status', 'Uploaded', ''].map((h, i) => (
                <th key={h || i} scope="col" className="px-5 py-2.5 text-xs font-medium text-zinc-500">
                  {h || <span className="sr-only">Actions</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {documents.map((d) => (
              <tr key={d.id} className="hover:bg-zinc-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <FileTypeIcon name={d.name} />
                    <div className="min-w-0">
                      <p className="max-w-[260px] truncate font-medium text-zinc-900">{d.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{formatBytes(d.size)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">{caseLink(d)}</td>
                <td className="px-5 py-3 text-zinc-700">{d.type}</td>
                <td className="px-5 py-3"><StatusBadge status={d.status} kind="document" /></td>
                <td className="whitespace-nowrap px-5 py-3 text-zinc-600">{formatDate(d.uploadedAt)}</td>
                <td className="px-5 py-3"><DocumentActions doc={d} onView={onView} onDownload={onDownload} onReplace={onReplace} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-zinc-200 md:hidden">
        {documents.map((d) => (
          <li key={d.id} className="px-4 py-3.5">
            <div className="flex items-start gap-3">
              <FileTypeIcon name={d.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900">{d.name}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{d.type}, {formatBytes(d.size)}</p>
                <p className="mt-1 text-[13px]">{caseLink(d)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <StatusBadge status={d.status} kind="document" />
              <DocumentActions doc={d} onView={onView} onDownload={onDownload} onReplace={onReplace} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
