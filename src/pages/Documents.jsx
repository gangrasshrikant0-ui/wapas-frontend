import { useMemo, useState } from 'react';
import { FileText, Search, Upload } from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import Panel from '../components/common/Panel.jsx';
import Modal from '../components/common/Modal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import Button from '../components/common/Button.jsx';
import { ListSkeleton } from '../components/common/LoadingState.jsx';
import DocumentTable from '../components/documents/DocumentTable.jsx';
import DocumentUploader from '../components/documents/DocumentUploader.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useDocumentActions } from '../hooks/useDocumentActions.jsx';
import { useToast } from '../hooks/useToast.js';
import { listDocuments } from '../services/documentService.js';
import { listCases } from '../services/caseService.js';
import { DOCUMENT_STATUS, DOCUMENT_TYPES } from '../utils/constants.js';

export default function Documents() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [caseId, setCaseId] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const q = useDebounce(search);

  const cases = useAsync(listCases, []);
  const docs = useAsync(() => listDocuments({ q, caseId, type, status }), [q, caseId, type, status, version]);

  const caseTitles = useMemo(() => Object.fromEntries((cases.data ?? []).map((c) => [c.id, c.title])), [cases.data]);
  const refresh = () => setVersion((v) => v + 1);
  const actions = useDocumentActions({ caseTitles, onChanged: refresh });

  const filtersActive = Boolean(q) || caseId !== 'all' || type !== 'all' || status !== 'all';
  const clearFilters = () => { setSearch(''); setCaseId('all'); setType('all'); setStatus('all'); };

  const handleUploaded = (uploaded) => {
    toast.push({ title: uploaded.length === 1 ? 'Document uploaded' : `${uploaded.length} documents uploaded`, tone: 'success' });
    refresh();
  };

  return (
    <>
      <PageHeader
        title="Documents"
        description="All files across your cases, with their processing status."
        actions={<Button variant="primary" icon={Upload} onClick={() => setUploadOpen(true)}>Upload document</Button>}
      />

      <Panel padded={false}>
        <div className="grid gap-3 border-b border-zinc-200 p-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,12rem))]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
            <input type="search" aria-label="Search documents" placeholder="Search by file name" value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" />
          </div>
          <select aria-label="Filter by case" value={caseId} onChange={(e) => setCaseId(e.target.value)} className="input">
            <option value="all">All cases</option>
            {(cases.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <select aria-label="Filter by document type" value={type} onChange={(e) => setType(e.target.value)} className="input">
            <option value="all">All types</option>
            {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="input">
            <option value="all">All statuses</option>
            {Object.entries(DOCUMENT_STATUS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>

        {docs.initialLoading ? (
          <ListSkeleton rows={6} />
        ) : docs.failed ? (
          <ErrorState title="We couldn't load documents" onRetry={docs.reload} />
        ) : docs.data.length === 0 ? (
          filtersActive ? (
            <EmptyState icon={Search} title="No matching documents" description="Try a different search or filter." action={<Button onClick={clearFilters}>Clear filters</Button>} />
          ) : (
            <EmptyState icon={FileText} title="No documents yet" description="Upload a document to attach it to a case." action={<Button icon={Upload} onClick={() => setUploadOpen(true)}>Upload document</Button>} />
          )
        ) : (
          <DocumentTable documents={docs.data} caseTitles={caseTitles} onView={actions.onView} onDownload={actions.onDownload} onReplace={actions.onReplace} />
        )}
      </Panel>

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload documents"
        description="Choose the case these files belong to."
        footer={<Button variant="primary" onClick={() => setUploadOpen(false)}>Done</Button>}
      >
        <DocumentUploader cases={cases.data ?? []} onUploaded={handleUploaded} />
      </Modal>
      {actions.dialogs}
    </>
  );
}
