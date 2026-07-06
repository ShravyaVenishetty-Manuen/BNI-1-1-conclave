import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Award, 
  CalendarRange, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'members', label: 'Members', Icon: Users },
  { id: 'business-types', label: 'Business Types', Icon: Layers },
  { id: 'captains', label: 'Captains', Icon: Award },
  { id: 'conclaves', label: 'Conclaves', Icon: CalendarRange },
  { id: 'reports', label: 'Reports', Icon: BarChart3 },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-[240px] h-screen sticky left-0 top-0 overflow-y-auto flex flex-col py-6 bg-zinc-50 border-r border-zinc-200 text-sidebar font-medium shrink-0 select-none">
      {/* Branding Header */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center shadow-md">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-section-heading font-bold text-brand-red leading-none">BNI</h1>
            <p className="text-caption text-zinc-500 font-semibold tracking-wider mt-0.5 uppercase">Enterprise Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.Icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-left rounded-lg transition-smooth group cursor-pointer ${
                isActive
                  ? 'bg-brand-red text-white font-semibold shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="text-sidebar">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Profile */}
      <div className="mt-auto px-3 pt-4 border-t border-zinc-200">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-left rounded-lg transition-smooth group cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-brand-red text-white font-semibold shadow-sm'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
          }`}
        >
          <Settings className="w-[18px] h-[18px]" />
          <span className="text-sidebar">Settings</span>
        </button>

        <div className="mt-4 px-4 flex items-center gap-3 pb-2">
          <img
            className="w-8 h-8 rounded-full border border-zinc-200 object-cover shadow-sm"
            alt="Admin Avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSZUpWnxByJKYv0LosWSAv1nBsqGFsWiDVlxicWYrFp1w33SqIIThrI1zGVWQZT9Ld6iJ_JiZD2p_U8pj_aaUW-d7UnBCX03lPVPDjrCACFzFWbjSk79V-KwOe8LaKc0p3PLdSRGPLMntzyue311XhV88K-3JSTP79KK86t7PFVcRICmnd1RdYNzksTUPix6tDKPFBy-p1vtagzk4boa7OohxvrD0l6IEOJyu8FD8vxQ6BIIDgjc4z9S6brvpfcGvjDRAgoBqCye4"
          />
          <div className="overflow-hidden">
            <p className="text-body-text font-semibold text-zinc-900 truncate leading-tight">Admin User</p>
            <p className="text-caption text-zinc-500 truncate leading-tight mt-0.5">Global Enterprise</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
