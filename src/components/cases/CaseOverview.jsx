import Panel from '../common/Panel.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-zinc-900">{children}</dd>
    </div>
  );
}

export default function CaseOverview({ caseData: c }) {
  return (
    <Panel title="Case overview">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3 xl:grid-cols-6">
        <Field label="Case ID">{c.id}</Field>
        <Field label="Category">{c.type}</Field>
        <Field label="Amount"><span className="tabular-nums">{formatCurrency(c.amount)}</span></Field>
        <Field label="Created">{formatDate(c.createdAt)}</Field>
        <Field label="Current status"><StatusBadge status={c.status} /></Field>
        <Field label="Reference">{c.reference ?? '—'}</Field>
      </dl>
    </Panel>
  );
}
