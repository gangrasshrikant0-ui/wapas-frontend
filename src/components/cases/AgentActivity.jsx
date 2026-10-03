import { History, RefreshCw } from 'lucide-react';
import Panel from '../common/Panel.jsx';
import EmptyState from '../common/EmptyState.jsx';
import ErrorState from '../common/ErrorState.jsx';
import { IconButton } from '../common/Button.jsx';
import { Skeleton } from '../common/LoadingState.jsx';
import CaseTimeline from './CaseTimeline.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getCaseUpdates } from '../../services/agentService.js';

export default function AgentActivity({ caseId, version }) {
  const q = useAsync(() => getCaseUpdates(caseId), [caseId, version]);

  return (
    <Panel
      title="Agent activity"
      description="Steps taken by the system and by you, oldest first."
      actions={<IconButton label="Refresh activity" icon={RefreshCw} onClick={q.reload} disabled={q.loading} />}
    >
      {q.initialLoading ? (
        <div className="space-y-5" role="status">
          <span className="sr-only">Loading activity</span>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : q.failed ? (
        <ErrorState title="We couldn't load activity" onRetry={q.reload} />
      ) : q.data.length === 0 ? (
        <EmptyState icon={History} title="No activity yet" description="Steps will appear here as the case progresses." />
      ) : (
        <CaseTimeline items={q.data} />
      )}
    </Panel>
  );
}
