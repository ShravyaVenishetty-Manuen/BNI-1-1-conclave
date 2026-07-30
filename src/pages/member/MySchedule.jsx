import React, { useState, useEffect } from 'react';
import {
  Check,
  ArrowRight,
  User,
  Clock,
  MapPin,
  Coffee,
  FileText,
  Download,
} from 'lucide-react';
import { downloadOrViewAgendaDocument } from '../../utils/documentUtils';
import { api } from '../../services/api';

export default function MemberSchedule({ loggedInMember, onTabChange, conclaveSyncData: propConclaveSyncData }) {
  const [syncData, setSyncData] = useState(() => {
    if (propConclaveSyncData) return propConclaveSyncData;
    const cached = localStorage.getItem('bni_conclave_sync_data_cache');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return null;
  });

  const [fetchedAgendaDoc, setFetchedAgendaDoc] = useState(null);

  useEffect(() => {
    async function fetchLatestAgendaDoc() {
      try {
        const list = await api.get('/conclaves');
        if (Array.isArray(list)) {
          const conclaveWithDoc = list.find(c => c.agendaDocument);
          if (conclaveWithDoc && conclaveWithDoc.agendaDocument) {
            setFetchedAgendaDoc(conclaveWithDoc.agendaDocument);
            if (conclaveWithDoc.id) {
              localStorage.setItem(`bni_agenda_doc_${conclaveWithDoc.id}`, JSON.stringify(conclaveWithDoc.agendaDocument));
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch agenda document from backend:", err);
      }
    }
    fetchLatestAgendaDoc();
  }, []);

  useEffect(() => {
    if (propConclaveSyncData) {
      setSyncData(propConclaveSyncData);
      localStorage.setItem('bni_conclave_sync_data_cache', JSON.stringify(propConclaveSyncData));
    }
  }, [propConclaveSyncData]);

  const conclaveSyncData = syncData || propConclaveSyncData;

  const getUploadedAgendaDoc = () => {
    if (conclaveSyncData?.agendaDocument) return conclaveSyncData.agendaDocument;
    if (fetchedAgendaDoc) return fetchedAgendaDoc;
    
    // Check specific conclave key
    const conclaveId = conclaveSyncData?.conclaveStatus?.id || conclaveSyncData?.conclaveId;
    if (conclaveId) {
      const cached = localStorage.getItem(`bni_agenda_doc_${conclaveId}`);
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }

    // Check all conclave caches in local storage
    const keys = ['bni_admin_conclaves_cache', 'bni_conclaves', 'bni_member_conclaves_cache', 'bni_schedule_gen_conclaves_cache'];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const found = list.find(c => c.agendaDocument);
            if (found && found.agendaDocument) return found.agendaDocument;
          }
        } catch (e) {}
      }
    }

    // Check any local storage key starting with bni_agenda_doc_
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('bni_agenda_doc_')) {
        try {
          const val = JSON.parse(localStorage.getItem(k));
          if (val && (val.url || val.dataUrl)) return val;
        } catch (e) {}
      }
    }
    return null;
  };

  const agendaDoc = getUploadedAgendaDoc() || fetchedAgendaDoc;

  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  useEffect(() => {
    if (!agendaDoc) {
      setPdfBlobUrl(null);
      return;
    }

    const dataUrl = agendaDoc.dataUrl || agendaDoc.url;
    if (dataUrl && dataUrl.includes(';base64,')) {
      try {
        const parts = dataUrl.split(';base64,');
        const mime = parts[0].replace('data:', '') || agendaDoc.type || 'application/pdf';
        const base64Str = parts[1];
        const binaryStr = window.atob(base64Str);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mime });
        const bUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(bUrl);

        return () => {
          URL.revokeObjectURL(bUrl);
        };
      } catch (e) {
        console.warn("Failed to create blob URL:", e);
        setPdfBlobUrl(dataUrl);
      }
    } else {
      let fileUrl = dataUrl || '';
      if (fileUrl.startsWith('/uploads')) {
        fileUrl = `${window.location.protocol}//${window.location.hostname}:3000${fileUrl}`;
      }
      setPdfBlobUrl(fileUrl);
    }
  }, [agendaDoc]);

  const initialTime = 15 * 60; // 900 seconds (15:00)
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const startedAt = conclaveSyncData?.conclaveStatus?.currentRoundStartedAt;
    const status = (conclaveSyncData?.conclaveStatus?.status || '').toLowerCase();
    const isRunning = status === 'running' || status === 'active';

    if (startedAt && isRunning) {
      const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
        setTimeLeft(Math.max(0, initialTime - elapsed));
      };
      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    } else {
      setTimeLeft(initialTime);
    }
  }, [conclaveSyncData]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const rounds = conclaveSyncData?.mySchedule || [];
  const currentRoundNum = conclaveSyncData?.conclaveStatus?.currentRound || 0;
  const currentRoundSeating = conclaveSyncData?.mySchedule?.find(s => s.number === currentRoundNum);
  const nextRound = rounds.find(r => r.number === currentRoundNum + 1);
  const memberName = loggedInMember?.name || 'Member';

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-955 tracking-tight">My Conclave Agenda & Schedule</h1>
        <p className="text-xs text-zinc-450 font-semibold mt-1 font-sans">Official agenda uploaded by Admin for the business conclave.</p>
      </div>

      {/* In-Page Interactive Agenda Document Banner (if uploaded by Admin) */}
      {agendaDoc && (
        <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 text-white rounded-2xl p-6 shadow-md border border-emerald-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-400/30 shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-black tracking-wider uppercase text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-400/30">
                  Published Conclave Agenda
                </span>
                <span className="text-xs text-zinc-300 font-medium">{agendaDoc.size || 'PDF Document'}</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1.5">{agendaDoc.name || 'Official Conclave Agenda.pdf'}</h2>
              <p className="text-xs text-zinc-350 font-medium mt-1">
                Click below to open and view the complete official conclave agenda document.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => downloadOrViewAgendaDocument(agendaDoc)}
              type="button"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-button rounded-xl transition-smooth shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              View / Open Agenda File
            </button>
          </div>
        </div>
      )}



      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 items-start">

        {/* Left Column: Schedule Progress & Timeline (Col-Span 12) */}
        <div className="col-span-12 space-y-6">

          {/* Current Live Session Card */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-red-50 border border-red-100 text-brand-red text-[9px] font-black rounded uppercase tracking-wider animate-pulse">
                  LIVE NOW
                </span>
                <span className="text-body-sm font-black text-zinc-800">Round {currentRoundNum} of {rounds.length || 6}</span>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 mt-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Current Table</span>
                  <span className="text-[13px] font-black text-zinc-900 mt-0.5">Table {currentRoundSeating?.tableNumber || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Table Captain</span>
                  <span className="text-[13px] font-black text-zinc-900 mt-0.5">{currentRoundSeating?.captain || 'Unknown'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
              <div className="bg-zinc-50 px-4 py-2.5 rounded-lg border border-zinc-200 text-center w-full md:w-44 shrink-0">
                <span className="text-[8.5px] font-extrabold text-zinc-400 uppercase tracking-widest block">TIME REMAINING</span>
                <span className="text-xl font-black text-brand-red mt-1 block tracking-tighter tabular-nums leading-none">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={() => onTabChange && onTabChange('dashboard')}
                className="w-full md:w-auto px-4 py-2 bg-brand-red hover:bg-red-750 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-brand-red/10"
              >
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Network Diversity Stats Grid */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-4 flex justify-around items-center gap-4 divide-x divide-zinc-150">
            <div className="flex-1 text-center py-1">
              <span className="block text-base font-black text-zinc-900">{rounds.length}</span>
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mt-1 block">Total Rounds</span>
            </div>
            <div className="flex-1 text-center py-1">
              <span className="block text-base font-black text-zinc-900">
                {new Set(rounds.flatMap(r => r.participants || []).map(p => p.category)).size}
              </span>
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mt-1 block">Unique Niches</span>
            </div>
            <div className="flex-1 text-center py-1">
              <span className="block text-base font-black text-zinc-900">
                {Math.max(0, new Set(rounds.flatMap(r => r.participants || []).map(p => p.name)).size - 1)}
              </span>
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mt-1 block">New Connections</span>
            </div>
          </div>

          {/* Timeline Stepper Container */}
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="min-w-[600px] flex items-center justify-between px-6 py-5 bg-white rounded-xl border border-zinc-200 shadow-2xs">

              {/* Step 0 - Start */}
              <div className="flex flex-col items-center select-none">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow-sm shadow-emerald-500/10">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-[10px] font-extrabold text-zinc-450 uppercase tracking-wide">Start</span>
              </div>

              {rounds.map((r, idx) => {
                const isCompleted = r.status === 'Completed';
                const isActive = r.status === 'Active';
                return (
                  <React.Fragment key={r.number}>
                    <div className={`flex-1 h-[2px] mx-2 mt-[-20px] ${isCompleted ? 'bg-emerald-500' : isActive ? 'bg-brand-red' : 'bg-zinc-200'}`}></div>
                    <div className={`flex flex-col items-center select-none ${!isCompleted && !isActive ? 'opacity-45' : ''}`}>
                      {isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow-sm shadow-emerald-500/10">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : isActive ? (
                        <div className="w-9 h-9 rounded-full border-2 border-brand-red bg-white text-brand-red font-black flex items-center justify-center mb-1 shadow-sm leading-none text-xs">
                          {r.number}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-450 flex items-center justify-center mb-1.5 font-bold text-xs border border-zinc-200">
                          {r.number}
                        </div>
                      )}
                      <span className={`text-[10px] uppercase tracking-wide ${isActive ? 'font-black text-brand-red' : 'font-extrabold text-zinc-400'}`}>
                        {isActive ? `Round ${r.number}` : `R${r.number}`}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}

            </div>
          </div>

          {/* Full Schedule Grid */}
          <div className="space-y-4">
            <h2 className="font-black text-zinc-900 text-body-md px-1">Full Schedule Timeline</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rounds.map((rnd) => {
                const isCompleted = rnd.status === 'Completed';
                const isActive = rnd.status === 'Active';
                const isUpcoming = rnd.status === 'Upcoming';

                return (
                  <div
                    key={rnd.number}
                    className={`bg-white rounded-xl p-5 shadow-2xs space-y-4 border transition-all duration-300 hover:shadow-md ${
                      isActive ? 'border-2 border-brand-red ring-4 ring-brand-red/5' : 'border-zinc-200'
                    } ${isCompleted ? 'opacity-85 bg-zinc-50/10' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8px] font-black rounded uppercase tracking-wider">COMPLETED</span>
                          )}
                          {isActive && (
                            <span className="px-1.5 py-0.5 bg-red-50 border border-red-100 text-brand-red text-[8px] font-black rounded uppercase tracking-wider animate-pulse">ACTIVE NOW</span>
                          )}
                          {isUpcoming && (
                            <span className="px-1.5 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-400 text-[8px] font-black rounded uppercase tracking-wider">UPCOMING</span>
                          )}
                          <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider">{rnd.time}</span>
                        </div>
                        <h3 className="text-[14.5px] font-black text-zinc-900 mt-1.5">Round {rnd.number} ({rnd.table})</h3>
                        <p className="text-[11px] text-zinc-450 font-semibold mt-0.5">Captain: {rnd.captain}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-550 text-[9px] font-black rounded-full flex items-center gap-1 shrink-0">
                        <User className="w-3 h-3 text-zinc-450" />
                        {rnd.participants.length} Members
                      </span>
                    </div>

                    {/* Participant Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1.5 border-t border-zinc-100">
                      {rnd.participants.map(participant => (
                        <div
                          key={participant.name}
                          className="p-2.5 bg-zinc-50/50 border border-zinc-200/80 rounded-lg flex items-center gap-2.5 transition-smooth hover:border-zinc-300"
                        >
                          <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-[10px] text-zinc-650 shrink-0 shadow-inner select-none">
                            {participant.initials}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[11px] font-black text-zinc-800 truncate leading-snug">{participant.name}</h4>
                            <span className="text-[9px] text-zinc-450 font-semibold block truncate leading-none mt-0.5">{participant.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right Column: Next Round Preview & Logistics (Col-Span 12, grid side-by-side) */}
        <aside className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Up Next Card */}
          {nextRound ? (
            <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
              <div className="bg-zinc-50 p-4 border-b border-zinc-200/80">
                <h3 className="font-black text-zinc-900 text-body-sm">Up Next</h3>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Round {nextRound.number}</span>
                    <span className="text-[13.5px] font-black text-zinc-900 mt-0.5">{nextRound.table}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">Starts in</span>
                    <span className="text-[13.5px] font-black text-zinc-500 mt-0.5">TBD</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-650 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    {nextRound.time}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-650 font-semibold">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    Captain: {nextRound.captain}
                  </div>
                </div>

                <div className="p-3 bg-zinc-50/50 rounded-lg border border-dashed border-zinc-200 text-center mt-2">
                  <p className="text-[10px] text-zinc-450 italic font-semibold">
                    Round details will unlock after active round completion.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 flex items-center justify-center text-center">
              <p className="text-zinc-400 text-caption font-semibold">No further upcoming rounds scheduled.</p>
            </div>
          )}

          {/* Logistics Venue Info Card */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 space-y-4">
            <h3 className="font-black text-zinc-900 text-body-sm">Venue Info</h3>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block text-[11.5px] font-black text-zinc-800 leading-tight">
                    {conclaveSyncData?.conclaveStatus?.venue || "Grand Convention Hall"}
                  </span>
                  <span className="text-[10px] text-zinc-450 font-semibold">Wing A, Table Seating Area</span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Coffee className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block text-[11.5px] font-black text-zinc-800 leading-tight">Lunch & Networking</span>
                  <span className="text-[10px] text-zinc-450 font-semibold">Scheduled Mid-Day Break</span>
                </div>
              </div>
            </div>
          </div>

        </aside>
      </div>

    </div>
  );
}
