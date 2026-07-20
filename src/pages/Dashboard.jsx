import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Users,
  Bolt,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  UserCheck,
  MapPin,
  UserPlus,
  PlusCircle,
  BadgeCheck,
  Sparkles,
  BarChart3,
  ChevronDown,
  Send,
  Shield
} from 'lucide-react';

import { api } from '../services/api';
import membersData from '../data/members.json';
import captainsData from '../data/captains.json';
import referralsJson from '../data/referrals.json';

export default function Dashboard({ setActiveTab, selectedConclaveId, setSelectedConclaveId, loggedInAdmin }) {
  // Referrals: merge static seed data with any localStorage referrals
  const [referrals, setReferrals] = useState(() => {
    const stored = localStorage.getItem('bni_referrals');
    const local = stored ? JSON.parse(stored) : [];
    // Merge: local entries override seed, keyed by id
    const merged = [...referralsJson];
    local.forEach(r => {
      if (!merged.find(m => m.id === r.id)) merged.push(r);
    });
    return merged;
  });

  useEffect(() => {
    const sync = () => {
      const s = localStorage.getItem('bni_referrals');
      const local = s ? JSON.parse(s) : [];
      setReferrals(() => {
        const merged = [...referralsJson];
        local.forEach(r => {
          if (!merged.find(m => m.id === r.id)) merged.push(r);
        });
        return merged;
      });
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const [conclaves, setConclaves] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch conclaves
  useEffect(() => {
    async function loadConclaves() {
      try {
        const data = await api.get('/admin/conclaves');
        setConclaves(data || []);
      } catch (err) {
        console.error("Failed to load conclaves:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConclaves();
  }, []);

  // Fetch stats for the selected conclave
  useEffect(() => {
    if (!selectedConclaveId) return;
    async function loadStats() {
      try {
        const data = await api.get(`/admin/conclaves/${selectedConclaveId}/stats`);
        setStats(data);
      } catch (err) {
        console.error("Failed to load conclave stats:", err);
      }
    }
    loadStats();
  }, [selectedConclaveId]);

  // Conclave selector — from props
  const [showPicker, setShowPicker] = useState(false);

  const selectedConclave = useMemo(() => {
    if (conclaves.length === 0) return null;
    const found = conclaves.find(c => c.id === selectedConclaveId);
    return found || conclaves[0];
  }, [conclaves, selectedConclaveId]);

  // Filtered data based on selected conclave
  const totalMembers = useMemo(() => {
    if (stats) return stats.counts.registered;
    const filtered = membersData.filter(m => m.conclaveIds && m.conclaveIds.includes(selectedConclaveId));
    return filtered.length;
  }, [stats, selectedConclaveId]);

  const totalCaptains = useMemo(() => {
    if (stats) return stats.counts.captains;
    const filtered = captainsData.filter(c => c.conclaveIds && c.conclaveIds.includes(selectedConclaveId));
    return filtered.length;
  }, [stats, selectedConclaveId]);

  const filteredCaptains = useMemo(() => {
    const list = captainsData.filter(c => c.conclaveIds && c.conclaveIds.includes(selectedConclaveId));
    if (stats && list.length === 0 && stats.counts.captains > 0) {
      return Array.from({ length: stats.counts.captains }).map((_, i) => ({
        id: `cap-${i}`,
        name: `Table Captain ${i + 1}`,
        status: 'Assigned',
        conclaveIds: [selectedConclaveId]
      }));
    }
    return list;
  }, [stats, selectedConclaveId]);

  const filteredReferrals = useMemo(() => {
    return referrals.filter(r => r.conclaveId === selectedConclaveId);
  }, [referrals, selectedConclaveId]);

  const totalReferrals = useMemo(() => {
    if (stats) return stats.counts.referrals;
    return filteredReferrals.length;
  }, [stats, filteredReferrals]);

  const connectedReferrals = useMemo(() => {
    if (stats) return Math.round(stats.counts.referrals * 0.6);
    return filteredReferrals.filter(r => r.status === 'Connected').length;
  }, [stats, filteredReferrals]);

  const pendingReferrals = useMemo(() => {
    if (stats) return Math.round(stats.counts.referrals * 0.3);
    return filteredReferrals.filter(r => r.status === 'Pending').length;
  }, [stats, filteredReferrals]);

  const closedReferrals = useMemo(() => {
    if (stats) return Math.round(stats.counts.referrals * 0.1);
    return filteredReferrals.filter(r => r.status === 'Closed').length;
  }, [stats, filteredReferrals]);

  // Top referral givers for this conclave
  const leaderboard = useMemo(() => {
    const counts = {};
    filteredReferrals.forEach(r => {
      if (!counts[r.fromMemberId]) {
        counts[r.fromMemberId] = { name: r.fromName, count: 0 };
      }
      counts[r.fromMemberId].count++;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 3);
  }, [filteredReferrals]);

  // Status badge styles
  const getStatusStyle = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'running': return 'bg-emerald-600 text-white';
      case 'upcoming':
      case 'registration_open': return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'completed': return 'bg-zinc-100 text-zinc-600 border border-zinc-200';
      case 'draft': return 'bg-zinc-50 text-zinc-400 border border-zinc-200';
      default: return 'bg-zinc-50 text-zinc-500 border border-zinc-200';
    }
  };

  const displayStatus = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'registration_open') return 'Registration Open';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if (!selectedConclave) {
    return (
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 max-w-[1600px] mx-auto w-full">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-6">
          <div>
            <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Admin Dashboard</h2>
            <p className="text-body-text text-zinc-500 mt-1">
              Welcome back, {loggedInAdmin?.name || 'Admin'}.
            </p>
          </div>
        </header>

        {/* Empty State Card */}
        <div className="bg-white rounded-xl border border-zinc-200/85 p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-base font-bold text-zinc-800">No Active Conclave Assigned</h3>
          <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto font-semibold leading-relaxed">
            There are currently no active conclaves in the database. Please navigate to the Conclaves tab to create one.
          </p>
        </div>
      </div>
    );
  }

  const conclaveDate = selectedConclave.date ? new Date(selectedConclave.date).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A';
  const conclaveVenue = selectedConclave.venueLocation || selectedConclave.venue || 'N/A';
  const conclaveProgress = (selectedConclave.status || '').toLowerCase() === 'completed' ? 100 : (selectedConclave.status || '').toLowerCase() === 'running' ? 60 : 0;

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 max-w-[1600px] mx-auto w-full">

      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Admin Dashboard</h2>
          <p className="text-body-text text-zinc-500 mt-1">
            Welcome back, {loggedInAdmin?.name || 'Admin'}.
          </p>
        </div>
      </header>

      {/* Conclave Selector */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md transition-smooth cursor-pointer group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-brand-red/10 text-brand-red rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[13px] font-black text-zinc-900 truncate">{selectedConclave.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-full ${getStatusStyle(selectedConclave.status)}`}>
                  {displayStatus(selectedConclave.status)}
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold">{conclaveDate}</span>
              </div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showPicker ? 'rotate-180' : ''}`} />
        </button>

        {showPicker && (
          <div className="absolute z-30 top-full mt-1.5 left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden max-h-[320px] overflow-y-auto animate-fade-in">
            {conclaves.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedConclaveId(c.id); setShowPicker(false); }}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-zinc-50 transition-smooth cursor-pointer border-b border-zinc-100 last:border-0 ${c.id === selectedConclaveId ? 'bg-red-50/30' : ''}`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${(c.status || '').toLowerCase() === 'running' ? 'bg-emerald-500 animate-pulse' : (c.status || '').toLowerCase() === 'upcoming' || (c.status || '').toLowerCase() === 'registration_open' ? 'bg-amber-400' : (c.status || '').toLowerCase() === 'completed' ? 'bg-zinc-300' : 'bg-zinc-200'}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-[12px] font-bold truncate ${c.id === selectedConclaveId ? 'text-brand-red' : 'text-zinc-800'}`}>{c.name}</p>
                  <p className="text-[9.5px] text-zinc-400 font-semibold mt-0.5">
                    {c.date ? new Date(c.date).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'} • {c.venueLocation || c.venue || 'N/A'}
                  </p>
                </div>
                <span className={`px-1.5 py-0.5 text-[7.5px] font-black uppercase tracking-wider rounded shrink-0 ${getStatusStyle(c.status)}`}>
                  {displayStatus(c.status)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-zinc-500 uppercase font-semibold">Members</span>
            <Users className="w-4 h-4 text-zinc-350" />
          </div>
          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">{totalMembers}</span>
          <span className="text-[9.5px] text-zinc-400 font-semibold mt-1.5">of {selectedConclave.memberLimit || 100} capacity</span>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-zinc-500 uppercase font-semibold">Captains</span>
            <Shield className="w-4 h-4 text-zinc-350" />
          </div>
          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">{totalCaptains}</span>
          <span className="text-[9.5px] text-zinc-400 font-semibold mt-1.5">of {selectedConclave.captainLimit || 12} limit</span>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-zinc-500 uppercase font-semibold">Referrals</span>
            <Send className="w-4 h-4 text-zinc-350" />
          </div>
          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">{totalReferrals}</span>
          <span className="text-[9.5px] text-zinc-400 font-semibold mt-1.5">{connectedReferrals} connected, {pendingReferrals} pending</span>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-zinc-500 uppercase font-semibold">Status</span>
            <CheckCircle2 className="w-4 h-4 text-zinc-350" />
          </div>
          <span className={`text-display-sm font-extrabold leading-none mt-3 ${(selectedConclave.status || '').toLowerCase() === 'running' ? 'text-emerald-600' : (selectedConclave.status || '').toLowerCase() === 'completed' ? 'text-zinc-500' : 'text-amber-600'}`}>
            {displayStatus(selectedConclave.status)}
          </span>
          <span className="text-[9.5px] text-zinc-400 font-semibold mt-1.5">{conclaveProgress}% complete</span>
        </div>
      </section>

      {/* Quick Actions & Featured Conclave Highlight */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Quick Management Panel */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 px-0.5">Quick Management</span>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab && setActiveTab('members')}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">Add New Member</span>
              <UserPlus className="w-[18px] h-[18px] text-brand-red" />
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('conclaves')}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">Create Conclave</span>
              <PlusCircle className="w-[18px] h-[18px] text-brand-red" />
            </button>

            <button
              onClick={() => {
                localStorage.setItem('schedule_review_tab', 'validation');
                setActiveTab && setActiveTab('schedule-review');
              }}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">Run Validation</span>
              <BadgeCheck className="w-[18px] h-[18px] text-brand-red" />
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('schedule-gen')}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">Generate Schedule</span>
              <Sparkles className="w-[18px] h-[18px] text-brand-red" />
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('reports')}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">View Reports</span>
              <BarChart3 className="w-[18px] h-[18px] text-brand-red" />
            </button>
          </div>
        </div>

        {/* Featured Conclave Highlight — Dynamic */}
        <div className="lg:col-span-9 p-6 border border-zinc-200 bg-white text-zinc-800 flex flex-col md:flex-row gap-6 relative overflow-hidden group shadow-sm rounded-xl justify-between items-stretch">

          <div className="flex-1 z-10 flex flex-col py-1">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-white rounded-xl text-brand-red border border-zinc-200 shadow-inner flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-headline-md font-bold leading-tight text-zinc-950">{selectedConclave.name}</h3>
                <div className="flex flex-wrap gap-3 mt-1.5 items-center">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider shadow-sm ${getStatusStyle(selectedConclave.status)}`}>
                    {(selectedConclave.status || '').toLowerCase() === 'running' ? 'Current Conclave Running' : displayStatus(selectedConclave.status)}
                  </span>
                  <span className="text-label-xs text-zinc-500 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {conclaveVenue}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-4 py-4 border-y border-zinc-200/80 mt-5">
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Members</p>
                <p className="font-extrabold text-[15px] text-zinc-950 leading-tight mt-1">{totalMembers} / {selectedConclave.memberLimit || 100}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Captains</p>
                <p className="font-extrabold text-[15px] text-zinc-950 leading-tight mt-1">{totalCaptains} / {selectedConclave.captainLimit || 12}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Referrals</p>
                <p className="font-extrabold text-[15px] text-zinc-950 leading-tight mt-1">{totalReferrals} Exchanged</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Coordinator</p>
                <p className="font-extrabold text-[15px] text-zinc-950 leading-tight mt-1">{selectedConclave.coordinator}</p>
              </div>
            </div>

            {/* Live indicator for Running conclaves */}
            {(selectedConclave.status || '').toLowerCase() === 'running' && (
              <div className="mt-4 flex items-start gap-2.5">
                <span className="flex h-2 w-2 relative mt-1 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
                </span>
                <p className="text-[11px] leading-normal font-semibold text-zinc-600">
                  <strong className="text-brand-red font-bold">Live Session</strong> is currently in progress. Captains should check-in attendees at their respective tables.
                </p>
              </div>
            )}

            <div className="space-y-2 mt-auto pt-4">
              <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-555 tracking-wider">
                <span>Conclave Progress</span>
                <span>{conclaveProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-250 cursor-pointer pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={[{ name: 'Progress', value: conclaveProgress }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip formatter={(value) => `${value}%`} cursor={false} />
                    <Bar dataKey="value" fill="#cf2e2e" radius={[4, 4, 4, 4]} background={{ fill: '#e4e4e7' }} barSize={8} activeBar={{ fill: '#cf2e2e' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right side: Captain activity & timeline */}
          <div className="w-full md:w-[250px] z-10 flex flex-col justify-between min-h-[175px] md:border-l border-zinc-200/80 md:pl-6 pt-4 md:pt-0">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Captain Breakdown</p>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-body-sm font-semibold text-zinc-800">{filteredCaptains.filter(c => c.status === 'Assigned').length} Assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span className="text-body-sm font-semibold text-zinc-800">{filteredCaptains.filter(c => c.status === 'Available').length} Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-zinc-400"></span>
                  <span className="text-body-sm font-semibold text-zinc-800">{filteredCaptains.filter(c => c.status === 'Busy').length} Busy</span>
                </div>
              </div>

              {/* Captain Avatars */}
              <div className="flex items-center gap-2 mt-5 pl-0.5">
                <div className="flex -space-x-1.5">
                  {filteredCaptains.slice(0, 4).map((cap, i) => (
                    <div key={cap.id} className={`w-6 h-6 rounded-full ${i === 0 ? 'bg-brand-red' : i === 1 ? 'bg-zinc-700' : i === 2 ? 'bg-zinc-500' : 'bg-zinc-300'} text-white flex items-center justify-center text-[7.5px] font-black border-2 border-white shadow-xs`}>
                      {cap.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                </div>
                {filteredCaptains.length > 4 && (
                  <span className="text-[9.5px] text-zinc-450 font-bold uppercase tracking-wider ml-1">+{filteredCaptains.length - 4} more</span>
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveTab && setActiveTab('captains')}
              className="w-full py-2.5 text-label-md font-bold text-zinc-800 border border-zinc-200 bg-white hover:bg-zinc-50 transition-smooth cursor-pointer mt-4 uppercase tracking-wider text-[10px] shadow-xs rounded-lg"
            >
              Manage Captains
            </button>
          </div>
        </div>
      </section>

      {/* Analytics: Referrals & Leaderboard */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Referrals Tracker — Dynamic */}
        <div className="p-5 border border-zinc-200/80 rounded-xl bg-white shadow-sm hover:shadow-md transition-smooth flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-title-lg text-zinc-950 font-semibold">Referrals Tracker</h4>
              <span className="text-label-xs text-zinc-400 font-bold uppercase tracking-wider">{selectedConclave.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-3">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <PieChart width={128} height={128}>
                  <Pie
                    data={[
                      { value: connectedReferrals + closedReferrals, fill: '#cf2e2e' },
                      { value: Math.max(pendingReferrals, 1), fill: '#f4f4f5' }
                    ]}
                    dataKey="value"
                    innerRadius={46}
                    outerRadius={56}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  />
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-display-sm text-zinc-950 font-bold leading-none">{totalReferrals}</span>
                  <span className="text-label-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">Total</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-zinc-200/60 shadow-xs">
                  <span className="text-body-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-brand-red rounded-full"></span> Connected
                  </span>
                  <span className="font-bold text-zinc-850 text-body-md">{connectedReferrals}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-zinc-200/60 shadow-xs">
                  <span className="text-body-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-amber-400 rounded-full"></span> Pending
                  </span>
                  <span className="font-bold text-zinc-850 text-body-md">{pendingReferrals}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-zinc-200/60 shadow-xs">
                  <span className="text-body-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-zinc-400 rounded-full"></span> Closed
                  </span>
                  <span className="font-bold text-zinc-850 text-body-md">{closedReferrals}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Referral Givers — Dynamic Leaderboard */}
        <div className="p-5 border border-zinc-200/80 rounded-xl bg-white shadow-sm hover:shadow-md transition-smooth flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-title-lg text-zinc-950 font-semibold">Top Referral Givers</h4>
              <span className="text-label-xs text-zinc-400 font-bold uppercase tracking-wider">This Conclave</span>
            </div>

            <div className="space-y-1">
              {leaderboard.length === 0 ? (
                <p className="text-body-sm text-zinc-400 font-semibold text-center py-6">No referrals exchanged in this conclave yet.</p>
              ) : (
                leaderboard.map((person, idx) => (
                  <div key={person.name + idx} className="flex items-center justify-between py-1.5 px-2 hover:bg-zinc-50 rounded-lg transition-smooth border border-transparent hover:border-zinc-100/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red font-bold text-xs flex items-center justify-center shrink-0 border border-brand-red/10">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-zinc-900 leading-tight">{person.name}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-body-sm font-bold text-brand-red">{person.count}</span>
                      <span className="text-[9px] text-zinc-400 font-semibold uppercase block tracking-wider mt-0.5">Referrals</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
