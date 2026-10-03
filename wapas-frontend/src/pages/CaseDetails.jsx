import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import Modal from '../components/common/Modal.jsx';
import Button, { ButtonLink } from '../components/common/Button.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { Skeleton } from '../components/common/LoadingState.jsx';
import CaseOverview from '../components/cases/CaseOverview.jsx';
import CaseActionPanel from '../components/cases/CaseActionPanel.jsx';
import CaseDocuments from '../components/cases/CaseDocuments.jsx';
import CaseCommunication from '../components/cases/CaseCommunication.jsx';
import AgentActivity from '../components/cases/AgentActivity.jsx';
import DocumentUploader from '../components/documents/DocumentUploader.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useToast } from '../hooks/useToast.js';
import { getCase } from '../services/caseService.js';
import { getAgentStatus, sendToAgent } from '../services/agentService.js';
import { toUserMessage } from '../services/api.js';

function CaseSkeleton() {
  return (
    <div className="space-y-6" role="status">
      <span className="sr-only">Loading case</span>
      <Skeleton className="h-8 w-72" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-6 xl:grid-cols-5">
        <Skeleton className="h-72 xl:col-span-3" />
        <Skeleton className="h-72 xl:col-span-2" />
      </div>
    </div>
  );
}

function CaseWorkspace({ caseId }) {
  const toast = useToast();
  const [version, setVersion] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const caseQ = useAsync(() => getCase(caseId), [caseId, version]);
  const agentQ = useAsync(() => getAgentStatus(caseId), [caseId, version]);

  // While the agent is working, check back periodically.
  const agentStatus = agentQ.data?.status;
  useEffect(() => {
    if (agentStatus !== 'processing') return undefined;
    const timer = setInterval(bump, 10000);
    return () => clearInterval(timer);
  }, [agentStatus, bump]);

  /** Sends a user action to the agent. Resolves true on success so dialogs know whether to close. */
  const handleAgentAction = async (payload) => {
    try {
      await sendToAgent(caseId, payload);
      toast.push({ title: 'Sent to the agent', description: 'The case will update as work continues.', tone: 'success' });
      bump();
      return true;
    } catch (err) {
      toast.push({ title: "We couldn't send this update", description: toUserMessage(err, 'Please try again.'), tone: 'error' });
      return false;
    }
  };

  const handleRequestedUpload = async (docs) => {
    const ok = await handleAgentAction({ type: 'document_uploaded', documentIds: docs.map((d) => d.id) });
    if (ok) setUploadOpen(false);
  };

  if (caseQ.initialLoading) return <CaseSkeleton />;

  if (caseQ.failed) {
    return caseQ.error?.status === 404 ? (
      <EmptyState
        icon={Briefcase}
        title="Case not found"
        description="This case doesn't exist or you don't have access to it."
        action={<ButtonLink to="/cases">Back to cases</ButtonLink>}
      />
    ) : (
      <ErrorState title="We couldn't load this case" onRetry={caseQ.reload} />
    );
  }

  const c = caseQ.data;

  return (
    <>
      <PageHeader
        backTo="/cases"
        backLabel="Cases"
        title={c.title}
        meta={
          <>
            <span>{c.id}</span>
            <StatusBadge status={c.status} />
            <span>{c.counterparty}</span>
          </>
        }
      />

      <div className="space-y-6">
        <CaseActionPanel
          caseData={c}
          agent={agentQ.data}
          loading={agentQ.loading}
          onAction={handleAgentAction}
          onRequestUpload={() => setUploadOpen(true)}
        />
        <CaseOverview caseData={c} />

        <div className="grid items-start gap-6 xl:grid-cols-5">
          <div className="space-y-6 xl:col-span-3">
            <CaseDocuments caseData={c} version={version} onChanged={bump} />
            <CaseCommunication caseData={c} version={version} onChanged={bump} />
          </div>
          <div className="xl:col-span-2">
            <AgentActivity caseId={c.id} version={version} />
          </div>
        </div>
      </div>

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload the requested document"
        description="The agent will be notified once the upload finishes."
        footer={<Button onClick={() => setUploadOpen(false)}>Cancel</Button>}
      >
        <DocumentUploader caseId={c.id} onUploaded={handleRequestedUpload} />
      </Modal>
    </>
  );
}

export default function CaseDetails() {
  const { id } = useParams();
  return <CaseWorkspace key={id} caseId={id} />;
}
