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
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import confetti from 'canvas-confetti';

export default function ScheduleGen() {
  // Simulator State
  const [progress, setProgress] = useState(85);
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsed, setElapsed] = useState(42);
  const [processed, setProcessed] = useState(1054);
  const [currentStep, setCurrentStep] = useState('Conflict Resolution');
  const [round3Status, setRound3Status] = useState('IN PROGRESS (45%)');
  const [activeStepIndex, setActiveStepIndex] = useState(4); // 0-indexed step 5: Resolution

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
      ['Date', 'Nov 12-14, San Francisco'],
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

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">

      {/* Header Section */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Schedule Generation</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Generate seating assignments based on conclave rules.
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
      <div className="border border-zinc-100 bg-zinc-50/40 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <Calendar className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h3 className="text-body-sm font-bold text-zinc-950">Annual Global Summit 2024</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">San Francisco Convention Center • Nov 12-14</p>
            </div>
          </div>
          <div className="flex items-center gap-8 px-2 sm:px-6">
            <div className="text-center">
              <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Validation Score</div>
              <div className="text-section-heading font-extrabold text-brand-red mt-0.5">100%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 pt-1 font-semibold text-zinc-650">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Members</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">1,240</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Captains</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">48</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Business Types</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">12</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Rounds</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">{roundCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Tables</span>
            <span className="text-body-sm font-bold text-zinc-900 mt-0.5">{Math.ceil(1240 / personsPerTable)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-100 w-fit mt-1 uppercase tracking-wider">
              VALIDATED
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
        </div>
      </div>

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
                  <span className="text-brand-red">{progress === 100 ? '99.2%' : '98%'}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ name: 'Unique Meetings', value: progress === 100 ? 99.2 : 98 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                  <span className="text-zinc-900 font-extrabold">0</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ name: 'Repeated Pairings', value: 0 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                  <span className="text-brand-red">High ({progress === 100 ? '95.6%' : '92%'})</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[{ name: 'Diversity Score', value: progress === 100 ? 95.6 : 92 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                    <span className="font-bold text-zinc-900">{processed.toLocaleString()} / 1,240</span>
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
                <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">155 Tables • 1,240 Members</p>
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
                <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">155 Tables • 1,240 Members</p>
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
                  {progress === 100 ? '155 Tables • 1,240 Members' : 'Allocating Members...'}
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
