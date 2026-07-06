import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import BusinessTypes from './pages/BusinessTypes';
import Captains from './pages/Captains';
import ActiveUsers from './pages/ActiveUsers';
import Conclaves from './pages/Conclaves';

export default function App() {
  // Read active tab path directly from window URL pathname
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    return path || 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL updates when switching tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const targetPath = tabId === 'dashboard' ? '/' : `/${tabId}`;
    window.history.pushState({}, '', targetPath);
  };

  // Sync state if user clicks Back or Forward browser navigation buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      setActiveTab(path || 'dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-white text-zinc-950 font-sans antialiased overflow-hidden">
      {/* Reusable Sidebar navigation component */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Reusable top navigation header component */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Workspace views router */}
        <main className="flex-1 overflow-y-auto bg-white">
          {activeTab === 'dashboard' ? (
            <Dashboard />
          ) : activeTab === 'members' ? (
            <Members />
          ) : activeTab === 'active-users' ? (
            <ActiveUsers />
          ) : activeTab === 'business-types' ? (
            <BusinessTypes />
          ) : activeTab === 'captains' ? (
            <Captains />
          ) : activeTab === 'conclaves' ? (
            <Conclaves />
          ) : (
            <div className="p-6 max-w-[1600px] mx-auto w-full">
              {/* Placeholder views for other tabs */}
              <div className="h-96 flex items-center justify-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                <div className="text-center space-y-2">
                  <span className="material-symbols-outlined text-zinc-300 text-5xl">construction</span>
                  <h4 className="text-title-lg text-zinc-900 font-bold capitalize">{activeTab} tab is under construction</h4>
                  <p className="text-body-text text-zinc-500">Integrating controllers, models, and forms next.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
