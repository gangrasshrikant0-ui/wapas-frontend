import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Dropzone from '../common/Dropzone.jsx';
import Button from '../common/Button.jsx';
import FileTypeIcon from './FileTypeIcon.jsx';
import { uploadDocument } from '../../services/documentService.js';
import { validateFile } from '../../utils/files.js';
import { formatBytes } from '../../utils/format.js';
import { ACCEPTED_DOC_EXT, MAX_DOC_MB, toAcceptAttr } from '../../utils/constants.js';

const STATE_LABEL = {
  queued: 'Queued',
  uploading: 'Uploading…',
  processing: 'Processing…',
  processed: 'Processed',
  uploaded: 'Uploaded',
  requires_review: 'Requires review',
  failed: 'Failed',
  rejected: 'Not accepted',
};

function StateIcon({ state }) {
  if (state === 'uploading' || state === 'processing' || state === 'queued') return <Loader2 className="h-4 w-4 animate-spin text-blue-600" aria-hidden />;
  if (state === 'processed' || state === 'uploaded') return <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />;
  return <AlertCircle className={`h-4 w-4 ${state === 'requires_review' ? 'text-amber-600' : 'text-red-600'}`} aria-hidden />;
}

/**
 * Upload UI for documents. Pass `caseId` to fix the target case, or `cases`
 * to let the user choose. Calls `onUploaded(documents)` after each batch.
 */
export default function DocumentUploader({ caseId, cases = [], onUploaded }) {
  const [selectedCase, setSelectedCase] = useState(caseId ?? '');
  const [items, setItems] = useState([]);
  const targetCase = caseId ?? selectedCase;

  const patch = (key, changes) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...changes } : i)));

  const uploadOne = async (entry) => {
    patch(entry.key, { state: 'uploading', error: null });
    try {
      const doc = await uploadDocument(entry.file, targetCase, { onStatus: (state) => patch(entry.key, { state }) });
      patch(entry.key, { state: doc.status ?? 'processed' });
      return doc;
    } catch {
      patch(entry.key, { state: 'failed', error: "We couldn't process this document. Please try again." });
      return null;
    }
  };

  const handleFiles = async (files) => {
    if (!targetCase) return;
    const entries = files.map((file) => {
      const error = validateFile(file, ACCEPTED_DOC_EXT, MAX_DOC_MB);
      return { key: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`, file, state: error ? 'rejected' : 'queued', error };
    });
    setItems((list) => [...entries, ...list]);

    const uploaded = [];
    for (const entry of entries.filter((e) => e.state !== 'rejected')) {
      const doc = await uploadOne(entry);
      if (doc) uploaded.push(doc);
    }
    if (uploaded.length) onUploaded?.(uploaded);
  };

  const retry = async (entry) => {
    const doc = await uploadOne(entry);
    if (doc) onUploaded?.([doc]);
  };

  return (
    <div className="space-y-4">
      {!caseId && (
        <div>
          <label htmlFor="uploader-case" className="label">Case</label>
          <select id="uploader-case" className="input" value={selectedCase} onChange={(e) => setSelectedCase(e.target.value)}>
            <option value="">Select a case</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      )}

      <Dropzone
        multiple
        accept={toAcceptAttr(ACCEPTED_DOC_EXT)}
        disabled={!targetCase}
        onFiles={handleFiles}
        title={targetCase ? 'Drop files here or click to browse' : 'Select a case to upload documents'}
        hint="PDF, DOCX, TXT, JPG or PNG, up to 25 MB each"
      />

      {items.length > 0 && (
        <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200" aria-live="polite">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-3 px-3 py-2.5">
              <FileTypeIcon name={item.file.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">{item.file.name}</p>
                <p className={`text-xs ${item.error ? 'text-red-600' : 'text-zinc-500'}`}>{item.error ?? formatBytes(item.file.size)}</p>
              </div>
              <span className="flex items-center gap-1.5 text-[13px] text-zinc-700">
                <StateIcon state={item.state} />
                {STATE_LABEL[item.state] ?? item.state}
              </span>
              {item.state === 'failed' && <Button size="sm" onClick={() => retry(item)}>Retry</Button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
