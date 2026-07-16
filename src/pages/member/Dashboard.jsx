import React, { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  Layers,
  Info,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  Activity
} from 'lucide-react';

import { tableMembers } from '../../data/mockConclaveData';
import ReferModal from '../../components/ReferModal';
import membersData from '../../data/members.json';
import captainsData from '../../data/captains.json';

export default function MemberDashboard({ loggedInMember, onTabChange }) {
  const [referTarget, setReferTarget] = useState(null);
  const [toast, setToast] = useState(null);
  // Countdown timer starting at 08:42 (522 seconds)
  const [timeLeft, setTimeLeft] = useState(522);

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

  const getMemberReferralCount = (name) => {
    const match = membersData.find(m => m.name.toLowerCase() === name.toLowerCase()) || 
                  captainsData.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!match) return { given: 0, received: 0 };
    const given = referrals.filter(r => r.fromMemberId === match.id).length;
    const received = referrals.filter(r => r.toMemberId === match.id).length;
    return { given, received };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const memberName = loggedInMember?.name || 'Anjali Sharma';
  const memberChapter = loggedInMember?.chapter || 'Apex Chapter';
  const memberCompany = loggedInMember?.company || 'Sharma Ads & Media';
  const memberCategory = loggedInMember?.category || 'Marketing';

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
              LIVE ROUND 3
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-zinc-955 tracking-tight">Welcome {memberName}</h1>
              <p className="text-xs font-semibold text-zinc-450 mt-1">{memberCompany} • {memberChapter}</p>
            </div>

            <div className="flex flex-wrap gap-6 items-center pt-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Active Session</span>
                <span className="text-lg font-black text-zinc-900 mt-0.5">Round 3 of 6</span>
              </div>
              <div className="w-px h-8 bg-zinc-200"></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Assigned Table</span>
                <span className="text-lg font-black text-zinc-900 mt-0.5">Table 5</span>
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
                <span className="text-body-sm font-extrabold text-zinc-850 mt-1 select-none flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9.5px] font-bold">
                    {referrals.filter(r => r.fromMemberId === loggedInMember?.id).length} Sent
                  </span>
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9.5px] font-bold">
                    {referrals.filter(r => r.toMemberId === loggedInMember?.id).length} Recv
                  </span>
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Time Remaining</span>
                  <span className="text-2xl font-black text-brand-red mt-0.5 tracking-tighter leading-none">{formatTime(timeLeft)}</span>
                </div>
                <span className="text-[9.5px] font-bold text-zinc-450">50% Completed</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                <div
                  className="bg-brand-red h-full rounded-full transition-all duration-1000 ease-out shadow-inner"
                  style={{ width: `${(timeLeft / 1200) * 100}%` }}
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
            <h3 className="font-black text-zinc-900 text-body-sm mb-4">Table 5 Intelligence</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-brand-red" />
                  <span className="text-xs text-zinc-650 font-semibold">Total Seated Members</span>
                </div>
                <span className="font-extrabold text-zinc-900 text-body-sm">6</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-brand-red" />
                  <span className="text-xs text-zinc-650 font-semibold">Unique Niches</span>
                </div>
                <span className="font-extrabold text-zinc-900 text-body-sm">6</span>
              </div>
            </div>

            <div className="mt-5">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2.5">Networking In Progress</span>
              <div className="flex -space-x-2.5 overflow-hidden">
                {tableMembers.map((m, idx) => (
                  <div
                    key={idx}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 border-2 border-white font-bold text-[10.5px] text-zinc-550 shadow-inner select-none"
                    title={m.name}
                  >
                    {m.initials}
                  </div>
                ))}
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 border-2 border-white text-[9.5px] font-black text-brand-red shadow-inner">
                  +2
                </div>
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
          <h2 className="font-black text-zinc-900 text-body-md">Today's Schedule</h2>
          <span
            onClick={() => onTabChange && onTabChange('my-schedule')}
            className="text-brand-red font-black text-[10.5px] uppercase tracking-wider hover:underline cursor-pointer"
          >
            View Detailed Plan
          </span>
        </div>

        <div className="flex overflow-x-auto gap-4 pt-3.5 pb-2 scrollbar-none select-none -mt-3.5">
          {/* Completed Rounds */}
          <div className="min-w-[210px] flex-shrink-0 p-4.5 rounded-xl border border-zinc-200 bg-zinc-50/50 opacity-60 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 block">09:00 AM - 09:45 AM</span>
              <h4 className="font-black text-zinc-800 text-[13px] mt-1">Round 1 Seating</h4>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-wider mt-3">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
          </div>

          <div className="min-w-[210px] flex-shrink-0 p-4.5 rounded-xl border border-zinc-200 bg-zinc-50/50 opacity-60 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 block">10:00 AM - 10:45 AM</span>
              <h4 className="font-black text-zinc-800 text-[13px] mt-1">Round 2 Seating</h4>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-wider mt-3">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
          </div>

          {/* Current Active Round */}
          <div className="min-w-[230px] flex-shrink-0 p-4.5 rounded-xl border-2 border-brand-red bg-white shadow-sm relative flex flex-col justify-between">
            <span className="absolute -top-2.5 left-4 bg-brand-red text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-white">
              CURRENT
            </span>
            <div>
              <span className="text-[9px] font-bold text-brand-red block">11:00 AM - 11:45 AM</span>
              <h4 className="font-black text-zinc-900 text-[13.5px] mt-1">Round 3 Seating</h4>
              <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Table 5 • Live Discussion</p>
            </div>
            <div className="flex items-center gap-1.5 text-brand-red font-black text-[9px] uppercase tracking-wider mt-3.5 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)} Left</span>
            </div>
          </div>

          {/* Upcoming Rounds */}
          <div className="min-w-[210px] flex-shrink-0 p-4.5 rounded-xl border border-zinc-200 bg-white flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 block">12:30 PM - 01:15 PM</span>
              <h4 className="font-black text-zinc-800 text-[13px] mt-1">Round 4 Seating</h4>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 font-black text-[9px] uppercase tracking-wider mt-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Upcoming</span>
            </div>
          </div>

          <div className="min-w-[210px] flex-shrink-0 p-4.5 rounded-xl border border-zinc-200 bg-white flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 block">01:30 PM - 02:15 PM</span>
              <h4 className="font-black text-zinc-800 text-[13px] mt-1">Round 5 Seating</h4>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 font-black text-[9px] uppercase tracking-wider mt-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Upcoming</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Table Members & Sidebar Previews */}
      <div className="grid grid-cols-12 gap-6 items-start">

        {/* Left Column: Current Table Members (Takes 8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-zinc-900 text-body-md">
              Current Table Members <span className="text-zinc-400 font-normal">(Table 5)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tableMembers.map((member) => (
              <div
                key={member.name}
                className={`p-4 rounded-xl border transition-smooth group ${member.isCaptain
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
                    {member.initials}
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
                      <span>Sent: <span className="text-zinc-700">{getMemberReferralCount(member.name).given}</span></span>
                      <span>•</span>
                      <span>Recv: <span className="text-zinc-700">{getMemberReferralCount(member.name).received}</span></span>
                    </div>
                  </div>
                </div>

                {/* Refer button */}
                {member.name !== (loggedInMember?.name || 'Anjali Sharma') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReferTarget(member);
                    }}
                    className="mt-4 w-full py-1.5 border border-zinc-200 hover:border-brand-red text-zinc-650 hover:text-brand-red bg-zinc-50/50 hover:bg-red-50/5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer font-bold"
                  >
                    Send Referral
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Previews & Announcements (Takes 4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Next Round Card */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-zinc-450">
              <span className="text-[9px] font-black uppercase tracking-widest">Next Session Preview</span>
              <Calendar className="w-4 h-4 text-brand-red" />
            </div>
            <div>
              <h4 className="text-[13.5px] font-black text-zinc-900 leading-snug">Round 4 Seating: Table 12</h4>
              <p className="text-[10px] text-zinc-450 font-semibold mt-1">Starts at 12:30 PM (Post Lunch)</p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-zinc-100">
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-zinc-100 border border-white text-[7.5px] font-bold flex items-center justify-center">AS</div>
                <div className="w-6 h-6 rounded-full bg-zinc-100 border border-white text-[7.5px] font-bold flex items-center justify-center">PI</div>
                <div className="w-6 h-6 rounded-full bg-zinc-100 border border-white text-[7.5px] font-bold flex items-center justify-center">AP</div>
              </div>
              <span className="text-[9.5px] text-zinc-450 font-extrabold ml-1">+5 co-attendees</span>
            </div>
          </div>

          {/* Event Progress Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 shadow-2xs">
            <h3 className="text-[9px] font-black text-zinc-450 uppercase tracking-widest block mb-2.5">Event Seating Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <div className="flex items-center gap-1.5 text-brand-red">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="text-lg font-black tracking-tight">50%</span>
              </div>
              <span className="text-[10px] text-zinc-450 font-bold">3 of 6 rounds finished</span>
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-brand-red h-full rounded-full w-1/2"></div>
            </div>
          </div>

        </div>
      </div>

      {referTarget && (
        <ReferModal
          recipient={referTarget}
          loggedInUser={loggedInMember || { name: 'Anjali Sharma' }}
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
