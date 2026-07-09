import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Award,
  CalendarRange,
  BarChart3,
  Activity,
  Camera,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  Lock,
  Play,
  LogOut,
  X
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'members', label: 'Members', Icon: Users },
  { id: 'active-users', label: 'Active Users', Icon: Activity },
  { id: 'business-types', label: 'Business Types', Icon: Layers },
  { id: 'captains', label: 'Captains', Icon: Award },
  { id: 'conclaves', label: 'Conclaves', Icon: CalendarRange },
  { id: 'snapshot', label: 'Snapshot', Icon: Camera },
  { id: 'validation', label: 'Validation', Icon: ShieldCheck },
  { id: 'schedule-gen', label: 'Schedule Generation', Icon: TrendingUp },
  { id: 'schedule-review', label: 'Schedule Review', Icon: SlidersHorizontal },
  { id: 'lock-conclave', label: 'Lock Conclave', Icon: Lock },
  { id: 'round-runner', label: 'Round Runner', Icon: Play },
  { id: 'reports', label: 'Reports', Icon: BarChart3 },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] h-screen flex flex-col py-6 bg-zinc-50 border-r border-red-100 text-sidebar font-medium shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-[220px] ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>

      {/* Sticky Branding Header (Non-scrolling) */}
      <div className="px-4 mb-6 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/BNI-Guntur-Logo.webp"
            alt="BNI Logo"
            className="h-9.5 w-auto object-contain"
          />
          <div className="border-l border-red-100 pl-2.5 flex flex-col justify-center">
            <h1 className="text-[12px] font-black text-brand-red leading-none tracking-tight">1-1-CONCLAVE</h1>
            <p className="text-[8.5px] text-zinc-400 font-bold tracking-widest mt-1.5 uppercase">Enterprise Admin</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg hover:bg-zinc-200 text-zinc-550 hover:text-zinc-800 transition-smooth cursor-pointer"
        >
          <X className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-1.5 scrollbar-thin">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.Icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left rounded-lg transition-smooth group cursor-pointer ${isActive
                    ? 'bg-brand-red text-white font-semibold shadow-sm'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                  }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span className="text-sidebar uppercase tracking-wider text-[10.5px] truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sticky Sidebar Footer (Non-scrolling) - replaced with Logout button */}
      <div className="mt-auto px-2.5 pt-4 border-t border-zinc-200 shrink-0">
        <button
          onClick={() => onLogout && onLogout()}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg transition-smooth text-zinc-650 hover:bg-red-50 hover:text-brand-red group cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px] text-zinc-500 group-hover:text-brand-red shrink-0" />
          <div className="overflow-hidden">
            <p className="text-body-text truncate leading-tight font-extrabold text-zinc-900 group-hover:text-brand-red">Logout</p>
            <p className="text-caption text-zinc-400 truncate leading-tight mt-0.5 font-bold">Global Enterprise</p>
          </div>
        </button>
      </div>

    </aside>
  );
}
