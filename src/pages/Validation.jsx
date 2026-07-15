import React, { useState, useMemo } from 'react';
import {
  RefreshCw,
  Download,
  Play,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Check,
  X,
  ChevronDown,
  Calendar,
  MapPin,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import initialConclaves from '../data/conclaves_validation.json';

export default function Validation({ selectedConclaveId }) {
  const [conclaves, setConclaves] = useState(initialConclaves);
  
  const activeConclaveIndex = useMemo(() => {
    const idx = conclaves.findIndex(c => c.id === selectedConclaveId);
    return idx !== -1 ? idx : 0;
  }, [conclaves, selectedConclaveId]);

  const activeConclave = conclaves[activeConclaveIndex];

  // Accordion open states
  const [expandedRules, setExpandedRules] = useState(new Set(['rule-2']));

  // Simulation states
  const [isValidating, setIsValidating] = useState(false);
  const [isConclaveSelectorOpen, setIsConclaveSelectorOpen] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleRule = (id) => {
    const updated = new Set(expandedRules);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setExpandedRules(updated);
  };

  // Run validation click handler
  const handleRunValidation = () => {
    setIsValidating(true);
    showToast('Running Verification', 'Re-executing conclave rules parameters...');
    setTimeout(() => {
      setIsValidating(false);
      showToast('Validation Complete', 'All checks completed successfully.');
    }, 1500);
  };

  // Quick fix captains ratio simulation
  const handleQuickFix = () => {
    setConclaves(prev => prev.map((c, idx) => {
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
    showToast('Ratio Auto-Resolved', 'Standby captains successfully assigned to West Chapter.');
  };

  // Recharts Gauge Data
  const chartData = useMemo(() => {
    return [
      { name: 'readiness', value: activeConclave.score },
      { name: 'remaining', value: 100 - activeConclave.score }
    ];
  }, [activeConclave.score]);

  // Export validation report as CSV
  const exportReport = () => {
    const headers = ['Conclave', 'Rule', 'Status', 'Type', 'Description'];
    const rows = activeConclave.rules.map(r => [
      activeConclave.name,
      r.title,
      r.status,
      r.type,
      r.desc
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `validation-report-${activeConclave.id}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Report Downloaded', `Exported ${activeConclave.rules.length} validation rules for ${activeConclave.name}.`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-5 animate-fade-in">

      {/* Breadcrumbs & Header */}
      <div className="border-b border-zinc-100 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Validation Center</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Validate conclave configuration rules before schedule generation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleRunValidation}
            disabled={isValidating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-zinc-450 ${isValidating ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            Export Report
          </button>

          <button
            onClick={handleRunValidation}
            disabled={isValidating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button rounded-lg transition-smooth shadow-md cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isValidating ? 'Validating...' : 'Run Validation'}
          </button>
        </div>
      </div>

      {/* Selected Conclave Horizontal Bar */}
      <div className="bg-white border border-zinc-200/80 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4">
        <div className="flex flex-wrap items-center gap-6 md:gap-10 flex-1">
          
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-red shrink-0" />
            <span className="text-body-sm font-extrabold text-zinc-900">{activeConclave.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-body-sm font-medium text-zinc-600">{activeConclave.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-body-sm font-medium text-zinc-650">{activeConclave.venue}</span>
          </div>

        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <Camera className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Snapshot Taken
          </span>
          <button
            onClick={() => setIsConclaveSelectorOpen(true)}
            className="px-3.5 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-smooth cursor-pointer shadow-xs flex items-center gap-1.5 text-button"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" /> Switch Conclave
          </button>
        </div>
      </div>

      {/* Grid Layout (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: KPI & Validation results */}
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
            <div className={`col-span-2 sm:col-span-1 border p-4 rounded-xl flex flex-col justify-center items-center ${activeConclave.errorsCount > 0 ? 'bg-red-50/10 border-red-100 text-brand-red' : 'bg-emerald-50/10 border-emerald-100 text-emerald-700'}`}>
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <p className="text-[9px] font-extrabold uppercase mt-1.5 text-center">
                {activeConclave.errorsCount > 0 ? 'Attention Needed' : 'Ready'}
              </p>
            </div>
          </div>

          {/* Validation Rules List */}
          <div className="space-y-3">
            <h3 className="text-section-heading font-extrabold text-zinc-950 pb-1.5 border-b border-zinc-100">Rule Execution Details</h3>

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
                      <p className="text-body-sm text-zinc-650 leading-relaxed font-medium select-text">
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

        {/* Right Column: Readiness, Summary & Timeline */}
        <div className="lg:col-span-4 space-y-5">

          {/* Circular Readiness Card */}
          <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm text-center">
            <h3 className="text-body-sm font-extrabold text-zinc-950 uppercase border-b border-zinc-100 pb-2.5">Conclave Readiness</h3>

            <div className="w-36 h-36 relative mx-auto flex items-center justify-center my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
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
                <span className="text-3xl font-extrabold text-zinc-950 leading-none">{activeConclave.score}%</span>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-1.5">Verified</span>
              </div>
            </div>

            <div className="mb-2">
              {activeConclave.errorsCount > 0 ? (
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
              {activeConclave.errorsCount > 0
                ? 'Resolve remaining critical issues to unlock the match scheduler engine.'
                : 'All critical checks parsed. The matching scheduler is unlocked.'}
            </p>
          </div>

          {/* Recommendation Fix Panel */}
          {activeConclave.errorsCount > 0 && (
            <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-body-sm font-extrabold text-zinc-950 border-b border-zinc-100 pb-2.5">Fix Recommendations</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-red-50 bg-red-50/15">
                  <div className="bg-brand-red text-white p-1 rounded-md shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-sm font-bold text-zinc-800">Missing Captains</p>
                    <p className="text-[10px] text-zinc-500 font-semibold">High Priority • West Chapter</p>
                    <button
                      onClick={handleQuickFix}
                      className="text-brand-red font-bold text-[10px] flex items-center hover:underline mt-2 cursor-pointer"
                    >
                      Quick Fix <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-zinc-100 bg-zinc-50/30">
                  <div className="bg-zinc-400 text-white p-1 rounded-md shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-sm font-bold text-zinc-700">Balance Table Capacities</p>
                    <p className="text-[10px] text-zinc-500 font-semibold">Optional • Operational Efficiency</p>
                    <button
                      onClick={() => showToast('Details Visited', 'Navigating to Table 04 log profile.')}
                      className="text-zinc-600 font-bold text-[10px] flex items-center hover:underline mt-2 cursor-pointer"
                    >
                      Review <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* SWITCH CONCLAVE SELECTOR MODAL */}
      {isConclaveSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h3 className="font-extrabold text-zinc-950 text-body-sm">Switch Active Conclave</h3>
              <button type="button" onClick={() => setIsConclaveSelectorOpen(false)} className="p-1 hover:bg-zinc-200 rounded text-zinc-400 transition-smooth">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-2.5 max-h-[50vh] overflow-y-auto">
              {conclaves.map((c, idx) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveConclaveIndex(idx);
                    setIsConclaveSelectorOpen(false);
                    showToast('Conclave Loaded', `Loaded validation guidelines for ${c.name}.`);
                  }}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-smooth flex items-center justify-between ${idx === activeConclaveIndex ? 'border-brand-red bg-red-50/10' : 'border-zinc-100 hover:bg-zinc-50'
                    }`}
                >
                  <div>
                    <h4 className="text-body-sm font-bold text-zinc-900 leading-tight">{c.name}</h4>
                    <p className="text-[10px] text-zinc-450 font-semibold mt-1">{c.venue} • {c.date}</p>
                  </div>
                  {idx === activeConclaveIndex && (
                    <Check className="w-4 h-4 text-brand-red shrink-0" />
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsConclaveSelectorOpen(false)}
                className="px-4 py-2 border border-zinc-100 bg-white text-zinc-700 text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer"
              >
                Close
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
