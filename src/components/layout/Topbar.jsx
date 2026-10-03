import { Database, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { IconButton } from '../common/Button.jsx';
import { USE_MOCK } from '../../services/api.js';

export default function Topbar({ collapsed, onToggleCollapsed, onOpenMobile }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-1">
        <IconButton label="Open menu" icon={Menu} onClick={onOpenMobile} className="lg:hidden" />
        <IconButton
          label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          icon={collapsed ? PanelLeftOpen : PanelLeftClose}
          onClick={onToggleCollapsed}
          className="hidden lg:inline-flex"
        />
      </div>
      {USE_MOCK && (
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
          title="The backend is not connected. Data shown is sample data."
        >
          <Database className="h-3.5 w-3.5" aria-hidden />
          Sample data
        </span>
      )}
    </header>
  );
}
