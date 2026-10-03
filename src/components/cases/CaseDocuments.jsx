import { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import Panel from '../common/Panel.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import EmptyState from '../common/EmptyState.jsx';
import ErrorState from '../common/ErrorState.jsx';
import { ListSkeleton } from '../common/LoadingState.jsx';
import DocumentList from '../documents/DocumentList.jsx';
import DocumentUploader from '../documents/DocumentUploader.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { useDocumentActions } from '../../hooks/useDocumentActions.jsx';
import { useToast } from '../../hooks/useToast.js';
import { listDocuments } from '../../services/documentService.js';

export default function CaseDocuments({ caseData, version, onChanged }) {
  const toast = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const q = useAsync(() => listDocuments({ caseId: caseData.id }), [caseData.id, version]);
  const actions = useDocumentActions({ caseTitles: { [caseData.id]: caseData.title }, onChanged });

  const handleUploaded = (docs) => {
    toast.push({ title: docs.length === 1 ? 'Document uploaded' : `${docs.length} documents uploaded`, tone: 'success' });
    onChanged();
  };

  return (
    <Panel
      title="Documents"
      description="Files linked to this case."
      padded={false}
      actions={<Button size="sm" icon={Upload} onClick={() => setUploadOpen(true)}>Upload document</Button>}
    >
      {q.initialLoading ? (
        <ListSkeleton rows={3} />
      ) : q.failed ? (
        <ErrorState title="We couldn't load documents" onRetry={q.reload} />
      ) : q.data.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload invoices, receipts or correspondence related to this case."
          action={<Button icon={Upload} onClick={() => setUploadOpen(true)}>Upload document</Button>}
        />
      ) : (
        <DocumentList documents={q.data} onView={actions.onView} onDownload={actions.onDownload} onReplace={actions.onReplace} />
      )}

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload document"
        description={caseData.title}
        footer={<Button variant="primary" onClick={() => setUploadOpen(false)}>Done</Button>}
      >
        <DocumentUploader caseId={caseData.id} onUploaded={handleUploaded} />
      </Modal>
      {actions.dialogs}
    </Panel>
  );
}
