import React, { useState, useEffect } from 'react';
import {
  Check,
  ArrowRight,
  User,
  Clock,
  MapPin,
  Coffee,
} from 'lucide-react';

export default function MemberSchedule({ loggedInMember, onTabChange, conclaveSyncData }) {
  const [timeLeft, setTimeLeft] = useState(600);
  const initialTime = 600; // 10 mins total round duration

  useEffect(() => {
    const startedAt = conclaveSyncData?.conclaveStatus?.currentRoundStartedAt;
    if (startedAt && conclaveSyncData?.conclaveStatus?.status === 'active') {
      const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
        setTimeLeft(Math.max(0, initialTime - elapsed));
      };
      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    } else {
      setTimeLeft(600);
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
        <h1 className="text-2xl md:text-3xl font-black text-zinc-955 tracking-tight">My Schedule</h1>
        <p className="text-xs text-zinc-450 font-semibold mt-1">View your complete networking schedule for the current conclave.</p>
      </div>

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
