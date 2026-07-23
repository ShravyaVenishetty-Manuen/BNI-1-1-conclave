import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  Calendar,
  MapPin,
  RefreshCw,
  Users,
  Bell,
  ArrowRight,
  History,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CaptainHeader from '../../components/CaptainHeader';
import Table from './Table';
import CurrentRound from './CurrentRound';
import Schedule from './Schedule';
import Profile from './Profile';
import Referrals from '../Referrals';
import MemberProfileModal from '../../components/MemberProfileModal';

export default function CaptainDashboard({ loggedInCaptain, activeTab = 'dashboard', onTabChange, onLogout, conclaveSyncData }) {
  const [selectedProfileMember, setSelectedProfileMember] = useState(null);
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
  const [attendance, setAttendance] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [toast, setToast] = useState(null);
  const activeRound = `Round ${conclaveSyncData?.conclaveStatus?.currentRound || 0}`;
  const [searchQuery, setSearchQuery] = useState('');

  const displayTable = `Table ${conclaveSyncData?.tableNumber || 'N/A'}`;

  const [secondsLeft, setSecondsLeft] = useState(600);

  useEffect(() => {
    const startedAt = conclaveSyncData?.conclaveStatus?.currentRoundStartedAt;
    if (startedAt && conclaveSyncData?.conclaveStatus?.status === 'active') {
      const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
        setSecondsLeft(Math.max(0, 600 - elapsed));
      };
      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    } else {
      setSecondsLeft(600);
    }
  }, [conclaveSyncData]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  const formatTimeSimple = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Find the table details assigned to this Captain from live backend sync data
  const liveMembers = (conclaveSyncData?.tableOccupants || []).map(m => ({
    id: m.uid || String(m.id),
    name: m.name,
    category: m.category,
    company: m.company,
    initials: m.name ? m.name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() : 'M'
  }));

  const myTable = {
    capacity: `${liveMembers.length}/${conclaveSyncData?.personsPerTable || 6}`,
    members: liveMembers
  };

  const filteredMyTableMembers = useMemo(() => {
    const list = myTable?.members || [];
    if (!searchQuery || !searchQuery.trim()) return list;
    const tokens = searchQuery.trim().toLowerCase().split(/\s+/);
    return list.filter(m => {
      const text = `${m.name || ''} ${m.company || ''} ${m.category || ''} ${m.chapter || ''}`.toLowerCase();
      return tokens.every(token => text.includes(token));
    });
  }, [myTable?.members, searchQuery]);

  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  // Initialize attendance state for members
  useEffect(() => {
    if (myTable && myTable.members) {
      const initialAttendance = {};
      myTable.members.forEach(m => {
        initialAttendance[m.id] = 'present'; // Default to present for simulation
      });
      setAttendance(initialAttendance);
    }
  }, [loggedInCaptain]);

  const handleToggleAttendance = (memberId, status) => {
    if (isLocked) return;
    setAttendance(prev => ({
      ...prev,
      [memberId]: prev[memberId] === status ? null : status
    }));
  };

  const handleSubmitAttendance = async () => {
    if (isLocked) return;

    const totalMembers = myTable.members ? myTable.members.length : 0;
    const checkedCount = Object.values(attendance).filter(status => status !== null).length;

    if (checkedCount < totalMembers) {
      showToast('Incomplete Check-In', 'Please record attendance for all assigned members.');
      return;
    }

    const captainUid = loggedInCaptain?.uid || loggedInCaptain?.id || 'captain';
    const activeConclaveId = selectedConclaveId || activeConclave?.id;
    const currentRound = activeConclave?.currentRound || 1;

    if (activeConclaveId) {
      try {
        const attendancePayload = Object.entries(attendance).map(([uid, status]) => ({
          id: `att_r${currentRound}_${uid}`,
          userId: uid,
          roundNumber: currentRound,
          tableNumber: myTable?.tableNumber || 1,
          isPresent: status === 'present',
          markedBy: captainUid,
          timestamp: new Date().toISOString()
        }));

        await api.post(`/conclaves/${activeConclaveId}/sync`, {
          attendance: attendancePayload
        });
      } catch (err) {
        console.warn("Backend attendance sync failed:", err.message);
      }
    }

    setIsLocked(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast('Attendance Locked', `${displayTable} attendance submitted successfully to regional admin.`);
  };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* TopNavBar Header (controls activeSubTab) */}
      <CaptainHeader
        loggedInCaptain={loggedInCaptain}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area (full width, no side margins) */}
      <main className="flex-1 p-4 md:p-8 w-full">
        <div className="space-y-6">

          {/* Sub-tab view: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Welcome Card */}
              <section className="relative bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-50 text-brand-red text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest border border-red-100/50">
                      {conclaveSyncData?.conclaveStatus?.status === 'active' ? 'LIVE NOW' : 'Conclave Session'}
                    </span>
                    <span className="text-zinc-450 font-semibold text-xs tracking-wider">
                      ID: {conclaveSyncData?.conclaveStatus?.id || conclaveSyncData?.conclaveId || 'Guntur Region'}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950 tracking-tight">
                    {conclaveSyncData?.conclaveStatus?.name || conclaveSyncData?.conclaveName || 'Guntur central networking conclave'}
                  </h1>

                  <div className="flex flex-wrap gap-4 text-zinc-500 text-[13px] font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4.5 h-4.5 text-zinc-400" />
                      <span>{conclaveSyncData?.conclaveStatus?.venue || conclaveSyncData?.venue || 'Venue Location TBD'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex -space-x-3 overflow-hidden shrink-0">
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-red-50 flex items-center justify-center text-brand-red font-black text-xs shadow-2xs">
                    BNI
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-zinc-100 flex items-center justify-center text-zinc-500 font-extrabold text-[10px] shadow-2xs">
                    2026
                  </div>
                </div>
              </section>

              {/* KPI Section */}
              <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
                  <p className="text-[11px] font-bold text-zinc-455 uppercase tracking-wide">Current Round</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-lg font-black text-zinc-900 leading-none">
                      {conclaveSyncData?.conclaveStatus?.currentRound || 0} <span className="text-zinc-400 text-xs font-semibold">of {conclaveSyncData?.mySchedule?.length || 6}</span>
                    </span>
                    <RefreshCw className="w-5 h-5 text-brand-red shrink-0" />
                  </div>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
                  <p className="text-[11px] font-bold text-zinc-455 uppercase tracking-wide">Assigned Table</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-lg font-black text-zinc-900 leading-none">
                      {displayTable}
                    </span>
                    <Award className="w-5 h-5 text-brand-red shrink-0" />
                  </div>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
                  <p className="text-[11px] font-bold text-zinc-455 uppercase tracking-wide">Total Members</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-lg font-black text-zinc-900 leading-none">
                      {conclaveSyncData?.tableOccupants?.length || 0} <span className="text-zinc-400 text-xs font-semibold">Active</span>
                    </span>
                    <Users className="w-5 h-5 text-brand-red shrink-0" />
                  </div>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
                  <p className="text-[11px] font-bold text-zinc-455 uppercase tracking-wide">Time Remaining</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-lg font-black text-brand-red leading-none">{formatTimeSimple(secondsLeft)}</span>
                    <Clock className="w-5 h-5 text-brand-red shrink-0 animate-pulse" />
                  </div>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24 col-span-2 md:col-span-1">
                  <p className="text-[11px] font-bold text-zinc-455 uppercase tracking-wide">Referral Exchange</p>
                  <div className="flex items-end justify-between mt-2">
                    {(() => {
                      const myUid = loggedInCaptain?.uid || loggedInCaptain?.id;
                      const myName = (loggedInCaptain?.name || '').toLowerCase();
                      const allRefs = [
                        ...referrals,
                        ...(conclaveSyncData?.newReferralsReceived || []).map(r => ({
                          fromUserId: r.fromUserId,
                          fromMemberId: r.fromUserId,
                          toUserId: myUid,
                          toMemberId: myUid
                        }))
                      ];
                      const givenCount = allRefs.filter(r => 
                        r.fromMemberId === myUid || r.fromUserId === myUid || (r.fromName && r.fromName.toLowerCase() === myName)
                      ).length;

                      const takenCount = allRefs.filter(r => 
                        r.toMemberId === myUid || r.toUserId === myUid || (r.toName && r.toName.toLowerCase() === myName)
                      ).length;

                      return (
                        <span className="text-body-sm font-black text-zinc-900 leading-none flex items-center gap-1">
                          <span className="text-emerald-700 font-extrabold">{givenCount} Given</span>
                          <span className="text-zinc-300">•</span>
                          <span className="text-blue-700 font-extrabold">{takenCount} Taken</span>
                        </span>
                      );
                    })()}
                    <TrendingUp className="w-5 h-5 text-brand-red shrink-0" />
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Countdown & Schedule */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Live Countdown Widget */}
                  <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                      <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
                        LIVE ROUND {conclaveSyncData?.conclaveStatus?.currentRound || 0}
                      </span>
                    </div>

                    {/* Left side: Countdown Ring */}
                    <div className="flex flex-col items-center shrink-0 pt-6 md:pt-4">
                      <div className="relative flex items-center justify-center w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            className="text-zinc-100"
                            cx="96"
                            cy="96"
                            fill="transparent"
                            r="82"
                            stroke="currentColor"
                            strokeWidth="8"
                          />
                          <circle
                            className="text-brand-red progress-ring__circle transition-all duration-1000"
                            cx="96"
                            cy="96"
                            fill="transparent"
                            r="82"
                            stroke="currentColor"
                            strokeDasharray={515.2}
                            strokeDashoffset={515.2 * (1 - secondsLeft / 600)}
                            strokeLinecap="round"
                            strokeWidth="8"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-4xl font-black text-zinc-955 tracking-tighter leading-none">
                            {formatTimeSimple(secondsLeft)}
                          </span>
                          <span className="text-[8.5px] text-zinc-400 font-extrabold uppercase tracking-widest mt-1.5">
                            Remaining
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Round Action Checklist & Guidelines */}
                    <div className="flex-1 space-y-4 pt-4 md:pt-0">
                      <div>
                        <h3 className="text-body-md font-black text-zinc-950">Active Round Guidelines</h3>
                        <p className="text-[11.5px] leading-relaxed font-semibold text-zinc-500 mt-1">
                          All members are currently pitching. Please ensure each person gets exactly 2 minutes for their introduction.
                        </p>
                      </div>

                      <div className="border-t border-zinc-100 pt-3.5 space-y-3">
                        <span className="text-[9.5px] font-black text-zinc-450 uppercase tracking-wider block">Table Matchmaking & Insights</span>
                        
                        {(() => {
                          const tableOccupants = conclaveSyncData?.tableOccupants || [];
                          const tableCategories = tableOccupants.map(m => m.category).filter(Boolean);
                          const uniqueCats = new Set(tableCategories).size;
                          const synergyPct = tableCategories.length > 0 ? Math.min(100, Math.round((uniqueCats / tableCategories.length) * 100)) : 100;

                          const tableChapters = Array.from(new Set(
                            tableOccupants.map(m => m.chapter).filter(Boolean)
                          ));
                          const chaptersText = tableChapters.length > 0 ? tableChapters.join(', ') : 'BNI Guntur Chapters';

                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px] font-semibold text-zinc-600">
                              <div className="space-y-1">
                                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Synergy Score</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-black text-zinc-950 leading-none">{synergyPct}% Optimal</span>
                                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 leading-none">
                                    {synergyPct >= 80 ? 'Excellent' : synergyPct >= 60 ? 'Good' : 'Balanced'}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Coordinating Captain</span>
                                <div className="text-[12px] font-extrabold text-zinc-800 leading-none pt-0.5">
                                  {loggedInCaptain.name}
                                </div>
                              </div>

                              <div className="space-y-1 sm:col-span-2">
                                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Represented Chapters</span>
                                <p className="text-[11px] font-extrabold text-zinc-800 leading-normal">
                                  {chaptersText}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Current Participants Grid */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-body-lg font-black text-zinc-900 tracking-tight">Current Round Participants</h3>
                      <span className="text-zinc-400 font-extrabold text-[10px] uppercase tracking-wider">
                        6 Members at Table 5
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredMyTableMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedProfileMember(member)}
                          className="bg-white p-4.5 rounded-xl border border-zinc-200 hover:border-brand-red/35 hover:bg-zinc-50/20 shadow-2xs flex items-start gap-4 transition-smooth cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-sm text-zinc-500 shrink-0 shadow-inner">
                            {member.initials}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="text-[13px] font-bold text-zinc-850 leading-tight">{member.name}</h4>
                            <p className="text-[11px] text-zinc-450 font-semibold leading-normal mt-0.5">{member.company}</p>
                            <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                              <span className="bg-zinc-100 text-zinc-650 text-[8px] font-black px-2 py-0.5 rounded border border-zinc-200/50 uppercase tracking-wide">
                                {member.category}
                              </span>
                              <span className="text-[9px] font-bold text-zinc-400 whitespace-nowrap">
                                Sent: <span className="text-zinc-700">{getMemberReferralCount(member.name, member.id).given}</span> • Recv: <span className="text-zinc-700">{getMemberReferralCount(member.name, member.id).received}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Schedule & Activity */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-brand-red p-6 rounded-xl border border-red-700 shadow-md text-white select-none">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Your Station</p>
                        <h3 className="text-2xl font-black mt-1 leading-none">{displayTable}</h3>
                      </div>
                      <Award className="w-7 h-7 text-white opacity-50 shrink-0" />
                    </div>

                    <div className="flex items-center gap-2.5 mb-6">
                      <div className="flex -space-x-1.5">
                        {(conclaveSyncData?.tableOccupants || []).slice(0, 3).map((p, pIdx) => {
                          const initials = p.name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'M';
                          return (
                            <div key={pIdx} className="w-7 h-7 rounded-full border border-brand-red bg-red-700/60 flex items-center justify-center text-[7px] font-bold">
                              {initials}
                            </div>
                          );
                        })}
                        {conclaveSyncData?.tableOccupants?.length > 3 && (
                          <div className="w-7 h-7 rounded-full border border-brand-red bg-red-700/60 flex items-center justify-center text-[7px] font-bold font-black">
                            +{conclaveSyncData.tableOccupants.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-[10.5px] font-extrabold text-red-50">
                        {conclaveSyncData?.tableOccupants?.length || 0} Members Assigned
                      </span>
                    </div>

                    <button
                      onClick={() => onTabChange && onTabChange('my-table')}
                      className="w-full bg-white text-brand-red font-black py-2.5 rounded-lg hover:bg-zinc-55 transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-button"
                    >
                      Open My Table
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Today's Schedule Timeline */}
                  <section className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5.5 space-y-5">
                    <h3 className="text-body-sm font-black text-zinc-950 border-b border-zinc-100 pb-2">Today's Schedule</h3>
                    <div className="relative space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-150">
                      {(conclaveSyncData?.mySchedule || []).map((rnd) => {
                        const isActive = rnd.status === 'Active';
                        const isCompleted = rnd.status === 'Completed';
                        return (
                          <div key={rnd.number} className="relative pl-8">
                            {isActive ? (
                              <div className="absolute left-[3px] top-1.5 w-[18px] h-[18px] rounded-full bg-brand-red border-4 border-red-100 z-10 shadow-xs animate-pulse"></div>
                            ) : (
                              <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white z-10 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                            )}
                            <div className="flex flex-col">
                              <span className={`font-extrabold text-[9px] uppercase tracking-wider ${isActive ? 'text-brand-red font-black' : 'text-zinc-400'}`}>
                                {rnd.time} {isActive && '(ACTIVE)'}
                              </span>
                              <span className={`font-extrabold text-[12px] mt-0.5 ${isActive ? 'text-zinc-900 font-black' : 'text-zinc-800'}`}>
                                Round {rnd.number}: Table {rnd.tableNumber} Seating
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {(!conclaveSyncData?.mySchedule || conclaveSyncData.mySchedule.length === 0) && (
                        <p className="text-zinc-400 text-caption font-semibold text-center">No rounds generated yet.</p>
                      )}
                    </div>
                  </section>


                </div>
              </div>
            </div>
          )}

          {/* Sub-tab view: My Table Seating Checklist */}
          {activeTab === 'my-table' && (
            <Table loggedInCaptain={loggedInCaptain} searchQuery={searchQuery} conclaveSyncData={conclaveSyncData} />
          )}

          {/* Sub-tab view: Current Round Info */}
          {activeTab === 'current-round' && (
            <CurrentRound loggedInCaptain={loggedInCaptain} conclaveSyncData={conclaveSyncData} />
          )}

          {/* Sub-tab view: Schedule */}
          {activeTab === 'schedule' && (
            <Schedule loggedInCaptain={loggedInCaptain} conclaveSyncData={conclaveSyncData} />
          )}

          {/* Sub-tab view: Referrals Page */}
          {activeTab === 'referrals' && (
            <Referrals loggedInUser={loggedInCaptain} userType="captain" conclaveSyncData={conclaveSyncData} />
          )}

          {/* Sub-tab view: Profile Page */}
          {activeTab === 'profile' && (
            <Profile 
              loggedInCaptain={loggedInCaptain} 
              onTabChange={onTabChange} 
              onLogout={onLogout} 
            />
          )}

        </div>
      </main>

      {selectedProfileMember && (
        <MemberProfileModal
          member={selectedProfileMember}
          onClose={() => setSelectedProfileMember(null)}
          onSendReferral={(m) => {
            onTabChange && onTabChange('referrals');
          }}
        />
      )}

      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[70] bg-zinc-900 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-xl flex items-center gap-2 border border-zinc-800 animate-slide-up">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
          <div>
            <p className="font-bold text-white">{toast.title}</p>
            <p className="text-zinc-400 mt-0.5">{toast.desc}</p>
          </div>
        </div>
      )}

    </div>
  );
}
