import { Download } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { getDocumentPreviewUrl } from '../../services/documentService.js';
import { getExtension } from '../../utils/files.js';
import { formatBytes, formatDateTime } from '../../utils/format.js';

const IMAGE_EXT = ['jpg', 'jpeg', 'png'];
const FRAME_EXT = ['pdf', 'txt'];

export default function DocumentPreviewModal({ doc, caseTitle, onClose, onDownload }) {
  if (!doc) return null;
  const ext = getExtension(doc.name);
  const url = getDocumentPreviewUrl(doc);
  const previewable = url && (IMAGE_EXT.includes(ext) || FRAME_EXT.includes(ext));

  return (
    <Modal
      open
      size="lg"
      title={doc.name}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Close</Button>
          <Button variant="primary" icon={Download} onClick={() => onDownload(doc)}>Download</Button>
        </>
      }
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {[
          ['Case', caseTitle],
          ['Type', doc.type],
          ['Size', formatBytes(doc.size)],
          ['Uploaded', formatDateTime(doc.uploadedAt)],
          ['Uploaded by', doc.uploadedBy ?? '—'],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-zinc-500">{label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-zinc-900">{value}</dd>
          </div>
        ))}
        <div>
          <dt className="text-xs text-zinc-500">Status</dt>
          <dd className="mt-0.5"><StatusBadge status={doc.status} kind="document" /></dd>
        </div>
      </dl>

      <div className="mt-5 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
        {previewable && IMAGE_EXT.includes(ext) && <img src={url} alt={doc.name} className="mx-auto max-h-[55vh] object-contain" />}
        {previewable && FRAME_EXT.includes(ext) && <iframe src={url} title={doc.name} className="h-[55vh] w-full bg-white" />}
        {!previewable && (
          <p className="px-6 py-12 text-center text-sm text-zinc-500">
            {ext === 'docx' ? 'Preview is not available for Word documents. Download the file to open it.' : 'No file is attached to this sample record, so there is nothing to preview.'}
          </p>
        )}
      </div>
    </Modal>
  );
}
