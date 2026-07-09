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
import CaptainDashboard from './pages/captain/Dashboard';

export default function App() {
  // Read logged in status from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bni_logged_in') === 'true';
  });

  // Read logged in user's role from localStorage
  const [userRole, setUserRole] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path.startsWith('captain')) return 'captain';
    if (path.startsWith('admin')) return 'admin';
    return localStorage.getItem('bni_user_role') || 'admin';
  });

  // Read logged in captain info from localStorage
  const [loggedInCaptain, setLoggedInCaptain] = useState(() => {
    const data = localStorage.getItem('bni_logged_captain');
    return data ? JSON.parse(data) : null;
  });

  // Read active tab path directly from window URL pathname
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path.startsWith('admin/')) return path.replace('admin/', '');
    if (path.startsWith('captain/')) return path.replace('captain/', '');
    return 'dashboard';
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
    if (userRole === 'admin') {
      window.history.pushState({}, '', `/admin/${tabId}`);
    } else if (userRole === 'captain') {
      window.history.pushState({}, '', `/captain/${tabId}`);
    }
  };

  // Sync state if user clicks Back or Forward browser navigation buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      if (path.startsWith('admin/')) {
        setUserRole('admin');
        setActiveTab(path.replace('admin/', ''));
      } else if (path.startsWith('captain/')) {
        setUserRole('captain');
        setActiveTab(path.replace('captain/', ''));
      } else if (path === 'captain') {
        setUserRole('captain');
        setActiveTab('dashboard');
      } else if (path === 'admin') {
        setUserRole('admin');
        setActiveTab('dashboard');
      } else {
        const storedRole = localStorage.getItem('bni_user_role') || 'admin';
        setUserRole(storedRole);
        setActiveTab('dashboard');
      }
      setIsSidebarOpen(false); // Close sidebar on nav
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [userRole]);

  const handleLogin = (role, captainPayload) => {
    localStorage.setItem('bni_logged_in', 'true');
    localStorage.setItem('bni_user_role', role);
    setUserRole(role);
    
    if (captainPayload) {
      localStorage.setItem('bni_logged_captain', JSON.stringify(captainPayload));
      setLoggedInCaptain(captainPayload);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      window.history.pushState({}, '', `/captain/dashboard`);
    } else {
      localStorage.removeItem('bni_logged_captain');
      setLoggedInCaptain(null);
      setIsLoggedIn(true);
      const defaultTab = 'dashboard';
      setActiveTab(defaultTab);
      window.history.pushState({}, '', `/admin/${defaultTab}`);
    }
  };

  const handleLogout = () => {
    localStorage.setItem('bni_logged_in', 'false');
    localStorage.removeItem('bni_user_role');
    localStorage.removeItem('bni_logged_captain');
    setLoggedInCaptain(null);
    setIsLoggedIn(false);
    setIsSidebarOpen(false);
  };

  // Sync browser URL to /login when logged out, and back to the active tab when logged in
  useEffect(() => {
    if (!isLoggedIn) {
      window.history.pushState({}, '', '/login');
    } else {
      const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');
      if (userRole === 'captain') {
        const targetTab = activeTab || 'dashboard';
        const expectedPath = `captain/${targetTab}`;
        if (currentPath !== expectedPath) {
          window.history.pushState({}, '', `/${expectedPath}`);
        }
      } else {
        // Admin URL check
        if (currentPath.startsWith('admin/')) {
          const tab = currentPath.replace('admin/', '');
          if (tab !== activeTab) {
            window.history.pushState({}, '', `/admin/${activeTab}`);
          }
        } else {
          // If the URL is old/unprefixed (e.g. "dashboard", "members", "schedule-review")
          const cleanPath = currentPath === 'login' ? '' : currentPath;
          const targetTab = cleanPath || activeTab || 'dashboard';
          const safeTab = targetTab.replace(/^(admin|captain)\//, '') || 'dashboard';
          window.history.pushState({}, '', `/admin/${safeTab}`);
          setActiveTab(safeTab);
        }
      }
    }
  }, [isLoggedIn, userRole, activeTab]);

  // Wrap tab change to also close sidebar on mobile
  const handleTabChangeResponsive = (tabId) => {
    handleTabChange(tabId);
    setIsSidebarOpen(false);
  };

  // If not logged in, render only the Login page
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // If logged in as a Captain, render the Captain Dashboard directly
  if (userRole === 'captain') {
    return (
      <CaptainDashboard
        loggedInCaptain={loggedInCaptain}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen bg-zinc-50 text-zinc-955 font-sans antialiased overflow-hidden relative">
      {/* Mobile drawer backdrop overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-zinc-955/40 z-45 lg:hidden transition-opacity duration-300 animate-fade-in"
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
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 overflow-hidden">
        {/* Reusable top navigation header component */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Workspace views router */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-zinc-50">
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
