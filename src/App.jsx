import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import BusinessTypes from './pages/BusinessTypes';
import Captains from './pages/Captains';
import ActiveUsers from './pages/ActiveUsers';
import Conclaves from './pages/Conclaves';
import Snapshot from './pages/Snapshot';
import Validation from './pages/Validation';
import ScheduleGen from './pages/ScheduleGen';
import ScheduleReview from './pages/ScheduleReview';
import LockConclave from './pages/LockConclave';
import RoundRunner from './pages/RoundRunner';
import Reports from './pages/Reports';
import Login from './pages/Login';

export default function App() {
  // Read logged in status from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bni_logged_in') === 'true';
  });

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

  const handleLogin = () => {
    localStorage.setItem('bni_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.setItem('bni_logged_in', 'false');
    setIsLoggedIn(false);
  };

  // Sync browser URL to /login when logged out, and back to the active tab when logged in
  useEffect(() => {
    if (!isLoggedIn) {
      window.history.pushState({}, '', '/login');
    } else {
      const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');
      const tabToRestore = currentPath === 'login' ? 'dashboard' : (currentPath || 'dashboard');
      setActiveTab(tabToRestore);
      const targetPath = tabToRestore === 'dashboard' ? '/' : `/${tabToRestore}`;
      window.history.pushState({}, '', targetPath);
    }
  }, [isLoggedIn]);

  // If not logged in, render only the Login page
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen bg-white text-zinc-950 font-sans antialiased overflow-hidden">
      {/* Reusable Sidebar navigation component */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} onLogout={handleLogout} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Reusable top navigation header component */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Workspace views router */}
        <main className="flex-1 overflow-y-auto bg-white">
          {activeTab === 'dashboard' ? (
            <Dashboard setActiveTab={handleTabChange} />
          ) : activeTab === 'members' ? (
            <Members searchQuery={searchQuery} />
          ) : activeTab === 'active-users' ? (
            <ActiveUsers searchQuery={searchQuery} />
          ) : activeTab === 'business-types' ? (
            <BusinessTypes searchQuery={searchQuery} />
          ) : activeTab === 'captains' ? (
            <Captains searchQuery={searchQuery} />
          ) : activeTab === 'conclaves' ? (
            <Conclaves searchQuery={searchQuery} />
          ) : activeTab === 'snapshot' ? (
            <Snapshot searchQuery={searchQuery} />
          ) : activeTab === 'validation' ? (
            <Validation />
          ) : activeTab === 'schedule-gen' ? (
            <ScheduleGen />
          ) : activeTab === 'schedule-review' ? (
            <ScheduleReview setActiveTab={setActiveTab} searchQuery={searchQuery} />
          ) : activeTab === 'lock-conclave' ? (
            <LockConclave />
          ) : activeTab === 'round-runner' ? (
            <RoundRunner />
          ) : activeTab === 'reports' ? (
            <Reports searchQuery={searchQuery} />
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
