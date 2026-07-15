import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Shield, X, Award } from 'lucide-react';

import { captainRoundData } from '../../data/mockConclaveData';
import ReferModal from '../../components/ReferModal';

export default function CaptainTable({ loggedInCaptain, searchQuery }) {
  const [selectedRound, setSelectedRound] = useState(3);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [referTarget, setReferTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const roundData = captainRoundData;

  const currentMembersList = roundData[selectedRound] || [];

  const filteredMembers = currentMembersList.filter(member => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(q) ||
      member.company.toLowerCase().includes(q) ||
      member.category.toLowerCase().includes(q) ||
      member.bniId.toLowerCase().includes(q)
    );
  });

  const getRoundStatus = (roundNum) => {
    if (roundNum < 3) return { text: 'Completed', bg: 'bg-emerald-50 border-emerald-100 text-emerald-700' };
    if (roundNum === 3) return { text: 'Running', bg: 'bg-red-50 border-red-100 text-brand-red animate-pulse' };
    return { text: 'Upcoming', bg: 'bg-zinc-50 border-zinc-200 text-zinc-550' };
  };

  const currentStatus = getRoundStatus(selectedRound);

  return (
    <div className="space-y-6 animate-fade-in font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-zinc-955 tracking-tight">My Table</h1>
          <p className="text-xs text-zinc-450 font-semibold mt-0.5">
            View your assigned table and participants for each networking round.
          </p>
        </div>

        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border shadow-2xs ${currentStatus.bg}`}>
            {currentStatus.text} (Round {selectedRound})
          </span>
          <span className="bg-zinc-800 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-2xs">
            Table 5
          </span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Table', val: '5', accent: false },
          { label: 'Captain', val: loggedInCaptain.name.split(' ')[0], accent: false },
          { label: 'Selected Round', val: `Round ${selectedRound}`, accent: true },
          { label: 'Status', val: currentStatus.text, accent: false, isStatus: true },
          { label: 'Participants', val: `${filteredMembers.length} Active`, accent: false },
          { label: 'Table Density', val: `${new Set(filteredMembers.map(m => m.category)).size} Categories`, accent: false }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1">{kpi.label}</p>
            {kpi.isStatus ? (
              <div className={`flex items-center gap-1.5 text-[14px] font-black ${selectedRound === 3 ? 'text-brand-red' : selectedRound < 3 ? 'text-emerald-600' : 'text-zinc-550'}`}>
                {selectedRound === 3 && <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>}
                {kpi.val}
              </div>
            ) : (
              <p className={`font-black text-[14px] leading-tight ${kpi.accent ? 'text-brand-red' : 'text-zinc-800'}`}>
                {kpi.val}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Round Selector Tabs */}
      <div className="bg-zinc-150/80 p-1.5 rounded-xl border border-zinc-200 flex w-full overflow-x-auto gap-2">
        {['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6'].map((r, i) => {
          const roundNum = i + 1;
          const isCompleted = roundNum < 3;
          const isActive = roundNum === selectedRound;

          return (
            <button
              key={r}
              onClick={() => setSelectedRound(roundNum)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer ${isActive
                  ? 'bg-brand-red text-white shadow-md shadow-brand-red/10'
                  : 'text-zinc-555 hover:bg-zinc-200 hover:text-zinc-850 bg-white/50 border border-zinc-200/40'
                }`}
            >
              {isCompleted && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
              {roundNum === 3 && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
              )}
              <span>{r}</span>
            </button>
          );
        })}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column (Occupancy & Cards) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Table Capacity Card */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-zinc-900 text-body-sm">Table 5 Seating Statistics</h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Statistical breakdown of the currently selected round.</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-brand-red leading-none">
                  {Math.round((filteredMembers.length / 8) * 100)}%
                </span>
                <p className="text-[10px] text-zinc-400 font-semibold leading-none mt-1">{filteredMembers.length} of 8 Seats</p>
              </div>
            </div>

            <div className="w-full bg-zinc-50 rounded-full h-2.5 mb-3 overflow-hidden border border-zinc-150">
              <div
                className="bg-brand-red h-full rounded-full transition-all duration-700 ease-out shadow-inner"
                style={{ width: `${(filteredMembers.length / 8) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
              <span>Optimal Seating: 8 Members Max</span>
              <span>Diversity Index: Excellent</span>
            </div>
          </div>

          {/* Participant Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMembers.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center border border-zinc-200 rounded-xl">
                <p className="text-[12px] text-zinc-450 font-bold">No members found matching your search query.</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-4.5 rounded-xl border border-zinc-200 hover:border-brand-red/20 shadow-2xs flex flex-col justify-between gap-4 transition-smooth"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-sm text-zinc-450 shrink-0 shadow-inner">
                      {member.initials}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-[13px] font-black text-zinc-800 truncate leading-tight">{member.name}</h4>
                      <span className={`inline-block px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase border tracking-wider leading-none ${member.bgClass}`}>
                        {member.category}
                      </span>
                      {/* Fixed: Changed leading-none to leading-normal mt-0.5 to prevent text descender cuts */}
                      <p className="text-[10.5px] text-zinc-450 font-semibold truncate leading-normal mt-0.5">{member.company}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px]">
                    <span className="text-zinc-400 font-extrabold uppercase text-[9px] tracking-wide">{member.chapter}</span>
                    <span className="text-brand-red bg-red-50/50 border border-red-100 px-2 py-0.5 rounded font-mono font-bold leading-none">
                      {member.bniId}
                    </span>
                  </div>

                  {/* Refer button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReferTarget(member);
                    }}
                    className="w-full py-1.5 border border-zinc-200 hover:border-brand-red text-zinc-650 hover:text-brand-red bg-zinc-50/50 hover:bg-red-50/5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer font-bold"
                  >
                    Send Referral
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (Instructions & Guidelines) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-3.5">
            <h3 className="font-black text-zinc-955 text-body-sm border-b border-zinc-100 pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-red shrink-0" />
              <span>Captain Directives</span>
            </h3>
            <p className="text-[11px] text-zinc-450 font-semibold leading-relaxed">
              As a Table Captain, you are responsible for monitoring the attendance, timing, and referral exchanges during this round.
            </p>
            <p className="text-[11px] text-zinc-450 font-semibold leading-relaxed">
              If an assigned member fails to check in, flag it immediately to the Conclave Support Desk using the Admin Chat box.
            </p>
          </div>

          {/* Timeline Panel */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-5">
            <h3 className="font-black text-zinc-955 text-body-sm border-b border-zinc-100 pb-2">Round Timeline</h3>
            <div className="relative pl-6 flex flex-col gap-5 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-zinc-150">
              {[
                { label: 'Round Started', time: 'Completed at 10:15 AM', done: true, active: false },
                { label: 'Current Discussion', time: 'In progress (8m left)', done: false, active: true },
                { label: 'Round Ending', time: 'Target: 10:40 AM', done: false, active: false },
                { label: 'Next Round', time: 'Starts at 10:45 AM', done: false, active: false }
              ].map((step, sIdx) => (
                <div key={sIdx} className="relative">
                  {step.active ? (
                    <div className="absolute -left-[23.5px] top-1 w-3 h-3 rounded-full bg-brand-red border-2 border-white ring-4 ring-red-100 animate-pulse z-10"></div>
                  ) : (
                    <div className={`absolute -left-[22px] top-1.5 w-2 h-2 rounded-full border border-white z-10 ${step.done ? 'bg-emerald-500' : 'bg-zinc-200'
                      }`}></div>
                  )}
                  <p className={`text-[11.5px] font-bold leading-none ${step.active ? 'text-brand-red font-black' : 'text-zinc-800'}`}>{step.label}</p>
                  <p className="text-[9.5px] text-zinc-400 font-semibold mt-1">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Round Preview Footer */}
      <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-red-50 p-2.5 rounded-lg border border-red-100 text-brand-red shrink-0 shadow-sm shadow-brand-red/5">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest leading-none">Coming Up Next</p>
            <h4 className="font-extrabold text-zinc-900 text-body-sm leading-tight mt-1.5">Round 4 Migration</h4>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[10px] text-zinc-400 font-semibold leading-none">Expected Members</p>
            <p className="font-black text-zinc-800 text-[12px] mt-1.5">7 members</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-zinc-400 font-semibold leading-none">Start Time</p>
            <p className="font-black text-zinc-800 text-[12px] mt-1.5">10:45 AM</p>
          </div>
          <button
            onClick={() => setShowPreviewModal(true)}
            className="bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-850 px-4.5 py-2.5 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-smooth shadow-sm cursor-pointer"
          >
            Preview Table List
          </button>
        </div>
      </div>

      {/* Slide-Up / Overlay Modal for Preview Table List */}
      {showPreviewModal && createPortal(
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-zinc-150 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-red" />
                <h3 className="font-black text-zinc-955 text-body-md">Round 4 Table Seating Preview</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-200/50 transition-smooth cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="flex justify-between items-center bg-red-50/50 border border-red-100 p-3 rounded-lg text-[11.5px] font-semibold text-brand-red">
                <span>Migration Target: Table 5</span>
                <span>Expected Occupancy: 7 / 8 Seats</span>
              </div>

              <div className="space-y-2.5">
                <span className="text-[9.5px] font-black text-zinc-450 uppercase tracking-wider block">Incoming Members Grid</span>
                <div className="space-y-2">
                  {roundData[4].map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[11.5px]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center font-bold text-zinc-500 text-xs shrink-0">
                          {member.initials}
                        </div>
                        <div>
                          <span className="font-black text-zinc-850 block leading-tight">{member.name}</span>
                          <span className="text-[9.5px] text-zinc-400 font-semibold">{member.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-red-50 border border-red-100 text-brand-red text-[8px] font-black rounded uppercase">
                          {member.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-150 flex justify-end bg-zinc-50">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {referTarget && (
        <ReferModal
          recipient={referTarget}
          loggedInUser={loggedInCaptain}
          onClose={() => setReferTarget(null)}
          onSuccess={(msg) => {
            setToast(msg);
            setTimeout(() => setToast(null), 3000);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[70] bg-zinc-900 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-xl flex items-center gap-2 border border-zinc-800 animate-slide-up">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <div>
            <p className="font-bold text-white">Success!</p>
            <p className="text-zinc-400 mt-0.5">{toast}</p>
          </div>
        </div>
      )}

    </div>
  );
}
