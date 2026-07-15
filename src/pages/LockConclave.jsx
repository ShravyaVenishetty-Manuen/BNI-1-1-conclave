import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  Lock,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
  X,
  ShieldAlert,
  TrendingUp,
  Calendar,
  Users,
  MapPin,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import confetti from 'canvas-confetti';
import conclavesData from '../data/conclaves.json';

export default function LockConclave({ selectedConclaveId }) {
  const selectedConclave = useMemo(() =>
    conclavesData.find(c => c.id === selectedConclaveId),
    [selectedConclaveId]
  );
  const conclaveName = selectedConclave?.name || 'Conclave';

  // Per-conclave lock state
  const [lockedConclaves, setLockedConclaves] = useState({});
  const isLocked = !!lockedConclaves[selectedConclaveId];
  const setIsLocked = (val) => setLockedConclaves(prev => ({ ...prev, [selectedConclaveId]: val }));

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Per-conclave checkbox states
  const [checkedQuality, setCheckedQuality] = useState(false);
  const [checkedEdits, setCheckedEdits] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  // Recharts Gauge Data (100% readiness)
  const chartData = useMemo(() => {
    return [
      { name: 'readiness', value: 100 },
      { name: 'remaining', value: 0 }
    ];
  }, []);

  const handleConfirmLock = () => {
    setIsLocked(true);
    setIsModalOpen(false);
    showToast('Conclave Locked', `${conclaveName} has been locked. Roster published to the mobile app.`);

    // Confetti drop
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in relative pb-16">

      {/* Header & Lock Trigger */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Lock Conclave</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Finalise and lock <span className="font-bold text-brand-red">{conclaveName}</span>.
          </p>
        </div>

        <button
          onClick={() => {
            if (isLocked) {
              showToast('Already Locked', 'This conclave is already locked and synchronization is active.');
              return;
            }
            setIsModalOpen(true);
          }}
          disabled={isLocked}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-button font-bold transition-smooth shadow-md cursor-pointer uppercase tracking-wider text-[11px] ${isLocked ? 'bg-zinc-200 text-zinc-400 border border-zinc-300/40 cursor-not-allowed shadow-none' : 'bg-brand-red hover:bg-red-700 text-white'}`}
        >
          <Lock className="w-4 h-4" />
          {isLocked ? 'Conclave Locked' : 'Lock Conclave'}
        </button>
      </div>

      {/* Conclave Summary horizontally */}
      <div className="bg-white border border-zinc-200/80 p-3.5 px-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4">
        <div className="flex flex-wrap items-center gap-6 md:gap-8 flex-1">
          
          {/* Conclave Name */}
          <div className="flex items-center gap-2 border-r border-zinc-100 pr-6 last:border-0">
            <Layers className="w-4 h-4 text-brand-red shrink-0" />
            <span className="text-body-sm font-extrabold text-zinc-900">{selectedConclave?.name || 'Conclave'}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 border-r border-zinc-100 pr-6 last:border-0">
            <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-body-sm font-bold text-zinc-600">{selectedConclave?.dateRange || ''}</span>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2 border-r border-zinc-100 pr-6 last:border-0">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-body-sm font-bold text-zinc-650">{selectedConclave?.venue || ''}</span>
          </div>

          {/* Seating Counts */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-body-sm font-semibold text-zinc-600"><strong className="text-zinc-900 font-extrabold">{(selectedConclave?.memberCount || 0).toLocaleString()}</strong> members</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-300 font-normal">|</span>
              <span className="text-body-sm font-semibold text-zinc-600"><strong className="text-zinc-900 font-extrabold">{selectedConclave?.captainCount || 0}</strong> captains</span>
            </div>
          </div>

        </div>

        {/* Status and Version badges */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200 text-[9px] font-extrabold uppercase tracking-wider">
            {selectedConclave?.status || 'Running'}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold border uppercase tracking-wider shadow-xs ${isLocked ? 'bg-zinc-50 text-zinc-500 border-zinc-200' : 'bg-emerald-50 text-emerald-800 border-emerald-100'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-zinc-400' : 'bg-emerald-500 animate-pulse'}`} />
            {isLocked ? 'Locked' : 'Ready'}
          </span>
        </div>
      </div>

      {/* KPI Readiness Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Validation</p>
            <p className="text-headline-md font-extrabold text-emerald-700">100%</p>
            <p className="text-[9px] text-zinc-450 font-semibold mt-1">All Rules Passed</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Snapshot</p>
            <p className="text-headline-md font-extrabold text-zinc-900">Frozen</p>
            <p className="text-[9px] text-zinc-455 font-semibold mt-1">Last sync: 2h ago</p>
          </div>
          <span className="inline-block w-2.5 h-2.5 rounded bg-brand-red shrink-0" />
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Seating</p>
            <p className="text-headline-md font-extrabold text-zinc-900">Reviewed</p>
            <p className="text-[9px] text-zinc-455 font-semibold mt-1">By Admin Panel</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Manual Changes</p>
            <p className="text-headline-md font-extrabold text-zinc-950">4</p>
            <p className="text-[9px] text-zinc-455 font-semibold mt-1">Final Overrides</p>
          </div>
          <span className="inline-block w-2.5 h-2.5 rounded bg-brand-red shrink-0" />
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex items-center justify-between shadow-sm gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-zinc-450 font-bold uppercase mb-0.5">Overall Readiness</p>
            <p className="text-headline-md font-extrabold text-brand-red">{isLocked ? 'Locked' : 'Ready'}</p>
            <div className="w-20 h-1 mt-2.5 rounded-full bg-zinc-200/80 overflow-hidden">
              <div className="h-full bg-brand-red rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Custom SVG Circle progress indicator */}
          <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="#f4f4f5"
                strokeWidth="3"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="#cf2e2e"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={0}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[9px] font-black text-zinc-950">100%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column Checklist */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="text-body-sm font-extrabold uppercase tracking-widest text-zinc-950">Final Checklist</h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full font-bold">
                Pre-flight check complete
              </span>
            </div>

            <div className="p-5">
              <ul className="space-y-2.5 font-semibold text-zinc-700">
                <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-body-sm">Members Registered</span>
                  </div>
                  <span className="text-[10px] text-zinc-450 font-bold uppercase">{(selectedConclave?.memberCount || 0).toLocaleString()} Validated</span>
                </li>
                <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-body-sm">Captains Assigned</span>
                  </div>
                  <span className="text-[10px] text-zinc-450 font-bold uppercase">{selectedConclave?.captainCount || 0} Active</span>
                </li>
                <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-body-sm">Snapshot Taken</span>
                  </div>
                  <span className="text-[10px] text-zinc-450 font-bold uppercase">Ver: SNAP_922</span>
                </li>
                <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-body-sm">Validation Passed</span>
                  </div>
                  <span className="text-[10px] text-zinc-450 font-bold uppercase">No Conflicts</span>
                </li>
                <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-body-sm">Schedule Generated</span>
                  </div>
                  <span className="text-[10px] text-zinc-450 font-bold uppercase">3 Rounds</span>
                </li>
                <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-body-sm">Manual Overrides Saved</span>
                  </div>
                  <span className="text-[10px] text-zinc-450 font-bold uppercase">4 Records</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Impact details */}
            <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-[10px] font-bold text-brand-red uppercase tracking-widest flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Lock Impact Guidelines
              </h4>
              <div className="space-y-3.5 text-body-sm font-semibold text-zinc-650">
                <div className="flex gap-3">
                  <Lock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Members and Captain data become <span className="font-bold text-zinc-900">read-only</span> across the system admin controllers.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Layers className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Table Seating assignments are <span className="font-bold text-zinc-900">frozen</span> for instant mobile app rosters sync.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Sparkles className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-brand-red">
                    Enables the <span className="font-extrabold underline cursor-help">Round Runner</span> dashboard controller for live tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Final stats preview */}
            <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-[10px] font-bold text-zinc-950 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-brand-red" /> Final Seating Preview
              </h4>
              <div className="grid grid-cols-2 gap-y-4 text-body-sm font-semibold text-zinc-650">
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Tables</p>
                  <p className="text-body-sm font-bold text-zinc-900 mt-1">{Math.ceil((selectedConclave?.memberCount || 0) / 8)} Seated</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Schedule Quality</p>
                  <p className="text-body-sm font-bold text-emerald-700 mt-1">98% Match Rate</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Repeat Pairs</p>
                  <p className="text-body-sm font-bold text-zinc-900 mt-1">0 duplicates</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Validation Score</p>
                  <p className="text-body-sm font-bold text-zinc-900 mt-1">100 / 100</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Timeline */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-zinc-200/80 rounded-xl h-full flex flex-col shadow-sm">
            <div className="p-5 border-b border-zinc-100">
              <h3 className="text-body-sm font-extrabold text-zinc-950 uppercase">Activity Log Timeline</h3>
            </div>
            <div className="p-8 pl-12 space-y-8 relative flex-1">
              {/* timeline markers vertical line */}
              <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-zinc-150" />

              {(selectedConclave?.timeline || []).map((item, i) => (
                <div className="relative" key={i}>
                  <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-600 shadow-sm" />
                  <p className="text-[9px] text-zinc-400 font-bold uppercase">{item.date}</p>
                  <h4 className="text-body-sm font-bold text-zinc-800 mt-0.5">{item.event}</h4>
                  <p className="text-[10px] text-zinc-450 font-semibold">{item.desc}</p>
                </div>
              ))}

              <div className="relative">
                <div className={`absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${isLocked ? 'bg-zinc-400' : 'bg-brand-red animate-pulse'} shadow-sm`} />
                <p className={`text-[9px] font-bold uppercase ${isLocked ? 'text-zinc-400' : 'text-brand-red'}`}>
                  {isLocked ? 'COMPLETED' : 'NOW'}
                </p>
                <h4 className={`text-body-sm font-bold mt-0.5 ${isLocked ? 'text-zinc-650' : 'text-brand-red'}`}>
                  {isLocked ? 'Event Seating Locked' : 'Ready to Lock'}
                </h4>
                <p className="text-[10px] text-zinc-450 font-semibold">
                  {isLocked ? 'Roster is active and read-only.' : 'Pending administrative confirmation.'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRM LOCK MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">

            <div className="p-5 border-b border-zinc-100 bg-zinc-50 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-red" />
              <h3 className="font-extrabold text-zinc-950 text-body-sm">Confirm Administrative Lock</h3>
            </div>

            <div className="p-5 space-y-4 text-body-sm font-semibold text-zinc-650">
              <p className="leading-relaxed">
                You are about to lock the Seating assignments for the <strong className="text-zinc-950 font-extrabold">Annual Global Summit 2024</strong>.
                This action is irreversible and disables manual seating overrides.
              </p>

              <div className="bg-red-50/20 border-l-4 border-brand-red p-3 text-[10px] text-zinc-700 italic">
                "The schedule will be pushed to the mobile app and all captains will receive their final rosters."
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checkedQuality}
                    onChange={(e) => setCheckedQuality(e.target.checked)}
                    className="w-4.5 h-4.5 text-brand-red border-zinc-200 rounded focus:ring-brand-red cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-500 font-bold">I have verified the schedule quality metrics (98%).</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checkedEdits}
                    onChange={(e) => setCheckedEdits(e.target.checked)}
                    className="w-4.5 h-4.5 text-brand-red border-zinc-200 rounded focus:ring-brand-red cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-500 font-bold">I understand this will disable manual table overrides.</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setCheckedQuality(false);
                  setCheckedEdits(false);
                }}
                className="px-4 py-2 border border-zinc-100 bg-white text-zinc-700 text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!(checkedQuality && checkedEdits)}
                onClick={handleConfirmLock}
                className="px-5 py-2 bg-brand-red hover:bg-red-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white text-button font-bold rounded-lg shadow-md transition-smooth cursor-pointer"
              >
                Confirm & Lock
              </button>
            </div>
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
