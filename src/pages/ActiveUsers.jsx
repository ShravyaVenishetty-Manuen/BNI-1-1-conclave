import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronRight,
  X,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  RefreshCw,
  Info,
  Eye,
  LogIn,
  Camera,
  LogOut
} from 'lucide-react';
import Pagination from '../components/Pagination';

const initialSessions = [
  {
    id: 'BNI-92843',
    name: 'Devendra Chawla',
    title: 'Lead Architect, SkyBridge Real Estate',
    category: 'Real Estate Dev',
    isCaptain: true,
    loginTime: '08:15 AM',
    duration: '4h 12m',
    logoutDeadline: '12:45:00 PM',
    logoutTimer: '12:44',
    logoutPercent: 62,
    status: 'Online',
    avatar: 'DC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1r9ZwwkMbvsS197M3RxXmwFXJiIx5CSY9B3gZ3ed9tUbG_WdU9k0dy-CEyeGMtsOd3ScBPZTviacTOYFOZutH1K80ip_My5tri2DPjCC_wJoSVv_fzFae7UTpHUbAGmMeg7JIx_xMHWmxxsfKXEfJEpngVrdgeTM9Xr0IzzDPNFPG6de2EQHM_qLjvBmNc96RxiJUALcYAqCoFtIU027prTkX2O2zQLb_oj9z_G0JxDeOu5j0yvLmzv6t1F7hDemJcK9puv0er5Q',
    sessionKey: 'sk_prod_2291xAB_44',
    protocol: 'HTTPS / WebSockets',
    heartbeat: 'ACTIVE (800ms)',
    timeline: [
      { event: 'Snapshot Readiness Check', time: '11:12 AM', desc: 'All mandatory conclave fields verified. Readiness: 100%' },
      { event: 'In-App Navigation', time: '10:45 AM', desc: 'Accessed "Business Matching" dashboard and updated preferences.' },
      { event: 'System Authentication', time: '08:15 AM', desc: 'Secure session established from 192.168.1.45.' }
    ]
  },
  {
    id: 'BNI-11202',
    name: 'Manish Trivedi',
    title: 'Senior Partner, Trivedi Financials',
    category: 'IT Consulting',
    isCaptain: false,
    loginTime: '09:45 AM',
    duration: '2h 42m',
    logoutDeadline: '01:30:00 PM',
    logoutTimer: '54:02',
    logoutPercent: 80,
    status: 'Idle',
    avatar: 'MT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdGurGA3ulV9ieUcjXHI96VRKzzg1u49flN6xoZclsAWXnuhfDmBWmFIpyuumMLc715g-0bde-xvEDYcPbo5Le_lhJs37haOYYJ09cObC34O_fhebluQX5E0EPdGmEAMGbtLP7CVDAsJ6miX00oGmngM49ERmD6yZfrZTHmWCDEVRrEG5r3SmGOUUEupFglkFWIfDdWVQqj7Bo-TML9qq6xMHgbM_1k_4x9cCfsEvkFmMGeyKzHzrK73rEHwt-MqeoW1D85O9cm5U',
    sessionKey: 'sk_prod_5492kLD_29',
    protocol: 'HTTPS / JSON-RPC',
    heartbeat: 'IDLE (15s)',
    timeline: [
      { event: 'In-App Navigation', time: '10:15 AM', desc: 'Viewed table assignments and captain profiles.' },
      { event: 'System Authentication', time: '09:45 AM', desc: 'Session authenticated via Android device.' }
    ]
  },
  {
    id: 'BNI-44512',
    name: 'Esha Rao',
    title: 'Legal Counsel, Rao Associates',
    category: 'Legal Services',
    isCaptain: true,
    loginTime: '11:02 AM',
    duration: '1h 25m',
    logoutDeadline: '03:00:00 PM',
    logoutTimer: 'lock',
    logoutPercent: 100,
    status: 'Online',
    avatar: 'ER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDizJhD8bIRWT1DT0VnCLSYB_A_JuTKtI7_QYXDLxLkIvA0rP18fQlTKse9S8EoV_UN2dNR_gODJAf0FaDgTZstRGhKj2v90gZHjrHQ06oPreQnn3wF4BqfJvzKMBQpoKJcX4G3hJQ4JVA3vwT6z2k5qIrSc2utPuml2S8GVYxtOYL_PwrRqFvWtbmpfSBxXj7MrOMM9sFydWal9sHgu4o4Z8qTW6mPNAw7RBqNf069xKW8xrn69VelkbjTZEW0dSbS63nI_gRR3Y',
    sessionKey: 'sk_prod_9012jFK_33',
    protocol: 'HTTPS / WebSockets',
    heartbeat: 'ACTIVE (450ms)',
    timeline: [
      { event: 'Compliance Verification', time: '11:15 AM', desc: 'Real Estate credentials verified without overlaps.' },
      { event: 'System Authentication', time: '11:02 AM', desc: 'Session initialized using Safari on MacOS.' }
    ]
  },
  {
    id: 'BNI-00482',
    name: 'Rajesh Mehta',
    title: 'Managing Director, Mehta Realty Group',
    category: 'Real Estate Dev',
    isCaptain: true,
    loginTime: '07:30 AM',
    duration: '5h 12m',
    logoutDeadline: '12:00:00 PM',
    logoutTimer: '02:15',
    logoutPercent: 12,
    status: 'Online',
    avatar: 'RM',
    image: null,
    sessionKey: 'sk_prod_4402xRM_12',
    protocol: 'HTTPS / WebSockets',
    heartbeat: 'ACTIVE (600ms)',
    timeline: [
      { event: 'Table 12 Leader Log', time: '08:00 AM', desc: 'Marked 4 checked-in members at Conclave Table 12.' }
    ]
  },
  {
    id: 'BNI-00512',
    name: 'Anjali Sharma',
    title: 'Founder, Sharma Ads & Media',
    category: 'Marketing',
    isCaptain: false,
    loginTime: '10:00 AM',
    duration: '2h 12m',
    logoutDeadline: '02:00:00 PM',
    logoutTimer: '45:12',
    logoutPercent: 75,
    status: 'Idle',
    avatar: 'AS',
    image: null,
    sessionKey: 'sk_prod_5502xAS_98',
    protocol: 'HTTPS / REST-HTTP',
    heartbeat: 'IDLE (2m)',
    timeline: [
      { event: 'Profile Verification', time: '10:05 AM', desc: 'Updated chapter tags to Apex Chapter Conclave.' }
    ]
  }
];

