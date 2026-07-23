import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronRight,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Search,
  Filter,
  Grid,
  User,
  Users,
  Shield,
  X,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from 'recharts';
import { api } from '../services/api';
import conclavesData from '../data/conclaves.json';
import referralsJson from '../data/referrals.json';

import runnerData from '../data/tables_runner.json';
const { initialTables, mockRosters } = runnerData;

export default function RoundRunner({ selectedConclaveId }) {
  const [conclaves, setConclaves] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadConclaves() {
      try {
        const data = await api.get('/admin/conclaves');
        setConclaves(data);
      } catch (err) {
        console.error("Failed to load conclaves:", err);
      }
    }
    loadConclaves();
  }, []);

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

  const selectedConclave = useMemo(() =>
    conclaves.find(c => c.id === selectedConclaveId),
    [conclaves, selectedConclaveId]
  );

  const conclaveName = selectedConclave?.name || 'Conclave';

  const [allTables, setAllTables] = useState(initialTables);
  const setTables = (updater) => setAllTables(updater);

  const activeRound = selectedConclave?.currentRound || 1;

  const totalRounds = useMemo(() => {
    return selectedConclave?.scheduleSummary?.roundCount || selectedConclave?.roundCount || 4;
  }, [selectedConclave]);

  const progressPercent = useMemo(() => {
    const isConclaveCompleted = (selectedConclave?.status || '').toLowerCase() === 'completed';
    if (isConclaveCompleted) return 100;
    return Math.min(100, Math.round(((activeRound - 1) / totalRounds) * 100));
  }, [selectedConclave, activeRound, totalRounds]);

  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    if (!selectedConclaveId) return;
    async function loadReferrals() {
      try {
        const list = await api.get(`/admin/conclaves/${selectedConclaveId}/referrals`);
        setReferrals(list || []);
      } catch (err) {
        console.error("Failed to load referrals:", err);
      }
    }
    loadReferrals();
    const interval = setInterval(loadReferrals, 5000); // refresh every 5s for live real-time sync
    return () => clearInterval(interval);
  }, [selectedConclaveId]);

  const tables = useMemo(() => {
    if (selectedConclave && selectedConclave.schedule && selectedConclave.participants) {
      const roundSeating = selectedConclave.schedule.rounds.find(r => r.roundNumber === activeRound);
      if (roundSeating) {
        return roundSeating.tables.map(t => {
          const captain = selectedConclave.participants.find(p => p.id === t.captainId);
          const members = t.memberIds.map(mId => {
            const p = selectedConclave.participants.find(p => p.id === mId);
            return {
              id: p?._originalUid || String(mId),
              name: p?.name || 'Unknown',
              category: p?.businessCategory || 'Uncategorized',
              checkedIn: p?.isActive ?? true
            };
          });
          return {
            id: `Table ${t.tableNumber}`,
            tableNumber: t.tableNumber,
            conclaveId: selectedConclaveId,
            status: 'active',
            captain: {
              name: captain?.name || 'Unknown',
              role: 'Table Captain',
              initials: captain?.name ? captain.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'TC'
            },
            members
          };
        });
      }
    }
    return [];
  }, [selectedConclave, activeRound]);

  const filteredReferrals = useMemo(() =>
    referrals.filter(r => r.conclaveId === selectedConclaveId || !r.conclaveId),
    [referrals, selectedConclaveId]
  );

  const totalReferrals = filteredReferrals.length;
  const connectedReferrals = filteredReferrals.filter(r => r.status === 'Connected').length;
  const pendingReferrals = filteredReferrals.filter(r => r.status === 'Pending').length;
  const closedReferrals = filteredReferrals.filter(r => r.status === 'Closed').length;

  // Timer States
  const [timeLeft, setTimeLeft] = useState(765); // 12:45 in seconds
  const [timerRunning, setTimerRunning] = useState(true);

  const [toast, setToast] = useState(null);
  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  // Timer Tick Interval
  useEffect(() => {
    let timer = null;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft]);

  // Top 3 referrals leaderboard
  const leaderboard = useMemo(() => {
    const counts = {};
    filteredReferrals.forEach(r => {
      const giverId = r.fromMemberId || r.fromUserId || r.fromName || r.giverId || r.giverName;
      if (!giverId) return;
      if (!counts[giverId]) {
        const participant = selectedConclave?.participants?.find(p => 
          p.id === r.fromMemberId || 
          p.uid === r.fromMemberId || 
          p.id === r.fromUserId || 
          p.uid === r.fromUserId ||
          (p.name && r.fromName && p.name.toLowerCase().trim() === r.fromName.toLowerCase().trim())
        );
        const resolvedName = (r.fromName && r.fromName !== 'Unknown' && r.fromName !== 'Unknown Member')
          ? r.fromName
          : (participant?.name || r.giverName || 'Member');
        counts[giverId] = {
          name: resolvedName,
          category: participant?.businessCategory || r.fromCategory || 'BNI Member',
          count: 0
        };
      }
      counts[giverId].count++;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 3);
  }, [filteredReferrals, selectedConclave]);

  // Live feed updates derived 100% strictly from backend database data
  const feedLogs = useMemo(() => {
    const logs = [];
    if (!selectedConclave) return logs;

    // 1. Real referral events from backend API
    filteredReferrals.forEach(r => {
      const timeStr = r.createdAt 
        ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Synced';
      logs.push({
        event: 'Referral Logged',
        detail: `${r.fromName || 'Member'} sent referral slip to ${r.toName || 'Member'}${r.notes ? `: "${r.notes}"` : ''}`,
        time: timeStr,
        timestamp: r.createdAt ? new Date(r.createdAt).getTime() : 0
      });
    });

    // 2. Real round start event from backend
    if (selectedConclave.currentRound > 0 && selectedConclave.currentRoundStartedAt) {
      const startTime = new Date(selectedConclave.currentRoundStartedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      logs.push({
        event: `Round ${selectedConclave.currentRound} Active`,
        detail: `Official round status updated by administrator.`,
        time: startTime,
        timestamp: new Date(selectedConclave.currentRoundStartedAt).getTime()
      });
    }

    // 3. Real conclave completed status
    if (selectedConclave.status === 'completed') {
      logs.push({
        event: 'Conclave Completed',
        detail: `Conclave marked completed in database.`,
        time: 'Closed',
        timestamp: Date.now()
      });
    }

    // Sort newest first by real database timestamp
    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }, [selectedConclave, filteredReferrals]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start next round trigger
  const handleStartNextRound = async () => {
    try {
      const nextRoundVal = activeRound + 1;
      await api.post(`/admin/conclaves/${selectedConclaveId}/start-round`, {
        roundNumber: nextRoundVal
      });
      // Reload conclaves from Express backend API to sync states
      const data = await api.get('/admin/conclaves');
      setConclaves(data);
      showToast('Next Round Started', `Round ${nextRoundVal} started. Captains notified.`);
    } catch (err) {
      console.error("Failed to start round:", err);
      showToast('Start Round Failed', err.message || "Could not start next round.");
    }
  };

  // Finish conclave trigger
  const handleFinishConclave = async () => {
    try {
      await api.post(`/admin/conclaves/${selectedConclaveId}/complete`);
      // Reload conclaves from Express backend API to sync states
      const data = await api.get('/admin/conclaves');
      setConclaves(data);
      setTimerRunning(false);
      setTimeLeft(0);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      showToast('Conclave Concluded', 'Live conclave completed successfully.');
    } catch (err) {
      console.error("Failed to conclude conclave:", err);
      showToast('Conclude Failed', err.message || "Could not complete conclave.");
    }
  };


  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in relative">

      {/* Header Section */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Round Runner</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Live control for <span className="font-bold text-brand-red">{conclaveName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {activeRound < (selectedConclave?.roundCount || 4) && (
            <button
              onClick={handleStartNextRound}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-zinc-400 animate-spin-slow" />
              Start Round {activeRound + 1}
            </button>
          )}

          <button
            onClick={() => setTimerRunning(false)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <PauseCircle className="w-4 h-4 text-zinc-400" />
            Pause
          </button>

          <button
            onClick={() => setTimerRunning(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <PlayCircle className="w-4 h-4 text-zinc-400" />
            Resume
          </button>

          <button
            onClick={handleFinishConclave}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button rounded-lg transition-smooth shadow-md cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Finish Conclave
          </button>
        </div>
      </div>

      {/* Top Row: KPI card + Timer card side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Column: Status & KPI cards */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-6 h-full">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="px-3.5 py-1.5 bg-red-50 text-brand-red border border-red-100 rounded-lg">
                  <p className="text-[8px] font-bold uppercase tracking-wider">Current Stage</p>
                  <p className="text-body-sm font-bold mt-0.5">Round {activeRound} of {totalRounds}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-[10px] font-bold uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Running
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[9px] text-zinc-455 font-bold uppercase tracking-wider mb-1">Global Completion</p>
                <div className="w-44 h-1.5 rounded-full overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ value: progressPercent }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <Bar dataKey="value" fill="#af101a" radius={[2, 2, 2, 2]} background={{ fill: '#f4f4f5' }} barSize={6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[9px] text-zinc-400 font-bold mt-1">{progressPercent}% Complete</p>
              </div>
            </div>

            {/* KPI Overview row — 5 cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                <RefreshCw className="w-5 h-5 text-brand-red mb-2" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Active Round</p>
                  <h4 className="text-headline-md font-extrabold text-zinc-955 mt-1">{activeRound} / {totalRounds}</h4>
                </div>
              </div>

              <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                <Grid className="w-5 h-5 text-brand-red mb-2" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Running Tables</p>
                  <h4 className="text-headline-md font-extrabold text-zinc-955 mt-1">
                    {selectedConclave?.scheduleSummary?.tableCount || stats?.counts?.captains || 0}
                  </h4>
                </div>
              </div>

              <div className="bg-white border border-zinc-200/85 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                <Users className="w-5 h-5 text-brand-red mb-2" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Members</p>
                  <h4 className="text-headline-md font-extrabold text-zinc-955 mt-1">
                    {stats?.counts?.registered || selectedConclave?.participants?.length || 0}
                  </h4>
                </div>
              </div>

              <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                <Shield className="w-5 h-5 text-brand-red mb-2" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Captains Active</p>
                  <h4 className="text-headline-md font-extrabold text-zinc-955 mt-1">
                    {stats?.counts?.captains || selectedConclave?.schedule?.rounds?.[0]?.tables?.filter(t => t.captainId).length || selectedConclave?.scheduleSummary?.tableCount || 0}
                  </h4>
                </div>
              </div>

              <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
                <Send className="w-5 h-5 text-brand-red mb-2" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Referrals</p>
                  <h4 className="text-headline-md font-extrabold text-zinc-950 mt-1">
                    {stats?.counts?.referrals || 0}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Big Seating Timer card — same height as KPI card */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm flex-1 flex flex-col">
            <h3 className="text-body-sm font-extrabold text-zinc-950 uppercase border-b border-zinc-100 pb-2.5 flex-shrink-0">
              Round Seating Timer
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50/40 rounded-xl border border-dashed border-zinc-200 mt-4">
              <div className="text-[45px] leading-none text-brand-red font-black tracking-tighter timer-glow select-none mb-4">
                {formatTime(timeLeft)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimeLeft(765)}
                  className="w-7 h-7 rounded-full border border-zinc-100 bg-white text-zinc-400 hover:bg-zinc-50 flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="w-8 h-8 rounded-full bg-brand-red text-white hover:bg-red-700 flex items-center justify-center cursor-pointer shadow-md"
                >
                  {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimeLeft(0);
                    showToast('Timer Stopped', 'Active round timer reset to zero.');
                  }}
                  className="w-7 h-7 rounded-full border border-zinc-100 bg-white text-zinc-400 hover:bg-zinc-50 flex items-center justify-center cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 bg-zinc-400 rounded-xs" />
                </button>
              </div>
              <p className="mt-5 text-[9px] text-zinc-450 font-bold uppercase tracking-wider">Round 2: Open Networking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Referrals, Analytics & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 3 Referrals section */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between h-[300px]">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2.5 flex-shrink-0">
            <h3 className="text-body-sm font-extrabold text-zinc-955 uppercase">Top 3 Referrals</h3>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[9px] font-extrabold tracking-wider">
              ACTIVE ROUND
            </span>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {leaderboard.length === 0 ? (
              <div className="text-center py-6 text-zinc-400 font-semibold text-[10px]">
                No referrals logged yet for this conclave.
              </div>
            ) : (
              leaderboard.map((person, idx) => {
                const colors = [
                  { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-300' }, // Gold
                  { bg: 'bg-zinc-400', text: 'text-zinc-500', border: 'border-zinc-300' },    // Silver
                  { bg: 'bg-amber-700/85', text: 'text-amber-700/85', border: 'border-amber-600/30' } // Bronze
                ];
                const c = colors[idx] || colors[2];
                return (
                  <div key={idx} className="bg-gradient-to-r from-zinc-50/10 to-white border border-zinc-150 rounded-lg p-2.5 flex items-center justify-between shadow-xs animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${c.bg} text-white rounded-full flex items-center justify-center font-black text-xs border ${c.border} shadow-sm`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-body-sm font-extrabold text-zinc-850">{person.name}</p>
                        <p className="text-[9px] text-zinc-455 font-bold uppercase tracking-wider">{person.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-body-sm font-extrabold ${c.text} leading-none`}>{person.count}</span>
                      <p className="text-[8px] text-zinc-400 font-bold uppercase mt-0.5">Referrals</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Referrals Analytics Pie Tracker — matching Dashboard layout */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between h-[300px]">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2.5 flex-shrink-0">
            <h3 className="text-body-sm font-extrabold text-zinc-950 uppercase">Referrals Tracker</h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-100 rounded text-[9px] font-extrabold tracking-wider">
              ANALYTICS
            </span>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 min-h-0">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <PieChart width={112} height={112}>
                <Pie
                  data={[
                    { value: connectedReferrals + closedReferrals, fill: '#cf2e2e' },
                    { value: Math.max(pendingReferrals, 1), fill: '#f4f4f5' }
                  ]}
                  dataKey="value"
                  innerRadius={38}
                  outerRadius={46}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl text-zinc-950 font-bold leading-none">{totalReferrals}</span>
                <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Total</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-1.5 overflow-y-auto">
              <div className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-zinc-200/60 shadow-xs">
                <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-brand-red rounded-full"></span> Connected
                </span>
                <span className="font-bold text-zinc-800 text-[11px]">{connectedReferrals}</span>
              </div>
              <div className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-zinc-200/60 shadow-xs">
                <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-amber-400 rounded-full"></span> Pending
                </span>
                <span className="font-bold text-zinc-800 text-[11px]">{pendingReferrals}</span>
              </div>
              <div className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-zinc-200/60 shadow-xs">
                <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full"></span> Closed
                </span>
                <span className="font-bold text-zinc-800 text-[11px]">{closedReferrals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live activity logs */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4 flex flex-col h-[300px]">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2.5 flex-shrink-0">
            <h3 className="text-body-sm font-extrabold text-zinc-950 uppercase">Live Activity</h3>
            <span className="px-2 py-0.5 bg-red-50 text-brand-red border border-red-100 rounded text-[9px] font-extrabold tracking-wider animate-pulse">
              REAL-TIME
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <div className="relative pl-3.5 space-y-4 border-l border-zinc-150 ml-1.5 mt-2">
              {feedLogs.map((log, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[18px] top-1.5 w-2 h-2 rounded-full border border-white ${idx === 0 ? 'bg-brand-red' : 'bg-zinc-400'}`} />
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-body-sm font-bold text-zinc-800 leading-none">{log.event}</p>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-1 leading-snug">{log.detail}</p>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 font-bold shrink-0">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Alert Feedback */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[70] bg-zinc-900 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-xl flex items-center gap-2 border border-zinc-800 animate-slide-up">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          <div>
            <p className="font-bold">{toast.title}</p>
            <p className="text-zinc-400 font-semibold mt-0.5">{toast.desc}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-white opacity-40 hover:opacity-100 ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
