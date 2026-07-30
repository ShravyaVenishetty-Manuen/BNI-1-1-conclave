import React, { useState, useEffect } from 'react';
import { Check, Play, ArrowRight, Award, Shield, PhoneCall, BookOpen, FileText, Download } from 'lucide-react';
import { downloadOrViewAgendaDocument } from '../../utils/documentUtils';
import { api } from '../../services/api';

export default function CaptainSchedule({ loggedInCaptain, conclaveSyncData: propConclaveSyncData }) {
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
    
    const conclaveId = conclaveSyncData?.conclaveStatus?.id || conclaveSyncData?.conclaveId;
    if (conclaveId) {
      const cached = localStorage.getItem(`bni_agenda_doc_${conclaveId}`);
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }

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

  const scheduleItems = conclaveSyncData?.mySchedule || [];
  const currentRoundNum = conclaveSyncData?.conclaveStatus?.currentRound || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-zinc-955 tracking-tight">Round Schedule</h1>
          <p className="text-xs text-zinc-450 font-semibold mt-0.5">
            Full schedule and timeline of the business conclave sessions.
          </p>
        </div>
        
        <div className="flex gap-2">
          {conclaveSyncData?.conclaveStatus?.status?.toLowerCase() === 'completed' ? (
            <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border border-emerald-150 shadow-2xs flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Conclave Completed
            </span>
          ) : (
            <span className="bg-red-50 text-brand-red px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border border-red-100 shadow-2xs flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-brand-red fill-brand-red" />
              Active Session
            </span>
          )}
        </div>
      </div>

      {/* Published Conclave Agenda Banner (if uploaded by Admin) */}
      {agendaDoc && (
        <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 text-white rounded-2xl p-6 shadow-md border border-emerald-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
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



      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Timeline with Cards */}
        <div className="lg:col-span-8 relative py-4 px-2">
          {/* Continuous timeline vertical track line */}
          <div className="absolute top-4 bottom-4 left-[19px] w-[1.5px] bg-zinc-200 z-0"></div>

          <div className="space-y-6 relative z-10">
            {scheduleItems.map((item) => {
              const isCompleted = item.status?.toLowerCase() === 'completed';
              const isActive = item.status?.toLowerCase() === 'active';

              return (
                <div key={item.number} className={`flex gap-5 items-start ${!isActive && !isCompleted ? 'opacity-70' : ''}`}>
                  
                  {/* Status Indicator circle */}
                  <div className="shrink-0 flex items-center justify-center w-6 h-6 relative mt-5">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center shadow-xs z-10 border border-zinc-55">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    ) : isActive ? (
                      <div className="w-5.5 h-5.5 rounded-full bg-brand-red text-white flex items-center justify-center shadow-md shadow-brand-red/15 border-2 border-white ring-4 ring-red-100 z-10 animate-pulse">
                        <Play className="w-2 h-2 fill-current ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full bg-white border border-zinc-250 flex items-center justify-center z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-350"></div>
                      </div>
                    )}
                  </div>

                  {/* Standalone card block */}
                  <div className={`flex-1 p-5 rounded-xl border bg-white shadow-2xs hover:border-zinc-300 transition-smooth ${
                    isActive 
                      ? 'border-zinc-250 shadow-xs ring-1 ring-zinc-150' 
                      : 'border-zinc-200/60'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <span className={`text-[9.5px] font-black uppercase tracking-wider ${
                        isActive ? 'text-brand-red' : 'text-zinc-400'
                      }`}>
                        {item.time}
                      </span>
                      {isActive && (
                        <span className="self-start sm:self-auto bg-brand-red text-white px-2 py-0.5 rounded-[4px] text-[7.5px] font-black uppercase tracking-wider leading-none">
                          Active Now
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`text-[12.5px] font-black leading-snug ${
                      isActive ? 'text-zinc-955' : 'text-zinc-800'
                    }`}>
                      Round {item.number} Seating ({item.table})
                    </h3>
                    
                    <p className="text-[11px] text-zinc-455 font-semibold leading-relaxed mt-1">
                      Networking session matching synergetic categories at Table {item.tableNumber}. Seated with captain {item.captain}.
                    </p>

                    {isActive && (
                      <div className="mt-4 pt-3.5 border-t border-zinc-200 flex items-center justify-between text-[9.5px] font-extrabold text-brand-red">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>Table {conclaveSyncData?.tableNumber || 'N/A'} Seating Active</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
            {scheduleItems.length === 0 && (
              <p className="text-center text-zinc-400 text-caption font-semibold py-8">No schedule items generated.</p>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar Info Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Conclave Guidelines Card */}
          <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-body-sm font-black text-zinc-950 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <BookOpen className="w-4.5 h-4.5 text-brand-red" />
              Guidelines
            </h3>
            
            <ul className="space-y-3 text-[11px] text-zinc-500 font-semibold leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0 mt-1.5"></span>
                <span>Each participant is allocated exactly 2 minutes for introductions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0 mt-1.5"></span>
                <span>Ensure members scan the table QR code to confirm attendance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0 mt-1.5"></span>
                <span>Referral and 1-to-1 requests must be logged through the portal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0 mt-1.5"></span>
                <span>Migrate quickly when the coffee break signal rings.</span>
              </li>
            </ul>
          </div>

          {/* Captain Support Helpdesk Card */}
          <div className="bg-zinc-950 border border-zinc-800 text-white rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">Support Portal</span>
              <h3 className="text-body-sm font-black text-white mt-1.5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-red" />
                Table Captain Assistance
              </h3>
            </div>
            
            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
              Encountering attendance discrepancies or hardware login issues? Contact the coordinator desk immediately.
            </p>

            <div className="pt-2">
              <a 
                href="tel:+1234567890" 
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 transition-smooth border border-white/15 rounded-lg text-[9.5px] font-black uppercase tracking-wider text-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call Helpdesk
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
