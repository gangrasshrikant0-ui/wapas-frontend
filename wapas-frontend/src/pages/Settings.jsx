import { useState } from 'react';
import { CheckCircle2, Plug } from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import Panel from '../components/common/Panel.jsx';
import Button from '../components/common/Button.jsx';
import { API_BASE_URL, USE_MOCK, checkConnection } from '../services/api.js';
import { useCurrentUser } from '../hooks/useCurrentUser.js';

function Row({ label, children }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
      <dt className="text-[13px] text-zinc-500">{label}</dt>
      <dd className="text-sm text-zinc-900 sm:col-span-2">{children}</dd>
    </div>
  );
}

export default function Settings() {
  const user = useCurrentUser();
  const [state, setState] = useState({ status: 'idle' });

  const test = async () => {
    setState({ status: 'testing' });
    try {
      await checkConnection();
      setState({ status: 'ok' });
    } catch {
      setState({ status: 'error' });
    }
  };

  return (
    <>
      <PageHeader title="Settings" description="Account details and how this app connects to the WAPAS backend." />
      <div className="max-w-3xl space-y-6">
        <Panel title="Profile">
          <dl className="divide-y divide-zinc-200">
            <Row label="Name">{user.name}</Row>
            <Row label="Email">{user.email}</Row>
            <Row label="Role">{user.role}</Row>
          </dl>
        </Panel>

        <Panel title="Backend connection" description="Set in the .env file. Restart the dev server after changing it.">
          <dl className="divide-y divide-zinc-200">
            <Row label="Data source">{USE_MOCK ? 'Sample data (VITE_USE_MOCK_API=true)' : 'Live backend (VITE_USE_MOCK_API=false)'}</Row>
            <Row label="API base URL"><span className="break-all">{API_BASE_URL}</span></Row>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button icon={Plug} onClick={test} loading={state.status === 'testing'}>Test connection</Button>
            {state.status === 'ok' && (
              <p role="status" className="flex items-center gap-1.5 text-[13px] text-emerald-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {USE_MOCK ? 'Sample data is available.' : 'Backend reachable.'}
              </p>
            )}
            {state.status === 'error' && <p role="alert" className="text-[13px] text-red-600">We couldn't reach the backend. Check the base URL and that the server is running.</p>}
          </div>
        </Panel>
      </div>
    </>
  );
}
