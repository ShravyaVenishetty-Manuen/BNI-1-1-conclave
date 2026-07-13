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
import MemberHeader from './components/MemberHeader';
import MemberDashboard from './pages/member/Dashboard';
import MemberSchedule from './pages/member/MySchedule';
import MemberCurrentRound from './pages/member/CurrentRound';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Read logged in status from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bni_logged_in') === 'true';
  });

  // Read logged in user's role from localStorage
  const [userRole, setUserRole] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path.startsWith('captain')) return 'captain';
    if (path.startsWith('member')) return 'member';
    if (path.startsWith('admin')) return 'admin';
    return localStorage.getItem('bni_user_role') || 'admin';
  });

  // Read logged in captain info from localStorage
  const [loggedInCaptain, setLoggedInCaptain] = useState(() => {
    const data = localStorage.getItem('bni_logged_captain');
    return data ? JSON.parse(data) : null;
  });

  // Read logged in member info from localStorage
  const [loggedInMember, setLoggedInMember] = useState(() => {
    const data = localStorage.getItem('bni_logged_member');
    return data ? JSON.parse(data) : null;
  });

  // Read active tab path directly from window URL pathname
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path.startsWith('admin/')) return path.replace('admin/', '');
    if (path.startsWith('captain/')) return path.replace('captain/', '');
    if (path.startsWith('member/')) return path.replace('member/', '');
    return 'dashboard';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const mainRef = useRef(null);

  // Handle URL updates when switching tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (userRole === 'admin') {
      window.history.pushState({}, '', `/admin/${tabId}`);
    } else if (userRole === 'captain') {
      window.history.pushState({}, '', `/captain/${tabId}`);
    } else if (userRole === 'member') {
      window.history.pushState({}, '', `/member/${tabId}`);
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
      } else if (path.startsWith('member/')) {
        setUserRole('member');
        setActiveTab(path.replace('member/', ''));
      } else if (path === 'captain') {
        setUserRole('captain');
        setActiveTab('dashboard');
      } else if (path === 'member') {
        setUserRole('member');
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

  const handleLogin = (role, payload) => {
    localStorage.setItem('bni_logged_in', 'true');
    localStorage.setItem('bni_user_role', role);
    setUserRole(role);
    
    if (role === 'captain') {
      localStorage.setItem('bni_logged_captain', JSON.stringify(payload));
      setLoggedInCaptain(payload);
      localStorage.removeItem('bni_logged_member');
      setLoggedInMember(null);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      window.history.pushState({}, '', `/captain/dashboard`);
    } else if (role === 'member') {
      localStorage.setItem('bni_logged_member', JSON.stringify(payload));
      setLoggedInMember(payload);
      localStorage.removeItem('bni_logged_captain');
      setLoggedInCaptain(null);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      window.history.pushState({}, '', `/member/dashboard`);
    } else {
      localStorage.removeItem('bni_logged_captain');
      localStorage.removeItem('bni_logged_member');
      setLoggedInCaptain(null);
      setLoggedInMember(null);
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
    localStorage.removeItem('bni_logged_member');
    setLoggedInCaptain(null);
    setLoggedInMember(null);
    setIsLoggedIn(false);
    setIsSidebarOpen(false);
  };

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
      } else if (userRole === 'member') {
        const targetTab = activeTab || 'dashboard';
        const expectedPath = `member/${targetTab}`;
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
          const safeTab = targetTab.replace(/^(admin|captain|member)\//, '') || 'dashboard';
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

  // If logged in as a Member, render the Member portal layout with MemberHeader
  if (userRole === 'member') {
    return (
      <div className="flex flex-col h-screen w-screen bg-zinc-50 overflow-hidden font-sans">
        <MemberHeader
          loggedInMember={loggedInMember}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' ? (
            <MemberDashboard
              loggedInMember={loggedInMember}
              onTabChange={handleTabChange}
            />
          ) : activeTab === 'my-schedule' ? (
            <MemberSchedule
              loggedInMember={loggedInMember}
              onTabChange={handleTabChange}
            />
          ) : activeTab === 'current-round' ? (
            <MemberCurrentRound
              loggedInMember={loggedInMember}
              onTabChange={handleTabChange}
            />
          ) : (
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-2xs text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-xl font-black text-zinc-955">{activeTab.toUpperCase()} - Under Construction</h2>
              <p className="text-xs text-zinc-500 font-semibold max-w-md mx-auto">
                Hello {loggedInMember?.name}! This member page view is currently under construction.
              </p>
              <div className="pt-4 max-w-xs mx-auto">
                <button 
                  onClick={handleLogout}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
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
            <Conclaves />
          ) : activeTab === 'snapshot' ? (
            <Snapshot />
          ) : activeTab === 'validation' ? (
            <Validation />
          ) : activeTab === 'schedule-gen' ? (
            <ScheduleGen />
          ) : activeTab === 'schedule-review' ? (
            <ScheduleReview />
          ) : activeTab === 'lock-conclave' ? (
            <LockConclave />
          ) : activeTab === 'round-runner' ? (
            <RoundRunner />
          ) : activeTab === 'reports' ? (
            <Reports />
          ) : (
            <div className="p-8 text-center text-zinc-400">View not found</div>
          )}
        </main>
      </div>
    </div>
  );
}