export default function ActiveUsers() {
  const [sessions, setSessions] = useState(initialSessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSession, setSelectedSession] = useState(null);

  // Selection/checkbox states
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isBulkLogoutOpen, setIsBulkLogoutOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Real-time toast state
  const [toast, setToast] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Trigger toast micro-interaction on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast({
        title: 'Real-time Session Update',
        desc: '14 new members joined Chapter Alpha sessions.'
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    setCurrentPage(1);
    setSelectedRows(new Set());
    return sessions.filter(s => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchTerm, statusFilter]);

  // Paginated Sessions
  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSessions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSessions, currentPage]);

  // Checkbox toggle logic
  const toggleRow = (id, e) => {
    e.stopPropagation();
    const updated = new Set(selectedRows);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedRows(updated);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredSessions.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredSessions.map(s => s.id)));
    }
  };

  // CSV Export
  const handleExport = () => {
    if (filteredSessions.length === 0) {
      showToast('No sessions to export', 'error');
      return;
    }
    const headers = ['Session ID', 'Member Name', 'Classification', 'Role', 'Login Time', 'Duration', 'Deadline', 'Status'];
    const rows = filteredSessions.map(s => [
      s.id,
      `"${s.name}"`,
      `"${s.category}"`,
      s.isCaptain ? 'Captain' : 'Member',
      s.loginTime,
      s.duration,
      s.logoutDeadline,
      s.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bni_active_sessions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Completed', `Successfully exported ${filteredSessions.length} active sessions.`);
  };

  const handleBulkExport = () => {
    const selectedList = sessions.filter(s => selectedRows.has(s.id));
    if (selectedList.length === 0) return;
    const headers = ['Session ID', 'Member Name', 'Classification', 'Role', 'Login Time', 'Duration', 'Deadline', 'Status'];
    const rows = selectedList.map(s => [
      s.id,
      `"${s.name}"`,
      `"${s.category}"`,
      s.isCaptain ? 'Captain' : 'Member',
      s.loginTime,
      s.duration,
      s.logoutDeadline,
      s.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `selected_sessions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Selected', `Successfully exported ${selectedList.length} sessions.`);
  };

  // Refresh helper
  const handleRefresh = () => {
    showToast('Refreshing Sessions', 'Active session logs updated to real-time.');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">

      {/* Header section */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Active Users</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Monitor active BNI member sessions and participation readiness for upcoming conclaves. Refreshed regularly.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            Export
          </button>
          <button
            onClick={handleRefresh}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button rounded-lg transition-smooth shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            Refresh Sessions
          </button>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Total Active</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">1,284</span>
            <span className="text-label-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              +4%
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Logged In Today</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">3,412</span>
            <span className="text-label-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              +12%
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Ready for Snapshot</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">892</span>
            <span className="text-label-xs font-semibold text-zinc-500">98% of goal</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Auto Logout Pending</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">42</span>
            <span className="text-label-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">8 critical</span>
          </div>
        </div>
      </div>

      {/* Widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Widget 1: Live Session Status */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="font-bold text-zinc-950 border-b border-zinc-100 pb-2.5 text-body-sm flex items-center justify-between">
            Live Session Status
            <Info className="w-4 h-4 text-zinc-400" />
          </h3>
          <div className="space-y-5 pt-1">
            {/* Stacked Progress Bar */}
            <div className="h-3 bg-zinc-100 rounded-full overflow-hidden flex border border-zinc-200/30">
              <div className="h-full bg-brand-red rounded-l-full" style={{ width: '62%' }} title="Online: 62%"></div>
              <div className="h-full bg-red-400 animate-pulse" style={{ width: '26%' }} title="Idle: 26%"></div>
              <div className="h-full bg-zinc-200 rounded-r-full" style={{ width: '12%' }} title="Expiring: 12%"></div>
            </div>

            {/* Legend & Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-body-sm">
                <div className="flex items-center gap-2 font-semibold text-zinc-700">
                  <span className="w-2.5 h-2.5 rounded bg-brand-red"></span>
                  <span>Online</span>
                </div>
                <span className="font-bold text-zinc-900">742 <span className="text-zinc-400 font-semibold text-xs">(62%)</span></span>
              </div>

              <div className="flex justify-between items-center text-body-sm border-t border-zinc-100 pt-2.5">
                <div className="flex items-center gap-2 font-semibold text-zinc-700">
                  <span className="w-2.5 h-2.5 rounded bg-red-400"></span>
                  <span>Idle</span>
                </div>
                <span className="font-bold text-zinc-900">312 <span className="text-zinc-400 font-semibold text-xs">(26%)</span></span>
              </div>

              <div className="flex justify-between items-center text-body-sm border-t border-zinc-100 pt-2.5">
                <div className="flex items-center gap-2 font-semibold text-zinc-700">
                  <span className="w-2.5 h-2.5 rounded bg-zinc-200"></span>
                  <span>Expiring</span>
                </div>
                <span className="font-bold text-zinc-900">142 <span className="text-zinc-400 font-semibold text-xs">(12%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Auto Logout Monitor */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="font-bold text-zinc-950 border-b border-zinc-100 pb-2.5 text-body-sm flex items-center justify-between">
            Auto Logout Monitor
            <Eye className="w-4 h-4 text-zinc-400" />
          </h3>
          <div className="flex items-end gap-3 h-28 pt-2 px-1">
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full bg-zinc-100 rounded-t-md flex flex-col justify-end h-20 overflow-hidden border border-zinc-200/10">
                <div className="bg-brand-red/70 w-full" style={{ height: '15%' }}></div>
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase">5m</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full bg-zinc-100 rounded-t-md flex flex-col justify-end h-20 overflow-hidden border border-zinc-200/10">
                <div className="bg-brand-red w-full" style={{ height: '45%' }}></div>
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase">15m</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full bg-zinc-100 rounded-t-md flex flex-col justify-end h-20 overflow-hidden border border-zinc-200/10">
                <div className="bg-brand-red w-full" style={{ height: '80%' }}></div>
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase">30m</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full bg-zinc-100 rounded-t-md flex flex-col justify-end h-20 overflow-hidden border border-zinc-200/10">
                <div className="bg-zinc-800 w-full" style={{ height: '60%' }}></div>
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase">60m+</span>
            </div>
          </div>
        </div>

        {/* Widget 3: Live Activity Feed */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-4 overflow-hidden">
          <h3 className="font-bold text-zinc-950 border-b border-zinc-100 pb-2.5 text-body-sm flex items-center justify-between">
            Live Activity Feed
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-red-50 text-brand-red rounded border border-red-100 uppercase tracking-wider">LIVE</span>
          </h3>
          <div className="space-y-4 max-h-28 overflow-y-auto pr-1 pt-1">
            <div className="flex gap-2.5 border-l-2 border-brand-red pl-3 py-0.5">
              <LogIn className="w-3.5 h-3.5 text-brand-red shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-zinc-800 leading-tight">Anjali Sharma logged in</p>
                <span className="text-[9px] text-zinc-450 font-semibold block mt-0.5">2 mins ago • Session ID: #1294</span>
              </div>
            </div>
            <div className="flex gap-2.5 border-l-2 border-zinc-400 pl-3 py-0.5">
              <Camera className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-zinc-800 leading-tight">Snapshot readiness verified</p>
                <span className="text-[9px] text-zinc-450 font-semibold block mt-0.5">5 mins ago • Conclave B-12</span>
              </div>
            </div>
            <div className="flex gap-2.5 border-l-2 border-brand-red pl-3 py-0.5">
              <LogOut className="w-3.5 h-3.5 text-brand-red shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-zinc-800 leading-tight">System Auto Logout: Manoj R.</p>
                <span className="text-[9px] text-zinc-455 font-semibold block mt-0.5">8 mins ago • Inactivity Timeout</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Table Toolbar */}
      <div className="bg-white border border-zinc-200/80 p-3.5 flex flex-col lg:flex-row gap-3 items-center justify-between rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm placeholder-zinc-400 focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth bg-zinc-50/20"
              placeholder="Filter sessions by name, ID or category..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-zinc-200 rounded-lg px-3 py-2 text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white font-medium text-zinc-700 transition-smooth cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Idle">Idle</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
          className="text-label-md font-bold text-brand-red hover:underline px-4 cursor-pointer shrink-0 transition-smooth text-button"
        >
          Reset Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
        {/* Active sessions list table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-label-xs font-bold text-zinc-400 uppercase tracking-wider">
                <th className="px-5 py-4 w-12 text-center">
                  <input
                    checked={filteredSessions.length > 0 && selectedRows.size === filteredSessions.length}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                    type="checkbox"
                  />
                </th>
                <th className="px-5 py-4">Member</th>
                <th className="px-5 py-4">Business Type</th>
                <th className="px-5 py-4">Captain Status</th>
                <th className="px-5 py-4 text-center">Auto Logout</th>
                <th className="px-5 py-4">Session</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-table-text">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-zinc-400 font-medium">
                    No active sessions found matching filters.
                  </td>
                </tr>
              ) : (
                paginatedSessions.map((session) => (
                  <tr
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="group cursor-pointer"
                  >
                    <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        checked={selectedRows.has(session.id)}
                        onChange={(e) => toggleRow(session.id, e)}
                        className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                        type="checkbox"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-zinc-50 overflow-hidden border border-zinc-150 shrink-0">
                          {session.image ? (
                            <img className="w-full h-full object-cover" src={session.image} alt={session.name} />
                          ) : (
                            <div className="w-full h-full bg-brand-red/10 text-brand-red font-bold text-xs flex items-center justify-center">
                              {session.avatar}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-body-sm font-bold text-zinc-900 transition-smooth leading-tight block">{session.name}</span>
                          <span className="text-[9px] text-zinc-450 font-bold uppercase mt-0.5">ID: {session.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 bg-zinc-50 text-zinc-500 border border-zinc-200 text-[10px] font-semibold rounded-md">
                        {session.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {session.isCaptain ? (
                        <div className="flex items-center gap-1.5 text-brand-red text-[11px] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" />
                          <span>Captain</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-450 font-medium">Member</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-center gap-1">
                        {session.logoutTimer === 'lock' ? (
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        ) : (
                          <>
                            <span className="text-[10px] font-extrabold text-brand-red font-mono">{session.logoutTimer}</span>
                            <div className="w-16 bg-zinc-100 h-1 rounded-full overflow-hidden border border-zinc-250/20">
                              <div className="bg-brand-red h-full rounded-full" style={{ width: `${session.logoutPercent}%` }}></div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[11px] font-semibold text-zinc-700">
                        <p>{session.loginTime}</p>
                        <p className="text-zinc-400 font-medium mt-0.5">Duration: {session.duration}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {session.status === 'Online' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span> Idle
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === session.id ? null : session.id)}
                            className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {activeDropdown === session.id && (
                            <>
                              <div
                                onClick={() => setActiveDropdown(null)}
                                className="fixed inset-0 z-40 cursor-default"
                              />
                              <div className="absolute right-0 mt-1 w-36 bg-white border border-zinc-100 rounded-lg shadow-lg py-1 z-50 text-left animate-fade-in">
                                <button
                                  onClick={() => {
                                    setSelectedSession(session);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 transition-smooth"
                                >
                                  Session Details
                                </button>
                                <button
                                  onClick={() => {
                                    showToast('Notification Sent', `Sent session ping alert to ${session.name}.`);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 transition-smooth"
                                >
                                  Notify User
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget(session);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-[11px] font-extrabold text-brand-red transition-smooth border-t border-zinc-100"
                                >
                                  Terminate Session
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredSessions.length}
          onPageChange={setCurrentPage}
          label="sessions"
        />
      </div>

      {/* Session Details Drawer Panel */}
      <div
        onClick={() => setSelectedSession(null)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[55] transition-opacity duration-300 ${selectedSession ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      <div className={`fixed right-0 top-0 h-screen w-full max-w-[440px] bg-white z-[60] border-l border-zinc-200 shadow-2xl transform transition-transform duration-300 ${selectedSession ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {selectedSession && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-700 transition-smooth cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-section-heading font-extrabold text-zinc-950">Session Details</h3>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Profile head */}
              <div className="flex flex-col items-center gap-3 text-center bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <div className="w-20 h-20 rounded-lg border border-zinc-200 p-1 bg-white overflow-hidden shrink-0 shadow-sm">
                  {selectedSession.image ? (
                    <img className="w-full h-full object-cover rounded-md" src={selectedSession.image} alt={selectedSession.name} />
                  ) : (
                    <div className="w-full h-full rounded-md bg-brand-red/10 text-brand-red font-bold text-xl flex items-center justify-center">
                      {selectedSession.avatar}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-headline-md font-bold text-zinc-950 leading-tight">{selectedSession.name}</h4>
                  <p className="text-[10px] text-zinc-450 font-bold uppercase mt-1">ID: {selectedSession.id}</p>

                  <div className="flex gap-2 mt-2.5 justify-center">
                    {selectedSession.isCaptain && (
                      <span className="px-2.5 py-0.5 bg-red-50 text-brand-red border border-red-150 rounded-md text-[9px] font-extrabold uppercase">
                        Captain
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-500 border border-zinc-200 rounded-md text-[9px] font-semibold uppercase">
                      {selectedSession.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 border border-zinc-100 bg-white rounded-lg shadow-sm">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Business Type</span>
                  <span className="text-body-sm font-bold text-zinc-800 block mt-1">{selectedSession.category}</span>
                </div>
                <div className="p-3.5 border border-zinc-100 bg-white rounded-lg shadow-sm">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Chapter Group</span>
                  <span className="text-body-sm font-bold text-zinc-800 block mt-1">Metro Core Alpha</span>
                </div>
                <div className="p-3.5 border border-zinc-100 bg-white rounded-lg shadow-sm">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Login Time</span>
                  <span className="text-body-sm font-bold text-zinc-800 block mt-1">{selectedSession.loginTime}</span>
                </div>
                <div className="p-3.5 border border-zinc-100 bg-white rounded-lg shadow-sm">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Logout Deadline</span>
                  <span className="text-body-sm font-bold text-brand-red block mt-1">{selectedSession.logoutDeadline}</span>
                </div>
              </div>

              {/* Timeline Activity */}
              {selectedSession.timeline && selectedSession.timeline.length > 0 && (
                <section className="space-y-3.5">
                  <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">Activity Timeline</h5>
                  <div className="relative pl-3 space-y-5 border-l border-zinc-100 ml-1.5 mt-2">
                    {selectedSession.timeline.map((t, idx) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[17.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-brand-red' : 'bg-zinc-350'
                          }`} />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-body-sm font-bold text-zinc-800 leading-tight">{t.event}</span>
                          <span className="text-[9px] text-zinc-500 font-semibold">{t.time} • {t.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Session Meta Specs */}
              <section className="space-y-3 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-500">
                  <span>Session Key:</span>
                  <span className="font-mono text-zinc-700">{selectedSession.sessionKey}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-500">
                  <span>Protocol:</span>
                  <span className="text-zinc-750">{selectedSession.protocol}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-500">
                  <span>Heartbeat Status:</span>
                  <span className="text-brand-red font-bold">{selectedSession.heartbeat}</span>
                </div>
              </section>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex gap-2 shrink-0">
              <button
                onClick={() => {
                  showToast('Notification Sent', `Sent session ping alert to ${selectedSession.name}.`);
                  setSelectedSession(null);
                }}
                className="flex-1 py-2 bg-white border border-zinc-200 text-zinc-650 hover:bg-zinc-50 rounded-lg text-button font-bold transition-smooth shadow-sm cursor-pointer"
              >
                Notify User
              </button>
              <button
                onClick={() => {
                  setDeleteTarget(selectedSession);
                  setSelectedSession(null);
                }}
                className="flex-1 py-2 bg-brand-red hover:bg-red-700 text-white rounded-lg text-button font-bold transition-smooth shadow-sm cursor-pointer"
              >
                Terminate Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Terminate Single Session Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-xl border border-zinc-100 shadow-2xl p-5 space-y-4 animate-scale-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-body-sm font-bold text-zinc-950 leading-tight">Terminate Session</h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  Are you sure you want to disconnect this user session? The user will be automatically logged out.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-[11px] text-zinc-500 font-medium">
              User: <span className="font-bold text-zinc-900">{deleteTarget.name}</span><br />
              ID: <span className="font-mono text-zinc-700 font-bold">{deleteTarget.id}</span>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold border border-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSessions(prev => prev.filter(s => s.id !== deleteTarget.id));
                  showToast('Session Terminated', `Successfully disconnected ${deleteTarget.name}.`);
                  setDeleteTarget(null);
                }}
                className="px-3.5 py-1.5 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminate Bulk Sessions Confirmation */}
      {isBulkLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-xl border border-zinc-100 shadow-2xl p-5 space-y-4 animate-scale-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-body-sm font-bold text-zinc-950 leading-tight">Terminate Selected Sessions</h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  Are you sure you want to terminate all {selectedRows.size} selected member sessions?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsBulkLogoutOpen(false)}
                className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold border border-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSessions(prev => prev.filter(s => !selectedRows.has(s.id)));
                  showToast('Bulk Terminated', `Terminated ${selectedRows.size} sessions.`);
                  setSelectedRows(new Set());
                  setIsBulkLogoutOpen(false);
                }}
                className="px-3.5 py-1.5 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold"
              >
                Terminate All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 text-white rounded-lg shadow-2xl py-2 px-4 flex items-center gap-3.5 border border-zinc-800 animate-slide-up text-body-sm font-semibold select-none">
          <span className="text-[10px] font-extrabold uppercase tracking-wide bg-zinc-800 px-2 py-0.5 rounded text-zinc-350">{selectedRows.size} Selected</span>
          <div className="w-px h-4 bg-zinc-800" />
          <button
            onClick={handleBulkExport}
            className="text-white hover:text-brand-red transition-smooth flex items-center gap-1.5 cursor-pointer text-button text-[10px]"
          >
            <Download className="w-3.5 h-3.5 animate-bounce-slow" />
            Export Selected
          </button>
          <button
            onClick={() => setIsBulkLogoutOpen(true)}
            className="text-brand-red hover:text-red-400 transition-smooth flex items-center gap-1.5 cursor-pointer text-button text-[10px]"
          >
            <X className="w-3.5 h-3.5" />
            Terminate Selected
          </button>
        </div>
      )}

      {/* Real-time Toast Notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[70] bg-zinc-900 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-xl flex items-center gap-2 border border-zinc-800 animate-slide-up">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          <div>
            <p className="font-bold">{toast.title}</p>
            <p className="text-zinc-400 font-semibold mt-0.5">{toast.desc}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-white opacity-40 hover:opacity-100 ml-2"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

    </div>
  );
}
