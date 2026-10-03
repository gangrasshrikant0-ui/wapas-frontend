import { useMemo, useState } from 'react';
import { Briefcase, Search } from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import Panel from '../components/common/Panel.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import Button from '../components/common/Button.jsx';
import { ListSkeleton } from '../components/common/LoadingState.jsx';
import CaseTable from '../components/cases/CaseTable.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { listCases } from '../services/caseService.js';
import { CASE_STATUS } from '../utils/constants.js';

export default function Cases() {
  const q = useAsync(listCases, []);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (q.data ?? []).filter(
      (c) =>
        (status === 'all' || c.status === status) &&
        (!term || c.title.toLowerCase().includes(term) || c.id.toLowerCase().includes(term) || c.type.toLowerCase().includes(term)),
    );
  }, [q.data, search, status]);

  const clearFilters = () => { setSearch(''); setStatus('all'); };

  return (
    <>
      <PageHeader title="Cases" description="Every refund, claim and reimbursement being tracked." />
      <Panel padded={false}>
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 sm:flex-row sm:items-center sm:px-5">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
            <input type="search" aria-label="Search cases" placeholder="Search by case, ID or type" value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" />
          </div>
          <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="input sm:w-52">
            <option value="all">All statuses</option>
            {Object.entries(CASE_STATUS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
          </select>
          {q.data && <p className="text-[13px] text-zinc-500 sm:ml-auto">{filtered.length} of {q.data.length} cases</p>}
        </div>

        {q.initialLoading ? (
          <ListSkeleton rows={6} />
        ) : q.failed ? (
          <ErrorState title="We couldn't load your cases" onRetry={q.reload} />
        ) : q.data.length === 0 ? (
          <EmptyState icon={Briefcase} title="No cases yet" description="Cases appear here once they are created." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Search} title="No matching cases" description="Try a different search or status." action={<Button onClick={clearFilters}>Clear filters</Button>} />
        ) : (
          <CaseTable cases={filtered} />
        )}
      </Panel>
    </>
  );
}
