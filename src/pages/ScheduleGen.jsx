import React, { useState, useEffect, useMemo } from 'react';
import {
  RefreshCw,
  Download,
  Play,
  Calendar,
  Settings as SettingsIcon,
  CheckCircle2,
  Clock,
  Check,
  X,
  PlayCircle,
  StopCircle,
  Flag,
  Lock,
  Layers,
  Sparkles,
  Info,
  ShieldAlert,
  TrendingUp,
  Users,
  MapPin,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import confetti from 'canvas-confetti';
import conclavesData from '../data/conclaves.json';

export default function ScheduleGen({ selectedConclaveId }) {
  // Read locked state from local storage conclaves
  const [conclaves, setConclaves] = useState(() => {
    const stored = localStorage.getItem('bni_conclaves');
    return stored ? JSON.parse(stored) : conclavesData;
  });

  // Sync state if localStorage changes
  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem('bni_conclaves');
      if (stored) {
        setConclaves(JSON.parse(stored));
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const selectedConclave = useMemo(() =>
    conclaves.find(c => c.id === selectedConclaveId),
    [conclaves, selectedConclaveId]
  );
  const conclaveName = selectedConclave?.name || 'Conclave';

  const isLocked = selectedConclave?.status === 'Locked';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedQuality, setCheckedQuality] = useState(false);
  const [checkedEdits, setCheckedEdits] = useState(false);

  // Per-conclave state stored in a Map keyed by conclaveId
  const [perConclaveState, setPerConclaveState] = useState({});

  const getState = () => perConclaveState[selectedConclaveId] || {
    progress: 85, isGenerating: false, elapsed: 42, processed: 1054,
    currentStep: 'Conflict Resolution', round3Status: 'IN PROGRESS (45%)', activeStepIndex: 4
  };

  const patchState = (patch) => setPerConclaveState(prev => ({
    ...prev,
    [selectedConclaveId]: { ...getState(), ...patch }
  }));

  const { progress, isGenerating, elapsed, processed, currentStep, round3Status, activeStepIndex } = getState();

  const setProgress = (val) => patchState({ progress: typeof val === 'function' ? val(getState().progress) : val });
  const setIsGenerating = (val) => patchState({ isGenerating: val });
  const setElapsed = (val) => patchState({ elapsed: typeof val === 'function' ? val(getState().elapsed) : val });
  const setProcessed = (val) => patchState({ processed: typeof val === 'function' ? val(getState().processed) : val });
  const setCurrentStep = (val) => patchState({ currentStep: val });
  const setRound3Status = (val) => patchState({ round3Status: val });
  const setActiveStepIndex = (val) => patchState({ activeStepIndex: val });

  const [toast, setToast] = useState(null);
  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  // Seating Parameter Config States
  const [personsPerTable, setPersonsPerTable] = useState(8);
  const [roundCount, setRoundCount] = useState(3);
  const [randomSeed, setRandomSeed] = useState(92843);
  const [manualOverride, setManualOverride] = useState(false);

  // Expandable algorithm weights
  const [showWeights, setShowWeights] = useState(false);
  const [overlapWeight, setOverlapWeight] = useState(80);
  const [chapterWeight, setChapterWeight] = useState(90);
  const [diversityWeight, setDiversityWeight] = useState(70);
  const [regionWeight, setRegionWeight] = useState(50);

  // Generation Simulator Loop
  useEffect(() => {
    let interval = null;
    if (isGenerating && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = Math.min(prev + 3, 100);
          if (next === 100) {
            setIsGenerating(false);
            setCurrentStep('Schedule Completion');
            setRound3Status('COMPLETED');
            setProcessed(1240);
            setActiveStepIndex(5); // Complete (Step 6)
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            showToast('Schedule Generated Successfully', '1,240 member paths matching constraint parameters.');
          }
          return next;
        });

        setElapsed(prev => prev + 1);
        setProcessed(prev => Math.min(prev + 37, 1240));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, progress]);

  const handleStartGeneration = () => {
    if (progress === 100) {
      // Reset state for a fresh run
      setProgress(85);
      setElapsed(42);
      setProcessed(1054);
      setCurrentStep('Conflict Resolution');
      setRound3Status('IN PROGRESS (45%)');
      setActiveStepIndex(4);
    }
    setIsGenerating(true);
    showToast('Starting Generation', 'Running allocation constraints algorithms...');
  };

  const handleAbort = () => {
    setIsGenerating(false);
    showToast('Generation Paused', 'Task execution stopped by administrator.');
  };

  const handleConfirmLock = () => {
    const updatedConclaves = conclaves.map(c => {
      if (c.id === selectedConclaveId) {
        return { ...c, status: 'Locked' };
      }
      return c;
    });
    setConclaves(updatedConclaves);
    localStorage.setItem('bni_conclaves', JSON.stringify(updatedConclaves));
    window.dispatchEvent(new Event('storage'));

    setIsModalOpen(false);
    showToast('Conclave Locked', `${conclaveName} has been locked. Roster published to the mobile app.`);

    // Confetti drop
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Recharts Progress Gauge Data
  const chartData = useMemo(() => {
    return [
      { name: 'progress', value: progress },
      { name: 'remaining', value: 100 - progress }
    ];
  }, [progress]);

  // Export schedule config as CSV
  const exportSchedule = () => {
    const headers = ['Parameter', 'Value'];
    const config = [
      ['Conclave', 'Annual Global Summit 2024'],
      ['Date', 'Nov 12-14, V Convention, Guntur'],
      ['Members', '1,240'],
      ['Captains', '48'],
      ['Rounds', roundCount],
      ['Tables', Math.ceil(1240 / personsPerTable)],
      ['Persons Per Table', personsPerTable],
      ['Random Seed', randomSeed],
      ['Manual Override', manualOverride ? 'Yes' : 'No'],
      ['Generation Progress', `${progress}%`],
      ['Members Processed', processed],
      ['Elapsed Time (s)', elapsed],
      ['Current Step', currentStep],
      ['Status', progress === 100 ? 'COMPLETED' : 'IN PROGRESS']
    ];
    const rows = config.map(([param, val]) =>
      [`"${param}"`, `"${String(val).replace(/"/g, '""')}"`].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `schedule-generation-config-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Export Downloaded', `Schedule configuration exported (${progress}% complete).`);
  };

  const uniqueMeetingsVal = Math.min(100, Math.round(90 + (overlapWeight * 0.1) - (progress === 100 ? 0 : 2.5)));
  const diversityVal = Math.min(100, Math.round(85 + (diversityWeight * 0.1) - (progress === 100 ? 0 : 3.5)));
  const repeatedPairingsVal = Math.max(0, Math.round(10 - (chapterWeight * 0.1)));

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">

      {/* Header Section */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Schedule Generation</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Generate seating assignments for <span className="font-bold text-brand-red">{conclaveName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => {
              setProgress(85);
              setElapsed(42);
              setProcessed(1054);
              setCurrentStep('Conflict Resolution');
              setRound3Status('IN PROGRESS (45%)');
              setActiveStepIndex(4);
              setIsGenerating(false);
              showToast('Simulation Reset', 'Schedule metrics reverted to initial state.');
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-zinc-400" />
            Regenerate
          </button>

          <button
            onClick={exportSchedule}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            Export
          </button>

          <button
            onClick={handleStartGeneration}
            disabled={isGenerating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button rounded-lg transition-smooth shadow-md cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Schedule'}
          </button>
        </div>
      </div>

      {/* KPI & Overview Card */}
      <div className="border border-zinc-200/60 bg-white rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <Calendar className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h3 className="text-body-sm font-bold text-zinc-950">{selectedConclave?.name || 'Conclave'}</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">{selectedConclave?.venueShort || ''} • {selectedConclave?.dateRange || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-8 px-2 sm:px-6">
            <div className="text-center">
              <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Validation Score</div>
              <div className="text-section-heading font-extrabold text-brand-red mt-0.5">{selectedConclave?.progress || 100}%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1 font-semibold text-zinc-650">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Members</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">{(selectedConclave?.memberCount || 0).toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Captains</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">{selectedConclave?.captainCount || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Business Types</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">{selectedConclave?.businessTypes || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Rounds</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">{roundCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Tables</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">{Math.ceil((selectedConclave?.memberCount || 0) / personsPerTable)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-100 w-fit mt-1 uppercase tracking-wider">
              {selectedConclave?.status || 'Running'}
            </span>
          </div>
        </div>
      </div>      {/* Generation Settings Toolbar */}
      <div className="bg-white border border-zinc-100 p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between shadow-sm gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-6 lg:gap-8 flex-1">
          <div className="flex items-center gap-2 border-r border-zinc-100 pr-4 shrink-0">
            <SettingsIcon className="w-4.5 h-4.5 text-brand-red" />
            <span className="font-extrabold text-zinc-950 text-body-sm">Generation Parameters</span>
          </div>

          {/* Capacity dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest whitespace-nowrap">Capacity</label>
            <select
              value={personsPerTable}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setPersonsPerTable(val);
                showToast('Parameters Modified', `Targeting table capacity of ${val} members.`);
              }}
              className="text-body-sm font-bold text-zinc-800 border border-zinc-200 rounded-lg py-1 px-2.5 outline-none cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-smooth"
            >
              <option value={6}>6 per table</option>
              <option value={8}>8 per table</option>
              <option value={10}>10 per table</option>
            </select>
          </div>

          {/* Round Count */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest whitespace-nowrap">Rounds</label>
            <input
              type="number"
              min={1}
              max={6}
              value={roundCount}
              onChange={(e) => {
                const val = Math.max(1, Math.min(6, parseInt(e.target.value) || 3));
                setRoundCount(val);
              }}
              className="w-16 text-body-sm font-bold text-zinc-800 border border-zinc-200 rounded-lg py-1 px-2.5 outline-none bg-zinc-50 focus:bg-white focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 transition-smooth"
            />
          </div>

          {/* Random Seed */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest whitespace-nowrap">Seed</label>
            <input
              type="number"
              value={randomSeed}
              onChange={(e) => setRandomSeed(parseInt(e.target.value) || 92843)}
              className="w-24 text-body-sm font-bold text-zinc-800 border border-zinc-200 rounded-lg py-1 px-2.5 outline-none bg-zinc-50 focus:bg-white focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 transition-smooth"
            />
          </div>

          {/* Manual Override */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest whitespace-nowrap">Manual Override</span>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={manualOverride}
                onChange={(e) => {
                  setManualOverride(e.target.checked);
                  showToast('Mode Changed', `Manual override status: ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-red"></div>
            </label>
          </div>

          <div className="w-px h-6 bg-zinc-150 hidden lg:block" />

          {/* Algorithm weights toggle */}
          <button
            onClick={() => setShowWeights(!showWeights)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-lg text-[10.5px] font-bold transition-smooth cursor-pointer ${
              showWeights 
                ? 'bg-red-50 text-brand-red border-brand-red/35 shadow-2xs' 
                : 'bg-zinc-55 border-zinc-200 text-zinc-650 hover:bg-zinc-100 shadow-2xs'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            {showWeights ? 'Hide Weights' : 'Tune Weights'}
          </button>
        </div>
      </div>

      {/* Expandable Algorithmic Weights Panel */}
      {showWeights && (
        <div className="bg-white border border-zinc-150 p-5 rounded-xl shadow-xs space-y-4 animate-fade-in mb-1">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h4 className="font-extrabold text-zinc-950 text-body-sm">Algorithmic Matchmaking Constraints Tuning</h4>
            <span className="text-[10px] text-zinc-400 font-semibold italic">Adjust priorities before triggering matching engine runs</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                <span>Avoid Past Overlaps</span>
                <span className="text-brand-red font-extrabold">{overlapWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={overlapWeight}
                onChange={(e) => setOverlapWeight(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-red"
              />
              <p className="text-[9.5px] text-zinc-450 font-medium leading-normal">Optimizes seating to prevent members from matching with prior round connections.</p>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                <span>Avoid Chapter Conflicts</span>
                <span className="text-brand-red font-extrabold">{chapterWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={chapterWeight}
                onChange={(e) => setChapterWeight(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-red"
              />
              <p className="text-[9.5px] text-zinc-450 font-medium leading-normal">Prevents seating members from the same local chapter at the same tables.</p>
            </div>

            {/* Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                <span>Business Niche Diversity</span>
                <span className="text-brand-red font-extrabold">{diversityWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={diversityWeight}
                onChange={(e) => setDiversityWeight(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-red"
              />
              <p className="text-[9.5px] text-zinc-450 font-medium leading-normal">Maximizes trade diversity by ensuring unique business niches represent each table.</p>
            </div>

            {/* Slider 4 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                <span>Region Connectivity</span>
                <span className="text-brand-red font-extrabold">{regionWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={regionWeight}
                onChange={(e) => setRegionWeight(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-red"
              />
              <p className="text-[9.5px] text-zinc-450 font-medium leading-normal">Favors seating members with participants from cross-regional BNI nodes.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left column: Quality & Timeline */}
        <div className="lg:col-span-4 space-y-6">

          {/* Quality Panel */}
          <div className="border border-zinc-100 bg-white rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-brand-red" />
              <h4 className="font-extrabold text-zinc-950 text-body-sm">Schedule Quality Score</h4>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1.5 font-bold text-[10px] text-zinc-500">
                  <span>Unique Meetings</span>
                  <span className="text-brand-red">{uniqueMeetingsVal}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ name: 'Unique Meetings', value: uniqueMeetingsVal }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip formatter={(value) => `${value}%`} cursor={false} />
                      <Bar dataKey="value" fill="#af101a" radius={[4, 4, 4, 4]} background={{ fill: '#f4f4f5' }} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-bold text-[10px] text-zinc-500">
                  <span>Repeated Pairings</span>
                  <span className="text-zinc-900 font-extrabold">{repeatedPairingsVal}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ name: 'Repeated Pairings', value: repeatedPairingsVal }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip formatter={(value) => `${value}%`} cursor={false} />
                      <Bar dataKey="value" fill="#af101a" radius={[4, 4, 4, 4]} background={{ fill: '#f4f4f5' }} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-bold text-[10px] text-zinc-500">
                  <span>Diversity Score</span>
                  <span className="text-brand-red">High ({diversityVal}%)</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ name: 'Diversity Score', value: diversityVal }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip formatter={(value) => `${value}%`} cursor={false} />
                      <Bar dataKey="value" fill="#af101a" radius={[4, 4, 4, 4]} background={{ fill: '#f4f4f5' }} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Real-time Status, Stepper & Preview */}
        <div className="lg:col-span-8 space-y-6">

          {/* Main Progress Indicator */}
          <div className="border border-zinc-100 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

              {/* Recharts progress ring */}
              <div className="w-40 h-40 relative flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={68}
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
                  <span className="text-3xl font-extrabold text-zinc-950 leading-none">{progress}%</span>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-1.5">Progress</span>
                </div>
              </div>

              {/* Status details grid */}
              <div className="flex-1 w-full space-y-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-body-sm font-semibold text-zinc-650">
                  <div>
                    <label className="text-[10px] text-zinc-450 font-bold uppercase block mb-1">Current Step</label>
                    <div className="flex items-center gap-2">
                      {progress < 100 ? (
                        <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span className="font-bold text-zinc-900">{currentStep}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-455 font-bold uppercase block mb-1">Elapsed Time</label>
                    <span className="font-bold text-zinc-900">00:{elapsed < 10 ? `0${elapsed}` : elapsed}s</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-455 font-bold uppercase block mb-1">Processed</label>
                    <span className="font-bold text-zinc-900">{processed.toLocaleString()} / {(selectedConclave?.memberCount || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-455 font-bold uppercase block mb-1">Est. Completion</label>
                    <span className="font-bold text-brand-red">{progress === 100 ? '0s' : `${Math.ceil((100 - progress) * 0.8)}s`}</span>
                  </div>
                </div>

                <div>
                  {isGenerating ? (
                    <button
                      onClick={handleAbort}
                      className="w-full flex items-center justify-center gap-2 border border-brand-red text-brand-red hover:bg-red-50/50 py-2 rounded-lg text-button font-bold transition-smooth cursor-pointer"
                    >
                      <StopCircle className="w-4 h-4" /> Abort Generation Task
                    </button>
                  ) : progress === 100 ? (
                    <button
                      onClick={() => {
                        if (isLocked) {
                          showToast('Already Locked', 'This conclave is already locked.');
                          return;
                        }
                        setIsModalOpen(true);
                      }}
                      disabled={isLocked}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-button font-bold transition-smooth shadow-md cursor-pointer uppercase tracking-wider text-[11px] ${
                        isLocked 
                          ? 'bg-zinc-250 text-zinc-450 border border-zinc-300/30 cursor-not-allowed shadow-none' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      {isLocked ? 'Conclave Locked' : 'Lock Conclave & Publish'}
                    </button>
                  ) : (
                    <button
                      onClick={handleStartGeneration}
                      className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white py-2 rounded-lg text-button font-bold transition-smooth shadow-sm cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" /> Start Schedule Generation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Round Preview */}
      <div className="space-y-4">
        <h4 className="text-section-heading font-extrabold text-zinc-950 px-1">Round Previews</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-zinc-100 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h5 className="font-bold text-zinc-800 text-body-sm">Round 1</h5>
                <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">{Math.ceil((selectedConclave?.memberCount || 0) / personsPerTable)} Tables • {(selectedConclave?.memberCount || 0).toLocaleString()} Members</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-455 font-bold border-t border-zinc-100 pt-3 mt-2.5">
              <span className="tracking-wider">COMPLETED</span>
            </div>
          </div>

          <div className="border border-zinc-100 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h5 className="font-bold text-zinc-800 text-body-sm">Round 2</h5>
                <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">{Math.ceil((selectedConclave?.memberCount || 0) / personsPerTable)} Tables • {(selectedConclave?.memberCount || 0).toLocaleString()} Members</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-455 font-bold border-t border-zinc-100 pt-3 mt-2.5">
              <span className="tracking-wider">COMPLETED</span>
            </div>
          </div>

          <div className={`border rounded-xl p-4 shadow-sm transition-all duration-300 ${progress === 100 ? 'border-zinc-100 bg-white' : 'border-brand-red/40 bg-red-50/5'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h5 className={`font-bold text-body-sm ${progress === 100 ? 'text-zinc-800' : 'text-brand-red'}`}>Round 3</h5>
                <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">
                  {progress === 100 ? `${Math.ceil((selectedConclave?.memberCount || 0) / personsPerTable)} Tables • ${(selectedConclave?.memberCount || 0).toLocaleString()} Members` : 'Allocating Members...'}
                </p>
              </div>
              {progress === 100 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse mt-1" />
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold border-t border-zinc-100 pt-3 mt-2.5">
              <span className={progress === 100 ? 'text-zinc-400' : 'text-brand-red'}>{round3Status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Conclave Administrative Section */}
      {progress === 100 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
          {/* Left Column: Checklist & Guidelines */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                <h3 className="text-body-sm font-extrabold uppercase tracking-widest text-zinc-955">Final Seating Checklist</h3>
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
                    <span className="text-[10px] text-zinc-455 font-bold uppercase">{(selectedConclave?.memberCount || 0).toLocaleString()} Validated</span>
                  </li>
                  <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-body-sm">Captains Assigned</span>
                    </div>
                    <span className="text-[10px] text-zinc-455 font-bold uppercase">{selectedConclave?.captainCount || 0} Active</span>
                  </li>
                  <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-body-sm">Snapshot Status</span>
                    </div>
                    <span className="text-[10px] text-zinc-455 font-bold uppercase">Ver: SNAP_922</span>
                  </li>
                  <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-body-sm">Validation Check</span>
                    </div>
                    <span className="text-[10px] text-zinc-455 font-bold uppercase">No Conflicts</span>
                  </li>
                  <li className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-smooth">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-body-sm">Schedule Engine Quality</span>
                    </div>
                    <span className="text-[10px] text-zinc-455 font-bold uppercase">3 Rounds Generated</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Impact guidelines */}
              <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="text-[10px] font-bold text-brand-red uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Lock Impact Guidelines
                </h4>
                <div className="space-y-3.5 text-body-sm font-semibold text-zinc-650">
                  <div className="flex gap-3">
                    <Lock className="w-4 h-4 text-zinc-455 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11.5px]">
                      Members and Captain data become <span className="font-bold text-zinc-900">read-only</span> across the system admin controllers.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Layers className="w-4 h-4 text-zinc-455 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11.5px]">
                      Table Seating assignments are <span className="font-bold text-zinc-900">frozen</span> for instant mobile app rosters sync.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Sparkles className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11.5px] text-brand-red">
                      Enables the <span className="font-extrabold underline cursor-help">Round Runner</span> dashboard controller for live tracking.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seating quality parameters preview */}
              <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-955 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-brand-red" /> Seating Analytics Preview
                </h4>
                <div className="grid grid-cols-2 gap-y-4 text-body-sm font-semibold text-zinc-655">
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Tables</p>
                    <p className="text-body-sm font-bold text-zinc-900 mt-1">{Math.ceil((selectedConclave?.memberCount || 0) / personsPerTable)} Seated</p>
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

          {/* Right Column: Timeline / Action log */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-zinc-200/80 rounded-xl h-full flex flex-col shadow-sm">
              <div className="p-5 border-b border-zinc-100">
                <h3 className="text-body-sm font-extrabold text-zinc-955 uppercase">Activity Log Timeline</h3>
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
      )}

      {/* CONFIRM LOCK MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">

            <div className="p-5 border-b border-zinc-100 bg-zinc-50 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-red" />
              <h3 className="font-extrabold text-zinc-955 text-body-sm">Confirm Administrative Lock</h3>
            </div>

            <div className="p-5 space-y-4 text-body-sm font-semibold text-zinc-655">
              <p className="leading-relaxed text-[12.5px]">
                You are about to lock Seating assignments for <strong className="text-zinc-955 font-extrabold">{conclaveName}</strong>.
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
            className="text-white opacity-40 hover:opacity-100 ml-2 animate-none cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
