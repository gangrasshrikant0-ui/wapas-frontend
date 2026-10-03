import { NavLink } from 'react-router-dom';
import { AudioLines, Briefcase, FileText, LayoutDashboard, Settings, X } from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser.js';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/cases', label: 'Cases', icon: Briefcase },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/transcription', label: 'Transcriptions', icon: AudioLines },
];

function SidebarLink({ item, collapsed }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors ${
          isActive ? 'bg-accent-50 text-accent-700' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
        } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
      <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const user = useCurrentUser();

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-zinc-900/40 lg:hidden" onClick={onCloseMobile} aria-hidden />}
      <aside
        aria-label="Primary"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-200 bg-white transition-all duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-16' : 'lg:w-60'}`}
      >
        <div className={`flex h-14 items-center justify-between border-b border-zinc-200 px-4 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-600">
              <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden>
                <path d="M7 9l3.6 14L16 13l5.4 10L25 9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className={`text-[15px] font-semibold tracking-tight text-zinc-900 ${collapsed ? 'lg:hidden' : ''}`}>WAPAS</span>
          </div>
          <button type="button" aria-label="Close menu" onClick={onCloseMobile} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 lg:hidden">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => (
            <SidebarLink key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>

        <div className="space-y-1 border-t border-zinc-200 p-3">
          <SidebarLink item={{ to: '/settings', label: 'Settings', icon: Settings }} collapsed={collapsed} />
          <div className={`flex items-center gap-3 rounded-md px-2.5 py-2 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`} title={collapsed ? user.name : undefined}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700">{user.initials}</span>
            <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-[13px] font-medium text-zinc-900">{user.name}</p>
              <p className="truncate text-xs text-zinc-500">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
