import React, { useState, useEffect, useRef } from 'react';
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
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mainRef = useRef(null);

  // Scroll main view container to top on tab change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

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
      setIsSidebarOpen(false); // Close sidebar on nav
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
    setIsSidebarOpen(false);
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

  // Wrap tab change to also close sidebar on mobile
  const handleTabChangeResponsive = (tabId) => {
    handleTabChange(tabId);
    setIsSidebarOpen(false);
  };

  // If not logged in, render only the Login page
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen bg-white text-zinc-950 font-sans antialiased overflow-hidden relative">
      {/* Mobile drawer backdrop overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-zinc-950/40 z-45 lg:hidden transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Reusable Sidebar navigation component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChangeResponsive}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Reusable top navigation header component */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Workspace views router */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-white">
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
            <Conclaves searchQuery={searchQuery} setActiveTab={handleTabChange} />
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
          ) : null}
        </main>
      </div>
    </div>
  );
}
