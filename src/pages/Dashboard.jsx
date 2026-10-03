import { Link } from 'react-router-dom';
import { AudioLines, Briefcase, Clock, FileCheck2, Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import StatCard from '../components/common/StatCard.jsx';
import Panel from '../components/common/Panel.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { ButtonLink } from '../components/common/Button.jsx';
import { ListSkeleton, Skeleton } from '../components/common/LoadingState.jsx';
import CaseTable from '../components/cases/CaseTable.jsx';
import ActivityFeed from '../components/cases/ActivityFeed.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getDashboardSummary } from '../services/caseService.js';

const ATTENTION_CTA = { awaiting_verification: 'Review details', action_required: 'Take action' };

function DashboardSkeleton() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[104px]" />)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel padded={false}><ListSkeleton rows={2} /></Panel>
          <Panel padded={false}><ListSkeleton rows={5} /></Panel>
        </div>
        <Panel padded={false}><ListSkeleton rows={6} /></Panel>
      </div>
    </>
  );
}

export default function Dashboard() {
  const q = useAsync(getDashboardSummary, []);

  if (q.initialLoading) return <DashboardSkeleton />;
  if (q.failed) return (<><PageHeader title="Dashboard" /><ErrorState onRetry={q.reload} /></>);

  const { stats, attention, recent, activity } = q.data;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Where your refund, claim and reimbursement cases stand today."
        actions={<ButtonLink to="/cases" variant="primary" icon={Briefcase}>View all cases</ButtonLink>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Briefcase} label="Active cases" value={stats.activeCases} hint={`${stats.totalCases} cases in total`} />
        <StatCard icon={FileCheck2} label="Documents processed" value={stats.documentsProcessed} hint={`${stats.documentsTotal} documents uploaded`} />
        <StatCard icon={AudioLines} label="Audio transcripts" value={stats.transcripts} hint={`Across ${stats.transcriptCases} ${stats.transcriptCases === 1 ? 'case' : 'cases'}`} />
        <StatCard icon={Clock} label="Pending actions" value={stats.pendingActions} hint="Waiting on you" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {attention.length > 0 && (
            <Panel title="Needs your attention" description="These cases cannot move forward until you act." padded={false}>
              <ul className="divide-y divide-zinc-200">
                {attention.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
                    <div className="min-w-0">
                      <Link to={`/cases/${c.id}`} className="font-medium text-zinc-900 hover:text-accent-700 hover:underline">{c.title}</Link>
                      <p className="mt-0.5 text-[13px] text-zinc-500">{c.nextAction}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={c.status} />
                      <ButtonLink to={`/cases/${c.id}`} size="sm">{ATTENTION_CTA[c.status] ?? 'Open case'}</ButtonLink>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel
            title="Recently processed cases"
            padded={false}
            actions={<Link to="/cases" className="text-[13px] font-medium text-accent-700 hover:underline">See all</Link>}
          >
            <CaseTable cases={recent} compact />
          </Panel>
        </div>

        <Panel title="Recent activity" description="Across all cases" padded={false}>
          <ActivityFeed items={activity} />
        </Panel>
      </div>
    </>
  );
}
