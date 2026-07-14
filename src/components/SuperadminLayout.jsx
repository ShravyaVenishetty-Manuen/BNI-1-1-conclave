import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  CalendarRange, 
  LogOut, 
  X, 
  Menu, 
  Bell, 
  Search 
} from 'lucide-react';
import SuperadminDashboard from '../pages/superadmin/Dashboard';
import SuperadminAdmins from '../pages/superadmin/Admins';
import SuperadminConclaves from '../pages/superadmin/Conclaves';
import SuperadminMembers from '../pages/superadmin/Members';

export default function SuperadminLayout({
  activeTab,
  setActiveTab,
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen,
  searchQuery,
  setSearchQuery
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'admins', label: 'Admins & Regions', Icon: Award },
    { id: 'conclaves', label: 'Global Conclaves', Icon: CalendarRange },
    { id: 'members', label: 'Global Members', Icon: Users },
  ];

  return (
    <div className="flex h-screen w-screen bg-zinc-50 text-zinc-955 font-sans antialiased overflow-hidden relative">
      
      {/* Mobile drawer backdrop overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-zinc-955/40 z-45 lg:hidden transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Superadmin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] h-screen flex flex-col py-6 bg-zinc-50 border-r border-red-100 text-sidebar font-medium shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-[220px] ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        
        {/* Branding Header */}
        <div className="px-4 mb-6 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/BNI-Guntur-Logo.webp"
              alt="BNI Logo"
              className="h-9.5 w-auto object-contain"
            />
            <div className="border-l border-red-100 pl-2.5 flex flex-col justify-center">
              <h1 className="text-[12px] font-black text-brand-red leading-none tracking-tight">1-1-CONCLAVE</h1>
              <p className="text-[8.5px] text-zinc-400 font-bold tracking-widest mt-1.5 uppercase">Super Administrator</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-zinc-200 text-zinc-550"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-2 py-1.5 scrollbar-thin">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.Icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left rounded-lg transition-smooth group cursor-pointer ${isActive
                      ? 'bg-brand-red text-white font-semibold shadow-sm'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-955'
                    }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="text-sidebar uppercase tracking-wider text-[10.5px] truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="mt-auto px-2.5 pt-4 border-t border-zinc-200 shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg transition-smooth text-zinc-655 hover:bg-red-50 hover:text-brand-red group cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px] text-zinc-500 group-hover:text-brand-red shrink-0" />
            <div className="overflow-hidden">
              <p className="text-body-text truncate leading-tight font-extrabold text-zinc-900 group-hover:text-brand-red">Logout</p>
              <p className="text-caption text-zinc-450 truncate leading-tight mt-0.5 font-bold">Global Superadmin</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 overflow-hidden">
        
        {/* Superadmin Header */}
        <header className="h-14 border-b border-outline-variant bg-white flex items-center justify-between px-6 shrink-0 relative z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-550 mr-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative max-w-xs hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-450" />
              <input
                type="text"
                placeholder="Global search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-60 pl-9 pr-3 bg-zinc-50 border border-zinc-250 rounded-lg text-body-sm font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-brand-red focus:border-brand-red"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-1.5 rounded-full text-zinc-500 hover:text-brand-red hover:bg-zinc-50 transition-smooth">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-red rounded-full" />
            </button>
            
            <div className="h-8 w-px bg-zinc-200" />
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center font-black text-[11px] text-white select-none">
                SA
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[11.5px] font-black text-zinc-850 leading-tight">Superadmin</p>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">BNI Global</p>
              </div>
            </div>
          </div>
        </header>

        {/* View Router */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'dashboard' ? (
            <SuperadminDashboard setActiveTab={setActiveTab} />
          ) : activeTab === 'admins' ? (
            <SuperadminAdmins searchQuery={searchQuery} />
          ) : activeTab === 'conclaves' ? (
            <SuperadminConclaves searchQuery={searchQuery} />
          ) : activeTab === 'members' ? (
            <SuperadminMembers searchQuery={searchQuery} />
          ) : (
            <div className="p-8 text-center text-zinc-400">View not found</div>
          )}
        </main>
      </div>

    </div>
  );
}
