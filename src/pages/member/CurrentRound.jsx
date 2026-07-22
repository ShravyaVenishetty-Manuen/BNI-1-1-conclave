import React, { useState, useEffect } from 'react';
import {
  MapPin,
  TrendingUp,
  Award,
  Check,
} from 'lucide-react';

import ReferModal from '../../components/ReferModal';
import MemberProfileModal from '../../components/MemberProfileModal';

export default function MemberCurrentRound({ loggedInMember, onTabChange, conclaveSyncData, searchQuery }) {
  const [referTarget, setReferTarget] = useState(null);
  const [selectedProfileMember, setSelectedProfileMember] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredOccupants = useMemo(() => {
    const list = conclaveSyncData?.tableOccupants || [];
    if (!searchQuery || !searchQuery.trim()) return list;
    const tokens = searchQuery.trim().toLowerCase().split(/\s+/);
    return list.filter(m => {
      const text = `${m.name || ''} ${m.company || ''} ${m.category || ''} ${m.chapter || ''}`.toLowerCase();
      return tokens.every(token => text.includes(token));
    });
  }, [conclaveSyncData?.tableOccupants, searchQuery]);
  
  const [timeLeft, setTimeLeft] = useState(600);
  const initialTime = 600; // 10 mins total round simulation

  const [referrals, setReferrals] = useState(() => {
    const stored = localStorage.getItem('bni_referrals');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('bni_referrals');
      if (stored) {
        setReferrals(JSON.parse(stored));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getMemberReferralCount = (name, uid) => {
    const targetName = (name || '').toLowerCase();
    const targetUid = uid || (conclaveSyncData?.tableOccupants || []).find(o => o.name?.toLowerCase() === targetName)?.uid;

    const allRefs = [
      ...referrals,
      ...(conclaveSyncData?.newReferralsReceived || []).map(r => ({
        fromUserId: r.fromUserId,
        fromMemberId: r.fromUserId,
        fromName: r.giverName,
        toUserId: conclaveSyncData?.userUid,
        toMemberId: conclaveSyncData?.userUid
      }))
    ];

    const given = allRefs.filter(r => 
      (targetUid && (r.fromMemberId === targetUid || r.fromUserId === targetUid)) ||
      (targetName && r.fromName && r.fromName.toLowerCase() === targetName) ||
      (targetName && r.giverName && r.giverName.toLowerCase() === targetName)
    ).length;

    const received = allRefs.filter(r => 
      (targetUid && (r.toMemberId === targetUid || r.toUserId === targetUid)) ||
      (targetName && r.toName && r.toName.toLowerCase() === targetName)
    ).length;

    return { given, received };
  };

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

  const radius = 88;
  const circumference = radius * 2 * Math.PI;
  const progressPercent = (timeLeft / initialTime) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const memberName = loggedInMember?.name || 'Member';

  const getAgendaSteps = (seconds) => {
    return [
      {
        time: 'First 5 Mins',
        title: 'Introductions & Quick Exchange',
        desc: 'Introduce yourself, your business category, and state your primary contact target for the conclave.',
        isCurrent: seconds > 450
      },
      {
        time: 'Next 30 Mins',
        title: 'Synergy Discussions',
        desc: 'Review potential cross-referral avenues with table members. Focus on category pairs.',
        isCurrent: seconds <= 450 && seconds > 150
      },
      {
        time: 'Last 10 Mins',
        title: 'Referral Logging & Lock',
        desc: 'Log any referrals or 1-to-1 sync requests in your portal dashboard. Prepare to migrate.',
        isCurrent: seconds <= 150
      }
    ];
  };

  const agendaSteps = getAgendaSteps(timeLeft);

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">

      {/* Live Round Hero Section */}
      <section>
        <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden flex flex-col lg:flex-row">

          {/* Hero Left Content Area */}
          <div className="p-6 md:p-8 lg:w-2/3 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-red-50 border border-red-100 text-brand-red font-black text-[9.5px] rounded-full flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                  LIVE NOW
                </span>
                <span className="text-zinc-450 font-extrabold text-[9px] uppercase tracking-widest">
                  Networking Conclave 2026
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-zinc-955 tracking-tight">
                Round {conclaveSyncData?.conclaveStatus?.currentRound || 0} of {conclaveSyncData?.mySchedule?.length || 6}
              </h1>

              {/* Stepper Progress Bar */}
              <div className="flex items-center w-full max-w-xl pt-2">
                {(conclaveSyncData?.mySchedule || []).map((r, idx) => {
                  const isCompleted = r.status === 'Completed';
                  const isActive = r.status === 'Active';
                  return (
                    <React.Fragment key={r.number}>
                      {idx > 0 && (
                        <div className={`h-0.5 flex-1 mb-4 ${isCompleted ? 'bg-emerald-500' : isActive ? 'bg-brand-red' : 'bg-zinc-200'}`}></div>
                      )}
                      <div className={`flex flex-col items-center flex-1 ${!isCompleted && !isActive ? 'opacity-45' : ''}`}>
                        {isCompleted ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10.5px] shadow-sm select-none">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center font-black text-[12px] shadow-md ring-4 ring-brand-red/10 select-none">
                            {r.number}
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-450 flex items-center justify-center font-bold text-[11px] select-none">
                            {r.number}
                          </div>
                        )}
                        <span className={`text-[9.5px] mt-1 uppercase tracking-wide ${isActive ? 'font-black text-brand-red' : 'font-extrabold text-zinc-400'}`}>
                          {isActive ? 'Active' : `R${r.number}`}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Session Stats grid footer */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
              <div>
                <p className="text-[9.5px] font-black text-zinc-400 uppercase tracking-widest">Assigned Table</p>
                <p className="font-black text-zinc-900 text-body-lg mt-0.5">Table {conclaveSyncData?.tableNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[9.5px] font-black text-zinc-400 uppercase tracking-widest">Session Captain</p>
                <p className="font-black text-zinc-900 text-body-lg mt-0.5">{conclaveSyncData?.captainName || 'Unknown'}</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-[9.5px] font-black text-zinc-400 uppercase tracking-widest">Location</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4.5 h-4.5 text-brand-red shrink-0" />
                  <p className="font-black text-zinc-900 text-body-lg truncate">{conclaveSyncData?.conclaveStatus?.venue || 'TBD Venue'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown Timer Area */}
          <div className="p-8 lg:w-1/3 bg-zinc-50 flex flex-col items-center justify-center text-center select-none">
            <div className="relative mb-6">
              <svg className="w-48 h-48">
                <circle
                  className="text-zinc-200"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                <circle
                  className="text-brand-red progress-ring__circle"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r={radius}
                  stroke="currentColor"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="8"
                ></circle>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-zinc-950 tracking-tighter leading-none">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[9px] text-zinc-450 font-black uppercase tracking-widest mt-1">
                  Minutes left
                </span>
              </div>
            </div>

            <div className="w-full max-w-[200px]">
              <div className="flex justify-between text-[9px] font-black text-zinc-450 mb-1.5">
                <span>ROUND PROGRESS</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden border border-zinc-200/40">
                <div className="bg-brand-red h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Bento Grid Layout (Strategy Circle & Agenda) */}
      <div className="grid grid-cols-12 gap-6 items-start">

        {/* Left Column: Group List & Agenda (Takes 8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Strategy Circle Members */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs p-6 space-y-4">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-body-md font-black text-zinc-900 leading-tight">Your Networking Group</h2>
                <p className="text-[11px] text-zinc-450 font-semibold mt-0.5">Table {conclaveSyncData?.tableNumber || 'N/A'} Strategy Circle</p>
              </div>
              <span className="px-2 py-0.5 bg-zinc-50 border border-zinc-250/60 text-zinc-550 text-[10px] font-black rounded uppercase tracking-wider">
                {conclaveSyncData?.tableOccupants?.length || 0} Members
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOccupants.map((member) => {
                const initials = member.name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'M';
                return (
                  <div
                    key={member.uid}
                    onClick={() => setSelectedProfileMember(member)}
                    className="p-4 border border-zinc-200/85 hover:border-brand-red/40 rounded-xl transition-smooth group bg-white flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-xs text-zinc-500 shrink-0 transition-colors select-none">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[12.5px] font-black text-zinc-850 transition-smooth truncate leading-tight">
                          {member.name}
                        </h3>
                        <span className="inline-block px-1.5 py-0.5 bg-zinc-100 border border-zinc-200/50 text-zinc-500 text-[8.5px] font-black rounded uppercase tracking-wide mt-1.5">
                          {member.category}
                        </span>
                        <p className="text-[11px] text-zinc-805 font-extrabold mt-2.5 truncate leading-tight">
                          {member.company}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-semibold truncate leading-none mt-1">
                          {member.chapter}
                        </p>
                        <div className="flex gap-2 mt-2.5 pt-2 border-t border-zinc-100 text-[9px] font-bold text-zinc-400">
                          <span>Sent: <span className="text-zinc-700">{getMemberReferralCount(member.name, member.uid).given}</span></span>
                          <span>•</span>
                          <span>Recv: <span className="text-zinc-700">{getMemberReferralCount(member.name, member.uid).received}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Refer button */}
                    {member.uid !== (loggedInMember?.uid || loggedInMember?.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReferTarget({
                            id: member.uid,
                            name: member.name,
                            company: member.company,
                            category: member.category
                          });
                        }}
                        className="mt-4 w-full py-1.5 border border-zinc-200 hover:border-brand-red text-zinc-650 hover:text-brand-red bg-zinc-50/50 hover:bg-red-50/5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer font-black"
                      >
                        Send Referral
                      </button>
                    )}
                  </div>
                );
              })}
              {(!conclaveSyncData?.tableOccupants || conclaveSyncData.tableOccupants.length === 0) && (
                <p className="col-span-3 p-8 text-center text-zinc-400 text-caption font-semibold">No members seated at your table in this round.</p>
              )}
            </div>
          </div>

          {/* What to do in the round: Agenda */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs p-6 space-y-4">
            <div>
              <h2 className="text-body-md font-black text-zinc-900 leading-tight">Your Round Agenda &amp; Guide</h2>
              <p className="text-[11px] text-zinc-450 font-semibold mt-0.5">What you should focus on during this 45-minute seating session</p>
            </div>

            <div className="relative border-l border-zinc-200 pl-4 ml-2.5 space-y-6 pt-1">
              {agendaSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Bullet timeline circle */}
                  <span className={`absolute -left-6.5 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${step.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : idx === 2 // Active Match step
                        ? 'bg-brand-red border-brand-red text-white'
                        : 'bg-white border-zinc-300'
                    }`}>
                    {step.completed ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${idx === 2 ? 'bg-white animate-pulse' : 'bg-transparent'}`}></span>
                    )}
                  </span>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded leading-none ${step.completed
                          ? 'bg-emerald-50 text-emerald-700'
                          : idx === 2
                            ? 'bg-red-50 text-brand-red animate-pulse'
                            : 'bg-zinc-100 text-zinc-450'
                        }`}>
                        {step.time}
                      </span>
                      <h4 className="text-[12.5px] font-black text-zinc-800 leading-tight">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-[11.5px] text-zinc-500 font-semibold leading-relaxed pt-1.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>



        </div>        {/* Right Column: Captain detail & Next Round preview (Takes 4 cols) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">

          {/* Captain Detail Card */}
          {(() => {
            const captainName = conclaveSyncData?.captainName || 'Table Captain';
            const captainObj = conclaveSyncData?.tableOccupants?.find(o => o.isCaptain);
            const captainInitials = captainName.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'TC';
            const captainCategory = captainObj?.category || 'Table Captain';

            return (
              <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-sm text-zinc-600 shrink-0 shadow-inner select-none">
                      {captainInitials}
                    </div>
                    <span className="px-2 py-0.5 bg-brand-red text-white text-[8px] font-black rounded uppercase tracking-wider">
                      CAPTAIN
                    </span>
                  </div>
                  <h2 className="text-body-md font-black text-zinc-900 leading-tight">{captainName}</h2>
                  <p className="text-[11.5px] text-brand-red font-black uppercase mt-1">{captainCategory}</p>
                  <p className="text-[11px] text-zinc-450 italic font-semibold mt-3.5 leading-relaxed">
                    "Anchoring Table {conclaveSyncData?.tableNumber || 'N/A'} for Round {conclaveSyncData?.conclaveStatus?.currentRound || 1}."
                  </p>
                  <div className="flex items-center gap-4 text-zinc-450 font-extrabold text-[9px] uppercase tracking-wider pt-5 mt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-zinc-455" />
                      <span>Table Anchor</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-455" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Next Round Preview Card */}
          {(() => {
            const currentR = conclaveSyncData?.conclaveStatus?.currentRound || 1;
            const nextRoundObj = conclaveSyncData?.mySchedule?.find(s => s.number === currentR + 1);

            if (!nextRoundObj) {
              return (
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs text-center">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">SESSION STATUS</span>
                  <p className="text-xs font-bold text-zinc-700">Final Round In Progress</p>
                </div>
              );
            }

            const nextCapName = nextRoundObj.captain || 'Upcoming Captain';
            const nextCapInitials = nextCapName.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'TC';

            return (
              <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden">
                <div className="p-4 bg-zinc-50 border-b border-zinc-200/80 flex justify-between items-center">
                  <span className="text-[9px] font-black text-zinc-450 uppercase tracking-widest">UP NEXT</span>
                  <span className="text-[9.5px] font-bold text-zinc-450 tracking-tight">{nextRoundObj.time}</span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-10 h-10 bg-red-50/50 rounded-full flex items-center justify-center text-brand-red border border-red-100 font-black text-body-sm shrink-0">
                      {nextRoundObj.tableNumber}
                    </div>
                    <div>
                      <h3 className="text-[12.5px] font-black text-zinc-900 leading-snug">Round {nextRoundObj.number} Seating: {nextRoundObj.table}</h3>
                      <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">{nextRoundObj.participants?.length || 0} co-attendees</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-[10px] text-zinc-500 shrink-0 shadow-inner select-none">
                      {nextCapInitials}
                    </div>
                    <div>
                      <p className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-widest">Upcoming Captain</p>
                      <p className="text-[12px] font-black text-zinc-900 mt-0.5 leading-none">{nextCapName}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Business Diversity Summary tags */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3.5 shadow-2xs">
            <h3 className="text-[9.5px] font-black text-zinc-450 uppercase tracking-widest block">
              Table Business Diversity
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {Array.from(new Set((conclaveSyncData?.tableOccupants || []).map(o => o.category).filter(Boolean))).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[10.5px] text-zinc-650 font-bold flex items-center gap-1.5 shadow-2xs hover:border-brand-red/35 transition-smooth"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                  {tag}
                </span>
              ))}
              {(!conclaveSyncData?.tableOccupants || conclaveSyncData.tableOccupants.length === 0) && (
                <span className="text-[11px] text-zinc-400 font-semibold">No category data</span>
              )}
            </div>
          </div>

        </aside>
      </div>

      {selectedProfileMember && (
        <MemberProfileModal
          member={selectedProfileMember}
          onClose={() => setSelectedProfileMember(null)}
          onSendReferral={(m) => setReferTarget({
            id: m.uid || m.id,
            name: m.name,
            company: m.company,
            category: m.category
          })}
        />
      )}

      {referTarget && (
        <ReferModal
          recipient={referTarget}
          loggedInUser={loggedInMember || { name: memberName }}
          activeConclaveId={conclaveSyncData?.conclaveStatus?.id || conclaveSyncData?.conclaveId || conclaveSyncData?.id}
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
