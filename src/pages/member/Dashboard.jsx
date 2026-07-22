import React, { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  Layers,
  Info,
  Calendar,
  CheckCircle,
  ArrowRight,
  Activity,
  Building2
} from 'lucide-react';

import ReferModal from '../../components/ReferModal';
import MemberProfileModal from '../../components/MemberProfileModal';

export default function MemberDashboard({ loggedInMember, onTabChange, conclaveSyncData }) {
  const [referTarget, setReferTarget] = useState(null);
  const [selectedProfileMember, setSelectedProfileMember] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState(600);
  const initialTime = 600; // 10 mins total round duration

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

  const memberName = loggedInMember?.name || 'Member';
  const memberChapter = loggedInMember?.chapter || 'N/A';
  const memberCompany = loggedInMember?.company || 'N/A';
  const memberCategory = loggedInMember?.category || 'N/A';

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">

      {/* Hero Section */}
      <div className="grid grid-cols-12 gap-6">

        {/* Left: Welcome & Status Card (Takes 8 cols on large screens, stacks on tablets/mobile) */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 md:p-8 rounded-xl shadow-2xs border border-zinc-200 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#af101a_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-150 shadow-2xs">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              LIVE ROUND {conclaveSyncData?.conclaveStatus?.currentRound || 0}
            </span>
          </div>

          <div className="space-y-4">
            {/* Conclave name banner — shows which conclave data is being loaded from backend */}
            {conclaveSyncData?.conclaveStatus?.title && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                  {conclaveSyncData.conclaveStatus.title}
                </span>
                {conclaveSyncData.conclaveStatus.venue && (
                  <>
                    <span className="text-blue-300">•</span>
                    <span className="text-[10px] font-semibold text-blue-500">
                      {conclaveSyncData.conclaveStatus.venue}
                    </span>
                  </>
                )}
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-zinc-955 tracking-tight">Welcome {memberName}</h1>
              <p className="text-xs font-semibold text-zinc-450 mt-1">{memberCompany} • {memberChapter}</p>
            </div>

            <div className="flex flex-wrap gap-6 items-center pt-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Active Session</span>
                <span className="text-lg font-black text-zinc-900 mt-0.5">Round {conclaveSyncData?.conclaveStatus?.currentRound || 0} of {conclaveSyncData?.mySchedule?.length || 6}</span>
              </div>
              <div className="w-px h-8 bg-zinc-200"></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Assigned Table</span>
                <span className="text-lg font-black text-zinc-900 mt-0.5">Table {conclaveSyncData?.tableNumber || 'N/A'}</span>
              </div>
              <div className="w-px h-8 bg-zinc-200"></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Niche / Category</span>
                <span className="px-2 py-0.5 bg-red-50 border border-red-100 text-brand-red text-[9px] font-black rounded uppercase mt-1">
                  {memberCategory}
                </span>
              </div>
              <div className="w-px h-8 bg-zinc-200"></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Referral Exchange</span>
                {(() => {
                  const myUid = loggedInMember?.uid || loggedInMember?.id;
                  const myName = (loggedInMember?.name || '').toLowerCase();
                  const allRefs = [
                    ...referrals,
                    ...(conclaveSyncData?.newReferralsReceived || []).map(r => ({
                      fromUserId: r.fromUserId,
                      fromMemberId: r.fromUserId,
                      toUserId: myUid,
                      toMemberId: myUid
                    }))
                  ];

                  const sentCount = allRefs.filter(r =>
                    r.fromMemberId === myUid || r.fromUserId === myUid || (r.fromName && r.fromName.toLowerCase() === myName)
                  ).length;

                  const recvCount = allRefs.filter(r =>
                    r.toMemberId === myUid || r.toUserId === myUid || (r.toName && r.toName.toLowerCase() === myName)
                  ).length;

                  return (
                    <span className="text-body-sm font-extrabold text-zinc-850 mt-1 select-none flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9.5px] font-bold">
                        {sentCount} Sent
                      </span>
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9.5px] font-bold">
                        {recvCount} Recv
                      </span>
                    </span>
                  );
                })()}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Time Remaining</span>
                  <span className="text-2xl font-black text-brand-red mt-0.5 tracking-tighter leading-none">{formatTime(timeLeft)}</span>
                </div>
                <span className="text-[9.5px] font-bold text-zinc-450">
                  {Math.floor(((600 - timeLeft) / 600) * 100)}% Completed
                </span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                <div
                  className="bg-brand-red h-full rounded-full transition-all duration-1000 ease-out shadow-inner"
                  style={{ width: `${(timeLeft / 600) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t border-zinc-100 mt-6">
            <button
              onClick={() => onTabChange && onTabChange('current-round')}
              className="bg-brand-red hover:bg-red-750 text-white text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-lg transition-smooth flex items-center gap-1.5 cursor-pointer shadow-sm shadow-brand-red/10"
            >
              View Current Round
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onTabChange && onTabChange('my-schedule')}
              className="bg-white hover:bg-zinc-50 border border-zinc-250 text-zinc-700 text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-lg transition-smooth cursor-pointer"
            >
              View Full Schedule
            </button>
          </div>
        </div>

        {/* Right: Table Info Card (Takes 4 cols on large screens, stacks on smaller screens) */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-2xs border border-zinc-200 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="font-black text-zinc-900 text-body-sm mb-4">Table {conclaveSyncData?.tableNumber || 'N/A'} Intelligence</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-brand-red" />
                  <span className="text-xs text-zinc-650 font-semibold">Total Seated Members</span>
                </div>
                <span className="font-extrabold text-zinc-900 text-body-sm">
                  {conclaveSyncData?.tableOccupants?.length || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-brand-red" />
                  <span className="text-xs text-zinc-650 font-semibold">Unique Niches</span>
                </div>
                <span className="font-extrabold text-zinc-900 text-body-sm">
                  {new Set(conclaveSyncData?.tableOccupants?.map(o => o.category)).size}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2.5">Networking In Progress</span>
              <div className="flex -space-x-2.5 overflow-hidden">
                {(conclaveSyncData?.tableOccupants || []).map((m, idx) => {
                  const initials = m.name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'M';
                  return (
                    <div
                      key={idx}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 border-2 border-white font-bold text-[10.5px] text-zinc-550 shadow-inner select-none"
                      title={m.name}
                    >
                      {initials}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-5 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-650 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-zinc-500 font-semibold">
              No cross-chapter business overlaps detected in this round. High potential for external referrals.
            </p>
          </div>
        </div>
      </div>

      {/* Today's Schedule Timeline Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-zinc-900 text-body-md">Today's Schedule</h2>
            {conclaveSyncData?.conclaveStatus?.title && (
              <p className="text-[9.5px] text-zinc-400 font-semibold mt-0.5">
                Conclave: <span className="text-zinc-600 font-bold">{conclaveSyncData.conclaveStatus.title}</span>
              </p>
            )}
          </div>
          <span
            onClick={() => onTabChange && onTabChange('my-schedule')}
            className="text-brand-red font-black text-[10.5px] uppercase tracking-wider hover:underline cursor-pointer"
          >
            View Detailed Plan
          </span>
        </div>

        <div className="flex overflow-x-auto gap-4 pt-3.5 pb-2 scrollbar-none select-none -mt-3.5">
          {(conclaveSyncData?.mySchedule || []).map((round) => {
            const isCompleted = round.status === 'Completed';
            const isActive = round.status === 'Active';

            return (
              <div
                key={round.number}
                className={`min-w-[220px] flex-shrink-0 p-4.5 rounded-xl border flex flex-col justify-between relative ${isActive
                  ? 'border-2 border-brand-red bg-white shadow-sm'
                  : isCompleted
                  ? 'border-zinc-200 bg-zinc-50/50 opacity-60'
                  : 'border-zinc-200 bg-white'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2.5 left-4 bg-brand-red text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-white">
                    CURRENT
                  </span>
                )}
                <div>
                  <span className={`text-[9px] font-bold block ${isActive ? 'text-brand-red' : 'text-zinc-400'}`}>
                    {round.time}
                  </span>
                  <h4 className="font-black text-zinc-900 text-[13.5px] mt-1">Round {round.number} Seating</h4>
                  <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">{round.table} • Captain: {round.captain.split(' ')[0]}</p>
                </div>
                
                {isActive ? (
                  <div className="flex items-center gap-1.5 text-brand-red font-black text-[9px] uppercase tracking-wider mt-3.5 animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(timeLeft)} Left</span>
                  </div>
                ) : isCompleted ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-wider mt-3">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-zinc-400 font-black text-[9px] uppercase tracking-wider mt-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Upcoming</span>
                  </div>
                )}
              </div>
            );
          })}
          {(!conclaveSyncData?.mySchedule || conclaveSyncData.mySchedule.length === 0) && (
            <p className="p-4 text-center text-zinc-400 text-caption font-semibold">No schedule has been generated yet for this conclave.</p>
          )}
        </div>
      </section>

      {/* Grid: Table Members & Sidebar Previews */}
      <div className="grid grid-cols-12 gap-6 items-start">

        {/* Left Column: Current Table Members (Takes 8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-zinc-900 text-body-md">
              Current Table Members <span className="text-zinc-400 font-normal">(Table {conclaveSyncData?.tableNumber || 'N/A'})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(conclaveSyncData?.tableOccupants || []).map((member) => {
              const initials = member.name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'M';
              return (
                <div
                  key={member.uid}
                  onClick={() => setSelectedProfileMember(member)}
                  className={`p-4 rounded-xl border transition-smooth group cursor-pointer hover:border-brand-red/40 ${member.isCaptain
                    ? 'bg-red-50/20 border-brand-red/30 shadow-2xs relative'
                    : 'bg-white border-zinc-200 shadow-2xs'
                    }`}
                >
                  {member.isCaptain && (
                    <span className="absolute top-2 right-2 bg-brand-red text-white text-[7.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Captain
                    </span>
                  )}

                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center font-bold text-xs shrink-0 select-none ${member.isCaptain
                      ? 'border-brand-red bg-red-100 text-brand-red'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-500 transition-colors'
                      }`}>
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[12.5px] font-black text-zinc-850 truncate transition-smooth leading-tight">
                          {member.name}
                        </h4>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 bg-zinc-100 border border-zinc-200/50 text-zinc-500 text-[8.5px] font-black rounded uppercase tracking-wide mt-1.5">
                        {member.category}
                      </span>
                      <p className="text-[11px] text-zinc-800 font-extrabold mt-2 truncate leading-tight">
                        {member.company}
                      </p>
                      <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-100 text-[9px] font-bold text-zinc-400">
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
                      className="mt-4 w-full py-1.5 border border-zinc-200 hover:border-brand-red text-zinc-650 hover:text-brand-red bg-zinc-50/50 hover:bg-red-50/5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer font-bold font-black"
                    >
                      Send Referral
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Previews & Announcements (Takes 4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Next Round Card */}
          {conclaveSyncData?.mySchedule?.find(s => s.number === (conclaveSyncData?.conclaveStatus?.currentRound || 1) + 1) && (() => {
            const nextRoundSeating = conclaveSyncData.mySchedule.find(s => s.number === (conclaveSyncData.conclaveStatus.currentRound || 1) + 1);
            return (
              <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3 text-zinc-450">
                  <span className="text-[9px] font-black uppercase tracking-widest">Next Session Preview</span>
                  <Calendar className="w-4 h-4 text-brand-red" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-black text-zinc-900 leading-snug">Round {nextRoundSeating.number} Seating: {nextRoundSeating.table}</h4>
                  <p className="text-[10px] text-zinc-455 font-semibold mt-1">Starts at {nextRoundSeating.time.split(' - ')[0]}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-zinc-100">
                  <div className="flex -space-x-1.5">
                    {nextRoundSeating.participants.slice(0, 3).map((p, pIdx) => {
                      const initials = p.name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'M';
                      return (
                        <div key={pIdx} className="w-6 h-6 rounded-full bg-zinc-100 border border-white text-[7.5px] font-bold flex items-center justify-center" title={p.name}>
                          {initials}
                        </div>
                      );
                    })}
                  </div>
                  {nextRoundSeating.participants.length > 3 && (
                    <span className="text-[9.5px] text-zinc-455 font-extrabold ml-1">
                      +{nextRoundSeating.participants.length - 3} co-attendees
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Event Progress Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 shadow-2xs">
            <h3 className="text-[9px] font-black text-zinc-450 uppercase tracking-widest block mb-2.5">Event Seating Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <div className="flex items-center gap-1.5 text-brand-red">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="text-lg font-black tracking-tight">
                  {conclaveSyncData?.mySchedule?.length && conclaveSyncData?.conclaveStatus?.currentRound
                    ? Math.floor(((conclaveSyncData.conclaveStatus.currentRound - 1) / conclaveSyncData.mySchedule.length) * 100)
                    : 0}%
                </span>
              </div>
              <span className="text-[10px] text-zinc-455 font-bold">
                {conclaveSyncData?.conclaveStatus?.currentRound ? conclaveSyncData.conclaveStatus.currentRound - 1 : 0} of {conclaveSyncData?.mySchedule?.length || 6} rounds finished
              </span>
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-red h-full rounded-full"
                style={{
                  width: `${conclaveSyncData?.mySchedule?.length && conclaveSyncData?.conclaveStatus?.currentRound
                    ? ((conclaveSyncData.conclaveStatus.currentRound - 1) / conclaveSyncData.mySchedule.length) * 100
                    : 0}%`
                }}
              ></div>
            </div>
          </div>

        </div>
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
          loggedInUser={loggedInMember || { name: 'Member' }}
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
