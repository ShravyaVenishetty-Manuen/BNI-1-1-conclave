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
import ScheduleGen from './pages/ScheduleGen';
import ScheduleReview from './pages/ScheduleReview';
import RoundRunner from './pages/RoundRunner';
import Reports from './pages/Reports';
import Login from './pages/Login';
import CaptainDashboard from './pages/captain/Dashboard';
import MemberHeader from './components/MemberHeader';
import MemberDashboard from './pages/member/Dashboard';
import MemberSchedule from './pages/member/MySchedule';
import MemberCurrentRound from './pages/member/CurrentRound';
import MemberConclaveHistory from './pages/member/ConclaveHistory';
import MemberProfile from './pages/member/Profile';
import MemberRegistrations from './pages/member/Registrations';
import AdminProfile from './pages/admin/Profile';
import Referrals from './pages/Referrals';
import referralsData from './data/referrals.json';
import conclavesData from './data/conclaves.json';
import { Sparkles } from 'lucide-react';
import SuperadminLayout from './components/SuperadminLayout';
import { api } from './services/api';

export default function App() {
  // Read logged in status from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bni_logged_in') === 'true';
  });

  // Read logged in user's role from localStorage
  const [userRole, setUserRole] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path.startsWith('superadmin')) return 'superadmin';
    if (path.startsWith('captain')) return 'captain';
    if (path.startsWith('member')) return 'member';
    if (path.startsWith('admin')) return 'admin';
    return localStorage.getItem('bni_user_role') || 'admin';
  });

  // Read logged in admin info from localStorage
  const [loggedInAdmin, setLoggedInAdmin] = useState(() => {
    const data = localStorage.getItem('bni_logged_admin');
    return data ? JSON.parse(data) : { name: "Sanjay Wagle", email: "admin@bni.com", region: "Guntur Central" };
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
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    const validTabs = [
      'dashboard', 'members', 'active-users', 'business-types', 'captains',
      'conclaves', 'snapshot', 'schedule-gen', 'schedule-review',
      'round-runner', 'reports', 'admins', 'referrals', 'profile', 'registrations',
      'my-schedule', 'current-round', 'history', 'my-table', 'schedule'
    ];
    return validTabs.includes(lastPart) ? lastPart : 'dashboard';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Global conclave selector for admin panel - default to current admin's active conclave
  const [selectedConclaveId, setSelectedConclaveId] = useState('');

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') return;
    async function initActiveConclave() {
      try {
        const list = await api.get('/admin/conclaves');
        if (list && list.length > 0) {
          const exists = list.some(c => c.id === selectedConclaveId);
          if (!exists) {
            // Prefer the active/running conclave — same one members see
            const active = list.find(c => c.status === 'active' || c.status === 'running') || list[0];
            setSelectedConclaveId(active.id);
          }
        }
      } catch (err) {
        console.warn("Could not sync active conclave ID with backend:", err.message);
      }
    }
    initActiveConclave();
  }, [isLoggedIn, userRole]);

  const mainRef = useRef(null);

  // Handle URL updates when switching tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (userRole === 'superadmin') {
      window.history.pushState({}, '', `/superadmin/${tabId}`);
    } else if (userRole === 'admin') {
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
      const parts = path.split('/');
      const lastPart = parts[parts.length - 1];
      const validTabs = [
        'dashboard', 'members', 'active-users', 'business-types', 'captains',
        'conclaves', 'snapshot', 'schedule-gen', 'schedule-review',
        'round-runner', 'reports', 'admins', 'referrals', 'profile', 'registrations',
        'my-schedule', 'current-round', 'history'
      ];
      const cleanTab = validTabs.includes(lastPart) ? lastPart : 'dashboard';

      if (path.startsWith('superadmin/') || path.includes('/superadmin/')) {
        setUserRole('superadmin');
        setActiveTab(cleanTab);
      } else if (path.startsWith('admin/') || path.includes('/admin/')) {
        setUserRole('admin');
        setActiveTab(cleanTab);
      } else if (path.startsWith('captain/') || path.includes('/captain/')) {
        setUserRole('captain');
        setActiveTab(cleanTab);
      } else if (path.startsWith('member/') || path.includes('/member/')) {
        setUserRole('member');
        setActiveTab(cleanTab);
      } else {
        const storedRole = localStorage.getItem('bni_user_role') || 'admin';
        setUserRole(storedRole);
        setActiveTab(cleanTab);
      }
      setIsSidebarOpen(false); // Close sidebar on nav
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [userRole]);

  // Initialize local storage referrals & conclaves lists
  useEffect(() => {
    if (!localStorage.getItem('bni_referrals')) {
      localStorage.setItem('bni_referrals', JSON.stringify(referralsData));
    }
    if (!localStorage.getItem('bni_conclaves')) {
      localStorage.setItem('bni_conclaves', JSON.stringify(conclavesData));
    }
  }, []);

  // Sync loggedInMember on storage updates
  useEffect(() => {
    const handleStorageSync = () => {
      const storedMember = localStorage.getItem('bni_logged_member');
      if (storedMember) {
        setLoggedInMember(JSON.parse(storedMember));
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const handleLogin = (role, payload) => {
    localStorage.setItem('bni_logged_in', 'true');
    localStorage.setItem('bni_user_role', role);
    setUserRole(role);

    if (role === 'captain') {
      localStorage.setItem('bni_logged_captain', JSON.stringify(payload));
      setLoggedInCaptain(payload);
      localStorage.removeItem('bni_logged_member');
      setLoggedInMember(null);
      localStorage.removeItem('bni_logged_admin');
      setLoggedInAdmin(null);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      window.history.pushState({}, '', `/captain/dashboard`);
    } else if (role === 'member') {
      localStorage.setItem('bni_logged_member', JSON.stringify(payload));
      setLoggedInMember(payload);
      localStorage.removeItem('bni_logged_captain');
      setLoggedInCaptain(null);
      localStorage.removeItem('bni_logged_admin');
      setLoggedInAdmin(null);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      window.history.pushState({}, '', `/member/dashboard`);
    } else if (role === 'superadmin') {
      localStorage.removeItem('bni_logged_captain');
      localStorage.removeItem('bni_logged_member');
      localStorage.removeItem('bni_logged_admin');
      setLoggedInCaptain(null);
      setLoggedInMember(null);
      setLoggedInAdmin(null);
      setIsLoggedIn(true);
      const defaultTab = 'dashboard';
      setActiveTab(defaultTab);
      window.history.pushState({}, '', `/superadmin/${defaultTab}`);
    } else {
      localStorage.removeItem('bni_logged_captain');
      localStorage.removeItem('bni_logged_member');
      if (payload) {
        localStorage.setItem('bni_logged_admin', JSON.stringify(payload));
        setLoggedInAdmin(payload);
      } else {
        localStorage.removeItem('bni_logged_admin');
        setLoggedInAdmin({ name: "Sanjay Wagle", email: "admin@bni.com", region: "Guntur Central" });
      }

      // Fetch live conclaves to set active ID
      api.get('/admin/conclaves').then(list => {
        if (list && list.length > 0) {
          const adminName = payload?.name || "Sanjay Wagle";
          // Prefer active/running conclave (same as member portal), then admin's own, then first
          const active = list.find(c => c.status === 'active' || c.status === 'running');
          const myConclave = active || list.find(c => c.coordinator === adminName) || list[0];
          setSelectedConclaveId(myConclave.id);
        } else {
          setSelectedConclaveId('');
        }
      }).catch(err => {
        console.warn("Failed to fetch live conclaves during login:", err.message);
        setSelectedConclaveId('');
      });
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
    localStorage.removeItem('bni_logged_admin');
    setLoggedInCaptain(null);
    setLoggedInMember(null);
    setLoggedInAdmin(null);
    setIsLoggedIn(false);
    setIsSidebarOpen(false);
  };

  const [conclaveSyncData, setConclaveSyncData] = useState(null);
  const [memberConclaves, setMemberConclaves] = useState([]);
  const [memberProfile, setMemberProfile] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || (userRole !== 'member' && userRole !== 'captain')) return;

    async function loadMemberData() {
      try {
        const [list, profile] = await Promise.all([
          api.get('/conclaves').catch(() => []),
          api.get('/me').catch(() => null),
        ]);

        setMemberConclaves(Array.isArray(list) ? list : []);

        if (profile) {
          const mergedProfile = {
            ...(loggedInMember || {}),
            ...profile,
            uid: profile.uid || profile.id || loggedInMember?.uid || loggedInMember?.id,
            id: profile.id || profile.uid || loggedInMember?.id || loggedInMember?.uid,
          };
          setMemberProfile(mergedProfile);
          localStorage.setItem('bni_logged_member', JSON.stringify(mergedProfile));
          setLoggedInMember(mergedProfile);
        }

        const active = Array.isArray(list) ? (list.find(c => c.status === 'running' || c.status === 'active') || list[0]) : null;
        if (active) {
          const syncResult = await api.post(`/conclaves/${active.id}/sync`, {});
          setConclaveSyncData(syncResult);
        }
      } catch (err) {
        console.warn("Failed to sync member conclave data:", err.message);
      }
    }

    loadMemberData();
    const interval = setInterval(loadMemberData, 10000);
    return () => clearInterval(interval);
  }, [isLoggedIn, userRole]);

  // Fetch real admin profile from backend /api/me
  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') return;
    async function loadAdminProfile() {
      try {
        const profile = await api.get('/me');
        if (profile && profile.uid) {
          setLoggedInAdmin(prev => {
            const updated = {
              ...(prev || {}),
              ...profile,
              name: profile.name || prev?.name || 'Admin',
              email: profile.email || prev?.email || '',
              region: profile.chapter || profile.region || 'Guntur Central'
            };
            localStorage.setItem('bni_logged_admin', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.warn("Could not fetch admin profile from backend:", err.message);
      }
    }
    loadAdminProfile();
  }, [isLoggedIn, userRole]);

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
      } else if (userRole === 'superadmin') {
        const targetTab = activeTab || 'dashboard';
        const expectedPath = `superadmin/${targetTab}`;
        if (currentPath !== expectedPath) {
          window.history.pushState({}, '', `/${expectedPath}`);
        }
      } else if (userRole === 'admin') {
        const targetTab = activeTab || 'dashboard';
        const expectedPath = `admin/${targetTab}`;
        if (currentPath !== expectedPath) {
          window.history.pushState({}, '', `/${expectedPath}`);
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

  // If logged in as a Superadmin, render the Superadmin portal layout directly
  if (userRole === 'superadmin') {
    return (
      <SuperadminLayout
        activeTab={activeTab}
        setActiveTab={handleTabChangeResponsive}
        onLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    );
  }

  // If logged in as a Captain, render the Captain Dashboard directly
  if (userRole === 'captain') {
    return (
      <CaptainDashboard
        loggedInCaptain={loggedInCaptain}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        conclaveSyncData={conclaveSyncData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
              loggedInMember={memberProfile || loggedInMember}
              onTabChange={handleTabChange}
              conclaveSyncData={conclaveSyncData}
              searchQuery={searchQuery}
            />
          ) : activeTab === 'registrations' ? (
            <MemberRegistrations
              loggedInMember={memberProfile || loggedInMember}
              memberConclaves={memberConclaves}
              searchQuery={searchQuery}
            />
          ) : activeTab === 'my-schedule' ? (
            <MemberSchedule
              loggedInMember={memberProfile || loggedInMember}
              onTabChange={handleTabChange}
              conclaveSyncData={conclaveSyncData}
              searchQuery={searchQuery}
            />
          ) : activeTab === 'current-round' ? (
            <MemberCurrentRound
              loggedInMember={memberProfile || loggedInMember}
              onTabChange={handleTabChange}
              conclaveSyncData={conclaveSyncData}
              searchQuery={searchQuery}
            />
          ) : activeTab === 'history' ? (
            <MemberConclaveHistory
              loggedInMember={memberProfile || loggedInMember}
              memberConclaves={memberConclaves}
              searchQuery={searchQuery}
            />
          ) : activeTab === 'referrals' ? (
            <Referrals
              loggedInUser={memberProfile || loggedInMember}
              userType="member"
              conclaveSyncData={conclaveSyncData}
              searchQuery={searchQuery}
            />
          ) : activeTab === 'profile' ? (
            <MemberProfile
              loggedInMember={memberProfile || loggedInMember}
              onTabChange={handleTabChange}
              onLogout={handleLogout}
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
          className="fixed inset-0 bg-black/50 z-45 lg:hidden transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Reusable Sidebar navigation component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChangeResponsive}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedConclaveId={selectedConclaveId}
        setSelectedConclaveId={setSelectedConclaveId}
        loggedInAdmin={loggedInAdmin}
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 overflow-hidden">
        {/* Reusable top navigation header component */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onMenuClick={() => setIsSidebarOpen(true)}
          loggedInAdmin={loggedInAdmin}
          onLogout={handleLogout}
        />

        {/* Workspace views router */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-zinc-50">
          {activeTab === 'dashboard' ? (
            <Dashboard setActiveTab={handleTabChange} selectedConclaveId={selectedConclaveId} setSelectedConclaveId={setSelectedConclaveId} loggedInAdmin={loggedInAdmin} />
          ) : activeTab === 'members' ? (
            <Members searchQuery={searchQuery} selectedConclaveId={selectedConclaveId} />
          ) : activeTab === 'active-users' ? (
            <ActiveUsers searchQuery={searchQuery} selectedConclaveId={selectedConclaveId} />
          ) : activeTab === 'business-types' ? (
            <BusinessTypes searchQuery={searchQuery} selectedConclaveId={selectedConclaveId} />
          ) : activeTab === 'captains' ? (
            <Captains searchQuery={searchQuery} selectedConclaveId={selectedConclaveId} />
          ) : activeTab === 'conclaves' ? (
            <Conclaves loggedInAdmin={loggedInAdmin} setActiveTab={handleTabChange} />
          ) : activeTab === 'snapshot' ? (
            <Snapshot selectedConclaveId={selectedConclaveId} />
          ) : activeTab === 'schedule-gen' ? (
            <ScheduleGen selectedConclaveId={selectedConclaveId} />
          ) : activeTab === 'schedule-review' ? (
            <ScheduleReview setActiveTab={handleTabChange} selectedConclaveId={selectedConclaveId} />
          ) : activeTab === 'round-runner' ? (
            <RoundRunner selectedConclaveId={selectedConclaveId} />
          ) : activeTab === 'reports' ? (
            <Reports selectedConclaveId={selectedConclaveId} />
          ) : activeTab === 'profile' ? (
            <AdminProfile loggedInAdmin={loggedInAdmin} role="admin" onLogout={handleLogout} />
          ) : (
            <div className="p-8 text-center text-zinc-400">View not found</div>
          )}
        </main>
      </div>
    </div>
  );
}
