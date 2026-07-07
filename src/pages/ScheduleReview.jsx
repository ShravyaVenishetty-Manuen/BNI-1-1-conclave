import React, { useState, useMemo } from 'react';
import {
  RefreshCw,
  Download,
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
  History,
  Save,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const initialTables = [
  {
    id: 'Table 01',
    status: 'warning',
    warningText: 'Warning: Business Conflict',
    capacity: '7/8',
    captain: {
      name: 'Amit Patel',
      role: 'Table Captain',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0YVKPZAJ4MiWcqOMOYXB3kIVtFsf3WAoWtVnYwxUag3sPtNII98m5E8UR3uD4gLgvi4atHrrfpMjn30Z1Sn_xDVTn-Yo1zsx_2PfKYlDdIO5sXPamYI0ErRItsKNB5t7H0u1MmqNew88W3lelThN4VxqjU-5fZiIhB15sU6bBjPZb57ui1U61c5PVk2Zg6hf-z42WKrkr9i1wr2ECSlAXDfo33EBlcS-qCZl2DPNa9WP2uBmwTIuVdtLORKWBD8n-BMNZjV0NqIU'
    },
    members: [
      { id: 'm-1', initials: 'JS', name: 'Jayesh Sharma', category: 'Legal', conflict: false },
      { id: 'm-2', initials: 'AL', name: 'Ananya Lal', category: 'Legal', conflict: true },
      { id: 'm-3', initials: 'MK', name: 'Mahendra Kumar', category: 'Banking', conflict: false }
    ]
  },
  {
    id: 'Table 02',
    status: 'validated',
    capacity: '8/8',
    captain: {
      name: 'Shreya Acharya',
      role: 'Table Captain',
      initials: 'SA'
    },
    members: [
      { id: 'm-4', name: 'Rohan Fadia', category: 'Real Estate' },
      { id: 'm-5', name: 'Esha Haria', category: 'Insurance' },
      { id: 'm-6', name: 'Vikram Wadhwa', category: 'Marketing' }
    ]
  },
  {
    id: 'Table 03',
    status: 'locked',
    capacity: '8/8'
  },
  {
    id: 'Table 04',
    status: 'review',
    capacity: '8/8'
  },
  {
    id: 'Table 05',
    status: 'validated',
    capacity: '8/8'
  }
];

export default function ScheduleReview({ setActiveTab, searchQuery: globalSearchQuery }) {
  const [tables, setTables] = useState(initialTables);
  const [activeRound, setActiveRound] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const searchVal = globalSearchQuery !== undefined ? globalSearchQuery : localSearchQuery;
  const [statusFilter, setStatusFilter] = useState('All');

  // KPI state
  const [issuesCount, setIssuesCount] = useState(2);
  const [warningsCount, setWarningsCount] = useState(2);
  const [overallScore, setOverallScore] = useState(96);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

  // Validation affected list
  const [affectedList, setAffectedList] = useState([
    { id: 'aff-1', title: 'Table 01: Duplicate Profession', desc: 'Two Legal members placed at the same table. This violates Rule #4.' },
    { id: 'aff-2', title: 'Table 112: Capacity Underfill', desc: 'Table has only 4 members assigned. Recommended min: 6.' }
  ]);



  const [toast, setToast] = useState(null);
  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  // Revalidate click simulator
  const handleRevalidate = () => {
    showToast('Re-running Validation Engine', 'Evaluating Seating Selections against constraint matrices...');
  };

  // Lock Conclave click redirector
  const handleLockConclave = () => {
    if (setActiveTab) {
      setActiveTab('lock-conclave');
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
    showToast('Conflict Resolved', 'Swapped Ananya Lal for Esha Wadhwa. Table 01 is now validated.');
  };

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
    <div className="p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in relative pb-28">

      {/* Breadcrumbs & Header */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Schedule Review</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Review seating assignments and resolve warnings before locking conclave.
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
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5">
        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Rounds</p>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">3</h4>
        </div>
        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Tables</p>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">155</h4>
        </div>
        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Members</p>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">1,240</h4>
        </div>
        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Captains</p>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">48</h4>
        </div>
        <div className="bg-white border border-zinc-200/80 p-4 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Repeat Pairings</p>
          <h4 className="text-headline-md font-extrabold text-zinc-900 mt-1">0</h4>
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
          {[1, 2, 3].map(round => (
            <button
              key={round}
              onClick={() => setActiveRound(round)}
              className={`flex-1 md:flex-initial px-6 py-1.5 rounded-md font-bold text-label-md transition-smooth cursor-pointer ${round === activeRound ? 'bg-white text-brand-red shadow-sm' : 'text-zinc-550 hover:bg-zinc-50'}`}
            >
              Round {round}
            </button>
          ))}
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
              <option value="All">All Statuses</option>
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

      {/* Seating Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column Seating cards */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredTables.map((table) => (
            <div
              key={table.id}
              className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col"
            >
              {/* Header card info */}
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-zinc-900 text-body-sm">{table.id}</span>
                  {table.status === 'warning' && (
                    <div className="flex items-center gap-1 mt-1 text-brand-red">
                      <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                      <span className="text-[9px] uppercase font-bold tracking-wider">{table.warningText}</span>
                    </div>
                  )}
                  {table.status === 'validated' && (
                    <div className="flex items-center gap-1 mt-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase font-bold tracking-wider">Validated</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-headline-md font-extrabold text-zinc-950 leading-none">{table.capacity}</span>
                  <p className="text-[9px] text-zinc-400 uppercase font-bold mt-0.5">Capacity</p>
                </div>
              </div>

              {/* Card body Seating */}
              {table.status === 'locked' ? (
                <div className="p-12 flex flex-col items-center justify-center text-zinc-400 italic">
                  <LockKeyhole className="w-8 h-8 mb-2 text-zinc-300" />
                  <p className="text-body-sm font-semibold">Standard Seating Active</p>
                </div>
              ) : table.status === 'review' ? (
                <div className="p-4 h-36 flex items-center justify-center border-t border-dashed border-zinc-100 m-2">
                  <p className="text-zinc-400 font-semibold text-body-sm">Ready for Review</p>
                </div>
              ) : (
                <div className="p-4 flex-1 space-y-3.5">
                  {/* Table Captain block */}
                  {table.captain && (
                    <div className="flex items-center gap-3 p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                      {table.captain.image ? (
                        <img className="w-8 h-8 rounded-lg shadow-xs object-cover" src={table.captain.image} alt={table.captain.name} />
                      ) : (
                        <div className="w-8 h-8 rounded bg-brand-red text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {table.captain.initials}
                        </div>
                      )}
                      <div className="leading-tight">
                        <p className="text-body-sm font-bold text-zinc-800">{table.captain.name}</p>
                        <p className="text-[9px] text-brand-red font-bold uppercase tracking-wider">{table.captain.role}</p>
                      </div>
                    </div>
                  )}

                  {/* Members seated */}
                  <div className="space-y-1.5">
                    {table.members && table.members.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between p-2 rounded-lg border transition-smooth group/member ${member.conflict ? 'border-red-100 bg-red-50/10' : 'border-transparent hover:border-zinc-200/60 hover:bg-zinc-50/50'}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-extrabold shadow-sm ${member.conflict ? 'bg-red-100 text-brand-red' : 'bg-zinc-100 text-zinc-600'}`}>
                            {member.initials || member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <span className="font-bold text-zinc-700 text-body-sm select-text">{member.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${member.conflict ? 'bg-brand-red text-white' : 'bg-zinc-100 text-zinc-500 border border-zinc-200/50'}`}>
                            {member.category}
                          </span>
                        </div>

                        <div className="flex gap-1.5 opacity-0 group-hover/member:opacity-100 transition-opacity">
                          <button
                            onClick={() => showToast('Swap Option', `Select destination table to swap ${member.name}.`)}
                            className="p-1 text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer"
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
            onClick={() => showToast('Table Created', 'Table 06 allocated under standard parameters.')}
            className="border-2 border-zinc-200 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-zinc-400 cursor-pointer hover:bg-zinc-50 transition-smooth group"
          >
            <PlusCircle className="w-10 h-10 mb-2 text-zinc-300 group-hover:text-brand-red transition-colors" />
            <p className="font-bold uppercase tracking-wider text-[10px] text-zinc-500">Create New Seating Table</p>
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
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold select-text">
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
            <h3 className="text-body-sm font-extrabold text-zinc-950 uppercase border-b border-zinc-100 pb-2.5">Quality Metrics</h3>

            <div className="space-y-4 font-semibold text-zinc-650">
              <div>
                <div className="flex justify-between items-center mb-1.5 text-[10px]">
                  <span>Unique Meetings</span>
                  <span className="font-bold text-brand-red">98%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ name: 'Unique Meetings', value: 98 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                  <span>Repeat Pairings</span>
                  <span className="font-bold text-zinc-900">0%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ name: 'Repeat Pairings', value: 0 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip formatter={(value) => `${value}%`} cursor={false} />
                      <Bar dataKey="value" fill="#af101a" radius={[4, 4, 4, 4]} background={{ fill: '#f4f4f5' }} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-3.5 border-t border-zinc-100">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase">Overall Score</p>
                    <p className="text-headline-md font-black text-zinc-950 leading-none mt-1">
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

      {/* Sticky footer action overlay */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-64 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 z-40 flex justify-between items-center shadow-2xl animate-slide-up">
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
              className="px-4 py-1.5 text-zinc-350 hover:text-white font-bold text-button text-[10px] cursor-pointer"
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

    </div>
  );
}
