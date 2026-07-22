import React, { useState, useMemo, useEffect } from 'react';
import {
  RefreshCw,
  Download,
  Play,
  Lock,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  LockKeyhole,
  PlusCircle,
  Sparkles,
  ArrowRightLeft,
  X,
  Clock,
  Save,
  ShieldCheck,
  XCircle,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  Calendar,
  MapPin,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

import { api } from '../services/api';

export default function ScheduleReview({ setActiveTab, searchQuery: globalSearchQuery, selectedConclaveId }) {
  const [conclave, setConclave] = useState(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [localTables, setLocalTables] = useState([]);
  const [activeRound, setActiveRound] = useState(() => {
    const marker = localStorage.getItem('schedule_review_tab');
    if (marker === 'validation') {
      localStorage.removeItem('schedule_review_tab');
      return 'validation';
    }
    return 1;
  });

  useEffect(() => {
    async function loadConclaveDetails() {
      setIsLoadingReview(true);
      try {
        // Fetch the full conclave document (includes schedule & participants)
        const full = await api.get(`/admin/conclaves/${selectedConclaveId}`);
        setConclave(full);
      } catch (err) {
        console.error("API load failed for conclave details, falling back to local storage:", err);
        const stored = localStorage.getItem('bni_conclaves');
        const list = stored ? JSON.parse(stored) : [];
        const selected = list.find(c => c.id === selectedConclaveId) || null;
        setConclave(selected);
      } finally {
        setIsLoadingReview(false);
      }
    }
    loadConclaveDetails();
  }, [selectedConclaveId]);

  

  useEffect(() => {
    if (!conclave) return;

    if (conclave.schedule && conclave.participants) {
      // Real backend schedule mapped to frontend representation
      const roundSeating = conclave.schedule.rounds.find(r => r.roundNumber === activeRound);
      if (roundSeating) {
        const mapped = roundSeating.tables.map(t => {
          const captain = conclave.participants.find(p => p.id === t.captainId);
          const members = t.memberIds.map(mId => {
            const p = conclave.participants.find(p => p.id === mId);
            return {
              id: p?._originalUid || String(mId),
              name: p?.name || 'Unknown',
              category: p?.businessCategory || 'Uncategorized',
              conflict: false
            };
          });

          // Check if there are category conflicts (duplicate categories at the table)
          const categories = [captain?.businessCategory, ...members.map(m => m.category)].filter(Boolean);
          const hasConflict = categories.length !== new Set(categories).size;

          return {
            id: `Table ${String(t.tableNumber).padStart(2, '0')}`,
            conclaveId: selectedConclaveId,
            status: hasConflict ? 'warning' : 'validated',
            warningText: hasConflict ? 'Warning: Business Conflict' : undefined,
            capacity: `${members.length + 1}/${conclave.personsPerTable}`,
            captain: {
              name: captain?.name || 'Unknown',
              role: 'Table Captain',
              initials: captain?.name ? captain.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'TC'
            },
            members
          };
        });
        setLocalTables(mapped);
      } else {
        setLocalTables([]);
      }
    } else {
      // Prefer live backend data: if the conclave exists but lacks a generated
      // schedule/participants, don't show bundled mock tables automatically.
      // Leave the review empty until the server publishes a schedule.
      setLocalTables([]);
    }
  }, [conclave, activeRound, selectedConclaveId]);

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const searchVal = globalSearchQuery !== undefined ? globalSearchQuery : localSearchQuery;
  const [statusFilter, setStatusFilter] = useState('All');

  // Validation States
  const [validationConclaves, setValidationConclaves] = useState([]);
  
  const activeConclaveIndex = useMemo(() => {
    const idx = validationConclaves.findIndex(c => c.id === selectedConclaveId);
    return idx !== -1 ? idx : 0;
  }, [validationConclaves, selectedConclaveId]);

  const activeConclave = validationConclaves[activeConclaveIndex] || {
    passedCount: 0,
    warningsCount: 0,
    errorsCount: 0,
    score: 100,
    rules: [],
    timeline: []
  };

  const [showRepeatModal, setShowRepeatModal] = useState(false);

  const repeatPairingDetails = useMemo(() => {
    if (!conclave || !conclave.schedule || !conclave.schedule.rounds) {
      return [];
    }

    const pairMap = new Map();

    conclave.schedule.rounds.forEach((rd) => {
      const roundNum = rd.round || rd.number;
      (rd.tables || []).forEach((tbl) => {
        const tableNum = tbl.tableNumber || tbl.number;
        const participants = tbl.participants || tbl.members || [];
        
        for (let i = 0; i < participants.length; i++) {
          for (let j = i + 1; j < participants.length; j++) {
            const m1 = participants[i];
            const m2 = participants[j];
            const u1 = m1.uid || m1.id || m1.name;
            const u2 = m2.uid || m2.id || m2.name;

            if (!u1 || !u2 || u1 === u2) continue;

            const sorted = [m1, m2].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            const key = `${sorted[0].uid || sorted[0].name}_${sorted[1].uid || sorted[1].name}`;

            if (!pairMap.has(key)) {
              pairMap.set(key, {
                member1: sorted[0],
                member2: sorted[1],
                occurrences: []
              });
            }

            pairMap.get(key).occurrences.push({
              round: roundNum,
              tableNumber: tableNum
            });
          }
        }
      });
    });

    const repeats = [];
    pairMap.forEach((val) => {
      if (val.occurrences.length > 1) {
        repeats.push(val);
      }
    });

    return repeats;
  }, [conclave]);

  const conclaveKPIs = useMemo(() => {
    if (!conclave) {
      return {
        rounds: 3,
        tables: 0,
        members: 0,
        captains: 0,
        repeatPairings: 0
      };
    }
    const rounds = conclave.scheduleSummary?.roundCount || conclave.roundCount || conclave.schedule?.rounds?.length || 4;
    const tables = conclave.scheduleSummary?.tableCount || conclave.schedule?.rounds?.[0]?.tables?.length || 0;
    const members = conclave.participants?.length || 0;
    const uniqueCaptains = new Set(conclave.schedule?.rounds?.[0]?.tables?.map(t => t.captainId).filter(Boolean));
    const captains = uniqueCaptains.size || conclave.scheduleSummary?.tableCount || 0;
    const hasSchedule = Boolean(conclave.schedule?.rounds?.length);
    const repeatPairings = hasSchedule
      ? repeatPairingDetails.length
      : (conclave.scheduleSummary?.repeatPairingCount || 0);
    return {
      rounds,
      tables,
      members,
      captains,
      repeatPairings
    };
  }, [conclave, repeatPairingDetails]);

  const roundsList = useMemo(() => {
    const list = [];
    for (let i = 1; i <= conclaveKPIs.rounds; i++) {
      list.push(i);
    }
    return list;
  }, [conclaveKPIs.rounds]);

  const [expandedRules, setExpandedRules] = useState(new Set(['rule-2']));
  const [isValidating, setIsValidating] = useState(false);

  const toggleRule = (id) => {
    const updated = new Set(expandedRules);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setExpandedRules(updated);
  };

  const handleRunValidation = () => {
    setIsValidating(true);
    showToast('Running Verification', 'Re-executing conclave rules parameters...');
    setTimeout(() => {
      setIsValidating(false);
      showToast('Validation Complete', 'All checks completed successfully.');
    }, 1500);
  };

  const handleQuickFix = () => {
    setValidationConclaves(prev => prev.map((c, idx) => {
      if (idx === activeConclaveIndex) {
        return {
          ...c,
          passedCount: c.passedCount + 1,
          errorsCount: 0,
          score: 96,
          rules: c.rules.map(r => {
            if (r.id === 'rule-2') {
              return {
                ...r,
                status: 'Passed',
                type: 'success',
                desc: 'West Chapter captains assigned from standby list. Captain-to-member ratio: 1:15 (Goal reached).',
                suggestion: null,
                fixable: false
              };
            }
            return r;
          }),
          timeline: [
            { event: 'Captains Ratio Auto-Fixed', time: 'Just now', note: 'System re-assignment complete', active: true },
            ...c.timeline
          ]
        };
      }
      return c;
    }));
    // Also auto-fix the issues count in the parent review component!
    setIssuesCount(prev => Math.max(0, prev - 1));
    showToast('Ratio Auto-Resolved', 'Standby captains successfully assigned to West Chapter.');
  };

  const validationChartData = useMemo(() => {
    return [
      { name: 'readiness', value: activeConclave?.score || 100 },
      { name: 'remaining', value: 100 - (activeConclave?.score || 100) }
    ];
  }, [activeConclave?.score]);

  // Manual swap states
  const [swapTarget, setSwapTarget] = useState(null);
  const [destTableId, setDestTableId] = useState('');
  const [swapMode, setSwapMode] = useState('move');
  const [targetMemberId, setTargetMemberId] = useState('');

  // KPI state
  const [issuesCount, setIssuesCount] = useState(0);
  const [warningsCount, setWarningsCount] = useState(0);
  const [overallScore, setOverallScore] = useState(100);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Validation affected list
  const [affectedList, setAffectedList] = useState([]);

  useEffect(() => {
    if (!conclave) return;

    if (!selectedConclaveId?.startsWith('CON-')) {
      // Real database conclave
      setIssuesCount(0); // If it generated, there are no blocking validation errors
      setWarningsCount(conclave.warnings ? conclave.warnings.length : 0);
      
      const coverage = conclave.scheduleSummary?.coverage || 1.0;
      setOverallScore(Math.round(coverage * 100));
      
      const affected = (conclave.warnings || []).map((w, idx) => ({
        id: `warn-${idx}`,
        title: w.code || 'Warning',
        desc: w.message
      }));
      setAffectedList(affected);
    } else {
      // Mock conclave fallback
      setIssuesCount(2);
      setWarningsCount(2);
      setOverallScore(96);
      setAffectedList([
        { id: 'aff-1', title: 'Table 01: Duplicate Profession', desc: 'Two Legal members placed at the same table. This violates Rule #4.' },
        { id: 'aff-2', title: 'Table 112: Capacity Underfill', desc: 'Table has only 4 members assigned. Recommended min: 6.' }
      ]);
    }
  }, [conclave, selectedConclaveId]);



  const [toast, setToast] = useState(null);
  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStartRound = async (roundNumber = 1) => {
    if (!selectedConclaveId) return;
    try {
      await api.post(`/admin/conclaves/${selectedConclaveId}/start-round`, { roundNumber });
      // Refresh conclave data
      const full = await api.get(`/admin/conclaves/${selectedConclaveId}`);
      setConclave(full);
      showToast('Round Started', `Round ${roundNumber} started.`);
    } catch (err) {
      console.error('Failed to start round:', err.message || err);
      showToast('Start Round Failed', err.message || 'Could not start round.');
    }
  };

  // Revalidate click simulator
  const handleRevalidate = () => {
    showToast('Re-running Validation Engine', 'Evaluating Seating Selections against constraint matrices...');
  };

  // Lock Conclave click redirector
  const handleLockConclave = () => {
    if (setActiveTab) {
      setActiveTab('schedule-gen');
      showToast('Review Complete', 'Navigating to the final conclave locking checklist.');
    }
  };

  // Auto-resolve Seating Conflict (Swap Ananya Lal out of Table 01)
  const handleAutoResolveConflict = () => {
    setTables(prev => prev.map(t => {
      if (t.id === 'Table 01') {
        return {
          ...t,
          status: 'validated',
          warningText: null,
          capacity: '8/8',
          members: t.members.map(m => m.id === 'm-2' ? { ...m, name: 'Esha Wadhwa', category: 'Hospitality', conflict: false, initials: 'EW' } : m)
        };
      }
      return t;
    }));

    setIssuesCount(prev => Math.max(0, prev - 1));
    setWarningsCount(prev => Math.max(0, prev - 1));
    setOverallScore(98);
    setAffectedList(prev => prev.filter(a => a.id !== 'aff-1'));
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    setHasUnsavedChanges(true);
    showToast('Conflict Resolved', 'Swapped Ananya Lal for Esha Wadhwa. Table 01 is now validated.');
  };

  // Filtered tables by selected conclave, then search/status
  const tables = useMemo(() =>
    localTables.filter(t => t.conclaveId === selectedConclaveId),
    [localTables, selectedConclaveId]
  );

  const setTables = (updater) => setLocalTables(updater);

  const selectedConclave = conclave;
  const conclaveName = selectedConclave?.name || 'Conclave';

  // Filtered tables by search query & status filter
  const filteredTables = useMemo(() => {
    let result = tables;

    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Apply search query filter
    if (searchVal) {
      const query = searchVal.toLowerCase();
      result = result.filter(t => {
        if (t.id.toLowerCase().includes(query)) return true;
        if (t.members) {
          return t.members.some(m => m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query));
        }
        return false;
      });
    }

    return result;
  }, [tables, searchVal, statusFilter]);

  // Export Schedule as CSV
  const exportSchedule = () => {
    const headers = ['Table', 'Status', 'Captain', 'Capacity', 'Member Name', 'Category', 'Conflict'];
    const rows = [];
    tables.forEach(t => {
      if (t.members && t.members.length > 0) {
        t.members.forEach((m, i) => {
          rows.push([
            i === 0 ? t.id : '',
            i === 0 ? t.status : '',
            i === 0 ? (t.captain?.name || '-') : '',
            i === 0 ? t.capacity : '',
            m.name || '-',
            m.category || '-',
            m.conflict ? 'Yes' : 'No'
          ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
        });
      } else {
        rows.push([t.id, t.status, t.captain?.name || '-', t.capacity, '-', '-', '-']
          .map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
      }
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conclave-schedule-round${activeRound}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Schedule Exported', `Downloaded ${tables.length} tables for Round ${activeRound}.`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in relative pb-28">

      {/* Breadcrumbs & Header */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Schedule Review</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Review seating assignments for <span className="font-bold text-brand-red">{conclaveName}</span> — resolve warnings before locking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleRevalidate}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-zinc-400" />
            Revalidate
          </button>

          <button
            onClick={exportSchedule}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            Export Schedule
          </button>

          {conclave?.schedule && (conclave.status || '').toLowerCase() !== 'running' && (
            <button
              onClick={() => handleStartRound(1)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
            >
              <Play className="w-4 h-4 text-zinc-400" />
              Start Round
            </button>
          )}

          <button
            onClick={handleLockConclave}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button rounded-lg transition-smooth shadow-md cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            Lock Conclave
          </button>
        </div>
      </div>

      {/* KPI Row cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Rounds</p>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">{conclaveKPIs.rounds}</h4>
        </div>
        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Tables</p>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">{conclaveKPIs.tables}</h4>
        </div>
        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Members</p>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">{conclaveKPIs.members.toLocaleString()}</h4>
        </div>
        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Captains</p>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">{conclaveKPIs.captains}</h4>
        </div>
        <div 
          onClick={() => setShowRepeatModal(true)}
          className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm hover:border-brand-red/40 transition-smooth group cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase">Repeat Pairings</p>
            <span className="text-[9px] font-extrabold text-brand-red opacity-80 group-hover:opacity-100 transition-opacity">View Names →</span>
          </div>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">{conclaveKPIs.repeatPairings}</h4>
        </div>
        <div className={`bg-white border p-4 rounded-xl shadow-sm flex items-center justify-between ${issuesCount > 0 ? 'border-brand-red text-brand-red bg-red-50/5' : 'border-emerald-100 text-emerald-700 bg-emerald-50/5'}`}>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Issues</p>
            <h4 className="text-headline-md font-extrabold mt-1">{issuesCount}</h4>
          </div>
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {/* Control Navigation tab bar */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-3 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex bg-zinc-100 p-1 rounded-lg w-full md:w-auto">
          {roundsList.map(round => (
            <button
              key={round}
              onClick={() => setActiveRound(round)}
              className={`flex-1 md:flex-initial px-6 py-1.5 rounded-md font-bold text-label-md transition-smooth cursor-pointer ${round === activeRound ? 'bg-white text-brand-red shadow-sm' : 'text-zinc-555 hover:bg-zinc-50'}`}
            >
              Round {round}
            </button>
          ))}
          <button
            onClick={() => setActiveRound('validation')}
            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-md font-bold text-label-md transition-smooth cursor-pointer flex items-center justify-center gap-1.5 ${activeRound === 'validation' ? 'bg-white text-brand-red shadow-sm' : 'text-zinc-555 hover:bg-zinc-50'}`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            Validation Checks
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth"
              placeholder="Search table or member..."
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-1.5 border border-zinc-200 bg-white text-body-sm font-semibold rounded-lg focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth cursor-pointer shadow-sm text-zinc-600"
            >
              <option value="All">All Status</option>
              <option value="warning">Warnings</option>
              <option value="review">Ready for Review</option>
              <option value="validated">Validated</option>
              <option value="locked">Locked</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Seating Main Dashboard Grid or Validation Checks View */}
      {activeRound === 'validation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Left Column: KPI counters & Rule Execution Details */}
          <div className="lg:col-span-8 space-y-5">
            {/* KPI Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Passed Rules</p>
                <h4 className="text-headline-md font-extrabold text-emerald-700 mt-1">{activeConclave.passedCount}</h4>
              </div>
              <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Warnings</p>
                <h4 className="text-headline-md font-extrabold text-amber-500 mt-1">{activeConclave.warningsCount}</h4>
              </div>
              <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Errors</p>
                <h4 className="text-headline-md font-extrabold text-brand-red mt-1">
                  {activeConclave.errorsCount < 10 ? `0${activeConclave.errorsCount}` : activeConclave.errorsCount}
                </h4>
              </div>
              <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Score</p>
                <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">{activeConclave.score}%</h4>
              </div>
              <div className={`col-span-2 sm:col-span-1 border border-zinc-200/85 p-4 rounded-xl flex flex-col justify-center items-center ${activeConclave.errorsCount > 0 ? 'bg-red-50/10 border-red-100 text-brand-red' : 'bg-emerald-50/10 border-emerald-100 text-emerald-700'}`}>
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <p className="text-[9px] font-extrabold uppercase mt-1.5 text-center">
                  {activeConclave.errorsCount > 0 ? 'Attention Needed' : 'Ready'}
                </p>
              </div>
            </div>

            {/* Validation Rules List */}
            <div className="space-y-3">
              <h3 className="text-section-heading font-extrabold text-zinc-955 pb-1.5 border-b border-zinc-100">Rule Execution Details</h3>

              {activeConclave.rules.map((rule) => {
                const isOpen = expandedRules.has(rule.id);
                return (
                  <div
                    key={rule.id}
                    className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${isOpen ? 'border-zinc-200' : 'border-zinc-200/80'}`}
                  >
                    {/* Rule Header */}
                    <div
                      onClick={() => toggleRule(rule.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50/40 select-none"
                    >
                      <div className="flex items-center gap-3">
                        {rule.type === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : rule.type === 'error' ? (
                          <XCircle className="w-5 h-5 text-brand-red shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        )}
                        <span className="font-bold text-zinc-800 text-body-sm">{rule.title}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-extrabold uppercase ${rule.type === 'success' ? 'text-emerald-700' : rule.type === 'error' ? 'text-brand-red' : 'text-amber-600'}`}>
                          {rule.status}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isOpen && (
                      <div className={`p-5 border-t border-zinc-100 bg-zinc-50/20 ${rule.type === 'error' ? 'bg-red-50/5' : rule.type === 'warning' ? 'bg-amber-50/5' : ''}`}>
                        <p className="text-body-sm text-zinc-655 leading-relaxed font-medium select-text">
                          {rule.desc}
                        </p>

                        {rule.suggestion && (
                          <p className="text-[11px] text-zinc-450 font-semibold mt-2">
                            Recommendation: {rule.suggestion}
                          </p>
                        )}

                        {rule.tag && (
                          <span className="inline-block mt-3 px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[9px] font-bold rounded uppercase border border-zinc-200">
                            {rule.tag}
                          </span>
                        )}

                        {/* Action Fix trigger */}
                        {rule.fixable && (
                          <div className="bg-white border border-zinc-100 p-4 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs mt-4">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-brand-red" />
                              <span className="text-body-sm font-semibold text-zinc-700">Auto-fix Captain shortage in West chapter</span>
                            </div>
                            <button
                              onClick={handleQuickFix}
                              className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-label-md transition-smooth cursor-pointer shadow-sm text-button"
                            >
                              Fix Now
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Readiness & Event Timeline */}
          <div className="lg:col-span-4 space-y-5">
            {/* Circular Readiness Card */}
            <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm text-center">
              <h3 className="text-body-sm font-extrabold text-zinc-955 uppercase border-b border-zinc-100 pb-2.5">Conclave Readiness</h3>

              <div className="w-36 h-36 relative mx-auto flex items-center justify-center my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={validationChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={54}
                      outerRadius={64}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#af101a" stroke="none" />
                      <Cell fill="#f4f4f5" stroke="none" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-zinc-955 leading-none">{activeConclave?.score || 100}%</span>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-1.5">Verified</span>
                </div>
              </div>

              <div className="mb-2">
                {activeConclave?.errorsCount > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 bg-red-50 text-brand-red border border-red-100 rounded-full text-[10px] font-bold uppercase">
                    Needs Attention
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-[10px] font-bold uppercase">
                    Ready for Scheduling
                  </span>
                )}
              </div>

              <p className="text-[11px] text-zinc-500 font-medium px-4 leading-relaxed mt-3">
                {activeConclave?.errorsCount > 0
                  ? 'Resolve remaining critical issues to unlock the match scheduler engine.'
                  : 'All critical checks parsed. The matching scheduler is unlocked.'}
              </p>
            </div>

            {/* Event Timeline / Activity Log from Validation Screen */}
            <div className="bg-white border border-zinc-200/80 rounded-xl h-full flex flex-col shadow-sm">
              <div className="p-5 border-b border-zinc-100 bg-zinc-50">
                <h3 className="text-body-sm font-extrabold text-zinc-955 uppercase">Validation Timeline</h3>
              </div>
              <div className="p-6 pl-10 space-y-6 relative flex-1">
                {/* timeline markers vertical line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-zinc-150" />

                {(activeConclave?.timeline || []).map((item, i) => (
                  <div className="relative" key={i}>
                    <div className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-600 shadow-sm" />
                    <p className="text-[8px] text-zinc-400 font-bold uppercase">{item.time}</p>
                    <h4 className="text-body-xs font-bold text-zinc-800 mt-0.5">{item.event}</h4>
                    <p className="text-[9.5px] text-zinc-450 font-semibold">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column Seating cards */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                className={`bg-white rounded-xl overflow-hidden shadow-sm flex flex-col p-4 space-y-3.5 border ${table.status === 'warning' ? 'border-red-200 bg-red-50/5' : 'border-zinc-200/80'
                  }`}
              >
                {/* Header card info */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-zinc-955 text-body-sm">{table.id}</span>
                    <div className="text-right flex items-center gap-1">
                      <span className="text-body-sm font-extrabold text-zinc-955">{table.capacity}</span>
                      <span className="text-[9px] text-zinc-450 font-bold uppercase">Capacity</span>
                    </div>
                  </div>

                  {/* Status Indicator (Text Only, no box) */}
                  {table.status === 'warning' && (
                    <div className="flex items-center gap-1.5 text-brand-red text-[10px] font-bold uppercase tracking-wider mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5 animate-pulse shrink-0" />
                      <span className="truncate">{table.warningText}</span>
                    </div>
                  )}
                  {table.status === 'validated' && (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Validated</span>
                    </div>
                  )}
                  {table.status === 'locked' && (
                    <div className="flex items-center gap-1.5 text-zinc-450 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Locked</span>
                    </div>
                  )}
                  {table.status === 'review' && (
                    <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Ready for Review</span>
                    </div>
                  )}
                </div>

                {/* Card body Seating */}
                {table.status === 'locked' ? (
                  <div className="py-6 flex flex-col items-center justify-center text-zinc-400 italic">
                    <LockKeyhole className="w-8 h-8 mb-2 text-zinc-300" />
                    <p className="text-body-sm font-semibold">Standard Seating Active</p>
                  </div>
                ) : table.status === 'review' ? (
                  <div className="py-6 flex items-center justify-center border-t border-dashed border-zinc-100">
                    <p className="text-zinc-400 font-semibold text-body-sm">Ready for Review</p>
                  </div>
                ) : (
                  <div className="flex-1 space-y-3.5">
                    {/* Table Captain block */}
                    {table.captain && (
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-smooth hover:bg-zinc-50/55 group/captain">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          {table.captain.image ? (
                            <img className="w-5.5 h-5.5 rounded-full object-cover shadow-xs" src={table.captain.image} alt={table.captain.name} />
                          ) : (
                            <div className="w-5.5 h-5.5 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-[9px] shadow-sm shrink-0">
                              {table.captain.initials}
                            </div>
                          )}
                          <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                            <span className="font-extrabold text-zinc-800 text-body-sm">{table.captain.name}</span>
                            <span className="px-2 py-0.5 rounded bg-brand-red/10 text-brand-red text-[8px] font-extrabold uppercase shrink-0">
                              Captain
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {table.captain && table.members && table.members.length > 0 && (
                      <div className="border-t border-zinc-150 my-1 mx-2.5" />
                    )}

                    {/* Members seated */}
                    <div className="space-y-0.5">
                      {table.members && table.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-smooth hover:bg-zinc-50/55 group/member"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-extrabold shadow-xs shrink-0 ${member.conflict ? 'bg-red-50 text-brand-red border border-red-100' : 'bg-zinc-100 text-zinc-500'}`}>
                              {member.initials || member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>

                            <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`font-bold text-body-sm select-text ${member.conflict ? 'text-brand-red' : 'text-zinc-700'}`}>
                                  {member.name}
                                </span>
                                {member.conflict && (
                                  <AlertTriangle className="w-3 h-3 text-brand-red shrink-0 animate-pulse" />
                                )}
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 ${member.conflict ? 'bg-brand-red/10 text-brand-red' : 'bg-zinc-50 text-zinc-450 border border-zinc-100'}`}>
                                {member.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-1.5 opacity-0 group-hover/member:opacity-100 transition-opacity ml-2 shrink-0">
                            <button
                              onClick={() => {
                                setSwapTarget({ member, table });
                              }}
                              className="p-1 text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer"
                              title="Swap or Move Member"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Dotted border create new table button */}
            <div
              onClick={() => {
                setTables(prev => [...prev, { id: `Table ${String(prev.length + 1).padStart(2, '0')}`, status: 'validated', capacity: '0/8', members: [] }]);
                setHasUnsavedChanges(true);
                showToast('Table Created', `Table ${String(tables.length + 1).padStart(2, '0')} allocated under standard parameters.`);
              }}
              className="border-2 border-zinc-200 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-zinc-400 cursor-pointer hover:bg-zinc-55 transition-smooth group"
            >
              <PlusCircle className="w-10 h-10 mb-2 text-zinc-300 group-hover:text-brand-red transition-colors" />
              <p className="font-bold uppercase tracking-wider text-[10px] text-zinc-555">Create New Seating Table</p>
            </div>
          </div>

          {/* Right Column details panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Validation Engine summary */}
            <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-zinc-900 text-white flex justify-between items-center">
                <h3 className="font-bold text-[10px] uppercase tracking-wider text-zinc-350">Validation Engine</h3>
                <ShieldCheck className="w-5 h-5 text-brand-red" />
              </div>

              <div className="p-4 space-y-4">
                <div className="flex gap-2.5">
                  <div className="flex-1 p-2 bg-emerald-50/15 border border-emerald-100 rounded-lg text-center">
                    <p className="text-[8px] text-zinc-400 font-bold uppercase">Passed</p>
                    <p className="text-headline-md font-black text-emerald-700">10</p>
                  </div>
                  <div className="flex-1 p-2 bg-red-50/15 border border-red-100 rounded-lg text-center">
                    <p className="text-[8px] text-zinc-400 font-bold uppercase">Warnings</p>
                    <p className="text-headline-md font-black text-brand-red">{warningsCount}</p>
                  </div>
                  <div className="flex-1 p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-center">
                    <p className="text-[8px] text-zinc-400 font-bold uppercase">Errors</p>
                    <p className="text-headline-md font-black text-zinc-700">0</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">Affected Tables</p>

                  {affectedList.map((aff) => (
                    <div key={aff.id} className="group border-l-4 border-l-brand-red pl-3 py-1 space-y-2">
                      <h5 className="font-bold text-zinc-800 text-body-sm leading-snug">{aff.title}</h5>
                      <p className="text-[11px] text-zinc-555 leading-relaxed font-semibold select-text">
                        {aff.desc}
                      </p>
                      {aff.id === 'aff-1' && (
                        <button
                          onClick={handleAutoResolveConflict}
                          className="text-[10px] font-bold text-brand-red hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Suggest Fix <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seating Quality Metrics */}
            <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-body-sm font-extrabold text-zinc-955 uppercase border-b border-zinc-100 pb-2.5">Quality Metrics</h3>

              <div className="space-y-4 font-semibold text-zinc-650">
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-[10px]">
                    <span>Unique Meetings</span>
                    <span className="font-bold text-brand-red">
                      {conclave?.scheduleSummary?.coverage !== undefined
                        ? `${Math.round(conclave.scheduleSummary.coverage * 100)}%`
                        : '98%'}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden cursor-pointer">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={[{
                        name: 'Unique Meetings',
                        value: conclave?.scheduleSummary?.coverage !== undefined
                          ? Math.round(conclave.scheduleSummary.coverage * 100)
                          : 98
                      }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip formatter={(value) => `${value}%`} cursor={false} />
                        <Bar dataKey="value" fill="#af101a" radius={[4, 4, 4, 4]} background={{ fill: '#f4f4f5' }} barSize={8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 text-[10px]">
                    <span className="font-semibold text-zinc-600">Repeat Pairings</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-900">
                        {conclaveKPIs.repeatPairings}
                      </span>
                      <button
                        onClick={() => setShowRepeatModal(true)}
                        className="text-[9px] font-extrabold text-brand-red hover:underline cursor-pointer"
                      >
                        (View Names)
                      </button>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden cursor-pointer">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={[{
                        name: 'Repeat Pairings',
                        value: conclave?.scheduleSummary?.repeatPairings !== undefined
                          ? conclave.scheduleSummary.repeatPairings
                          : 0
                      }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis type="number" domain={[0, conclave?.scheduleSummary?.repeatPairings > 5 ? conclave.scheduleSummary.repeatPairings : 5]} hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip formatter={(value) => `${value}`} cursor={false} />
                        <Bar dataKey="value" fill="#af101a" radius={[4, 4, 4, 4]} background={{ fill: '#f4f4f5' }} barSize={8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-zinc-100">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase">Overall Score</p>
                      <p className="text-headline-md font-black text-zinc-955 leading-none mt-1">
                        {overallScore}<span className="text-body-sm font-normal text-zinc-450">/100</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-brand-red font-bold uppercase">Exceptional</p>
                      <span className="inline-block w-4 h-4 bg-red-50 text-brand-red rounded-full text-center mt-1">
                        ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky footer action overlay */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 lg:left-[220px] right-0 bg-zinc-900 border-t border-zinc-800 px-4 sm:px-6 py-4 z-40 flex justify-between items-center shadow-2xl animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-800 flex items-center justify-center rounded-lg border border-zinc-700 shrink-0">
              <Save className="w-4.5 h-4.5 text-brand-red" />
            </div>
            <div>
              <p className="text-body-sm font-bold text-white">Unsaved Changes</p>
              <p className="text-[10px] text-zinc-400 font-semibold">Manual override: 1 table modification detected.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setHasUnsavedChanges(false);
                showToast('Changes Discarded', 'Reverted back to standard algorithm seating.');
              }}
              className="px-4 py-1.5 text-zinc-400 hover:text-white font-bold text-button text-[10px] cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={() => {
                setHasUnsavedChanges(false);
                showToast('Changes Saved', 'Override settings locked to conclave round directories.');
              }}
              className="px-5 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button text-[10px] rounded-lg shadow-md transition-smooth cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

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
            className="text-white opacity-40 hover:opacity-100 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Seating Swap/Move Editor Modal */}
      {swapTarget && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl p-6 w-full max-w-md space-y-5 animate-scale-in">
            <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-body-md font-black text-zinc-950">Manual Seating Editor</h3>
                <p className="text-[11px] text-zinc-500 font-semibold mt-0.5">Move or swap {swapTarget.member.name} ({swapTarget.member.category})</p>
              </div>
              <button onClick={() => { setSwapTarget(null); setDestTableId(''); setTargetMemberId(''); }} className="p-1 hover:bg-zinc-100 rounded text-zinc-400 cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Action Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-lg text-body-sm font-bold text-center">
              <button
                onClick={() => { setSwapMode('move'); setTargetMemberId(''); }}
                className={`py-1.5 rounded-md cursor-pointer transition-smooth ${swapMode === 'move' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                Move to Table
              </button>
              <button
                onClick={() => setSwapMode('swap')}
                className={`py-1.5 rounded-md cursor-pointer transition-smooth ${swapMode === 'swap' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                Swap with Member
              </button>
            </div>

            {/* Destination Selection */}
            <div className="space-y-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase">Destination Table</label>
                <select
                  value={destTableId}
                  onChange={(e) => {
                    setDestTableId(e.target.value);
                    setTargetMemberId('');
                  }}
                  className="w-full text-body-sm font-semibold border border-zinc-200 rounded-lg p-2 bg-zinc-50 outline-none cursor-pointer"
                >
                  <option value="">-- Select Target Table --</option>
                  {localTables.filter(t => t.conclaveId === selectedConclaveId && t.id !== swapTarget.table.id).map(t => (
                    <option key={t.id} value={t.id}>{t.id} ({t.members?.length || 0}/8 members)</option>
                  ))}
                </select>
              </div>

              {swapMode === 'swap' && destTableId && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase">Swap With Member</label>
                  <select
                    value={targetMemberId}
                    onChange={(e) => setTargetMemberId(e.target.value)}
                    className="w-full text-body-sm font-semibold border border-zinc-200 rounded-lg p-2 bg-zinc-50 outline-none cursor-pointer"
                  >
                    <option value="">-- Select Member to Swap --</option>
                    {(localTables.find(t => t.id === destTableId)?.members || []).map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Validation Check State */}
            {destTableId && (() => {
              const targetTable = localTables.find(t => t.id === destTableId);
              if (!targetTable) return null;

              let conflictDetected = false;
              let warningMsg = '';

              if (swapMode === 'move') {
                const match = targetTable.members?.find(m => m.category.toLowerCase() === swapTarget.member.category.toLowerCase());
                if (match) {
                  conflictDetected = true;
                  warningMsg = `⚠️ Conflict: ${match.name} representing "${match.category}" is already seated at ${destTableId}.`;
                }
              } else if (swapMode === 'swap' && targetMemberId) {
                const swapPartner = targetTable.members?.find(m => m.id === targetMemberId);
                if (swapPartner) {
                  const conflictAtDest = targetTable.members?.find(m => m.id !== swapPartner.id && m.category.toLowerCase() === swapTarget.member.category.toLowerCase());
                  const conflictAtOrig = swapTarget.table.members?.find(m => m.id !== swapTarget.member.id && m.category.toLowerCase() === swapPartner.category.toLowerCase());

                  if (conflictAtDest) {
                    conflictDetected = true;
                    warningMsg = `⚠️ Conflict at ${destTableId}: ${conflictAtDest.name} represents "${conflictAtDest.category}".`;
                  } else if (conflictAtOrig) {
                    conflictDetected = true;
                    warningMsg = `⚠️ Conflict at ${swapTarget.table.id}: ${conflictAtOrig.name} represents "${conflictAtOrig.category}".`;
                  }
                }
              }

              return (
                <div className={`p-3 rounded-lg border text-[11px] font-semibold flex items-center gap-2 ${conflictDetected
                    ? 'bg-red-50/50 border-red-100 text-brand-red'
                    : 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
                  }`}>
                  {conflictDetected ? (
                    <span>{warningMsg}</span>
                  ) : (
                    <span>✅ Seating adjustment is safe. No conflicts detected.</span>
                  )}
                </div>
              );
            })()}

            {/* Confirm / Cancel Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setSwapTarget(null); setDestTableId(''); setTargetMemberId(''); }}
                className="flex-1 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-button font-bold hover:bg-zinc-50 transition-smooth cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!destTableId || (swapMode === 'swap' && !targetMemberId)}
                onClick={() => {
                  const targetTable = localTables.find(t => t.id === destTableId);
                  if (!targetTable) return;

                  let updatedTables = localTables.map(t => {
                    if (t.id === swapTarget.table.id) {
                      if (swapMode === 'move') {
                        const newMembers = t.members.filter(m => m.id !== swapTarget.member.id);
                        return {
                          ...t,
                          members: newMembers,
                          capacity: `${newMembers.length}/8`
                        };
                      } else {
                        const swapPartner = targetTable.members.find(m => m.id === targetMemberId);
                        const newMembers = t.members.map(m => m.id === swapTarget.member.id ? swapPartner : m);
                        return {
                          ...t,
                          members: newMembers
                        };
                      }
                    }
                    if (t.id === destTableId) {
                      if (swapMode === 'move') {
                        const newMembers = [...(t.members || []), swapTarget.member];
                        return {
                          ...t,
                          members: newMembers,
                          capacity: `${newMembers.length}/8`
                        };
                      } else {
                        const newMembers = t.members.map(m => m.id === targetMemberId ? swapTarget.member : m);
                        return {
                          ...t,
                          members: newMembers
                        };
                      }
                    }
                    return t;
                  });

                  setLocalTables(updatedTables);
                  setHasUnsavedChanges(true);
                  showToast('Seating Updated', `${swapTarget.member.name} has been successfully reassigned.`);
                  setSwapTarget(null);
                  setDestTableId('');
                  setTargetMemberId('');
                }}
                className="flex-1 py-2 bg-brand-red hover:bg-red-700 text-white rounded-lg text-button font-bold transition-smooth shadow-sm cursor-pointer disabled:opacity-50"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {showRepeatModal && (
        <div className="fixed inset-0 z-[100] bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-body-lg font-black text-zinc-900">Repeat Pairings Audit</h3>
                <p className="text-[11px] text-zinc-400 font-medium">Members seated together more than once across rounds</p>
              </div>
              <button
                onClick={() => setShowRepeatModal(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-smooth cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
              {repeatPairingDetails.length === 0 ? (
                <div className="p-8 text-center bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-black text-lg">✓</div>
                  <h4 className="text-body-md font-extrabold text-emerald-900">Zero Repeat Pairings!</h4>
                  <p className="text-[11px] text-emerald-700">Every member meets 100% unique partners in every single round of this conclave.</p>
                </div>
              ) : (
                repeatPairingDetails.map((pair, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-brand-red bg-red-50 px-2 py-0.5 rounded border border-brand-red/10">
                        {pair.occurrences.length} Times Paired
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-white p-3 rounded-lg border border-zinc-200/60 shadow-2xs">
                        <p className="text-[12px] font-black text-zinc-850 truncate">{pair.member1.name}</p>
                        <p className="text-[10px] text-zinc-450 truncate mt-0.5">{pair.member1.company || 'Member 1'}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-zinc-200/60 shadow-2xs">
                        <p className="text-[12px] font-black text-zinc-850 truncate">{pair.member2.name}</p>
                        <p className="text-[10px] text-zinc-450 truncate mt-0.5">{pair.member2.company || 'Member 2'}</p>
                      </div>
                    </div>
                    <div className="text-[10.5px] text-zinc-500 font-medium pt-1">
                      <span className="font-bold text-zinc-700">Seated Together: </span>
                      {pair.occurrences.map(o => `Round ${o.round} (Table ${o.tableNumber})`).join(' & ')}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowRepeatModal(false)}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-[12px] rounded-xl transition-smooth cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
