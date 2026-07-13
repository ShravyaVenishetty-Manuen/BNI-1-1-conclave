import React, { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  Layers,
  Info,
  Calendar,
  CheckCircle,
  Share2,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Bell,
  Activity
} from 'lucide-react';

export default function MemberDashboard({ loggedInMember, onTabChange }) {
  // Countdown timer starting at 08:42 (522 seconds)
  const [timeLeft, setTimeLeft] = useState(522);

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

  // Static list of table members for Table 5 matching the design
  const tableMembers = [
    { name: "Sarah Jenkins", company: "Zenith Systems", category: "IT INFRASTRUCTURE", chapter: "BNI Phoenix Chapter", initials: "SJ" },
    { name: "Mark Thompson", company: "Prime Realty Group", category: "REAL ESTATE", chapter: "BNI Synergy Chapter", initials: "MT" },
    { name: "Anita Rao", company: "Spark Media", category: "DIGITAL MARKETING", chapter: "BNI Global Chapter", initials: "AR" },
    { name: "David Chen", company: "Logistics Pro", category: "SUPPLY CHAIN", chapter: "BNI Summit Chapter", initials: "DC" },
    { name: "Elena Rodriguez", company: "Rodriguez Partners", category: "LAW & LEGAL", chapter: "BNI Elite Chapter", initials: "ER" },
    { name: "Ganesh V. (Captain)", company: "WealthWise Advisors", category: "FINANCIAL PLANNING", chapter: "BNI Prosperity Chapter", initials: "GV", isCaptain: true }
  ];

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
                className={`p-4 rounded-xl border transition-smooth group cursor-pointer ${member.isCaptain
                    ? 'bg-red-50/20 border-brand-red/30 shadow-2xs relative'
                    : 'bg-white border-zinc-200 hover:border-brand-red/20 shadow-2xs hover:shadow-xs'
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
                      : 'border-zinc-200 bg-zinc-50 text-zinc-500 group-hover:border-brand-red/45 transition-colors'
                    }`}>
                    {member.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[12.5px] font-black text-zinc-850 truncate group-hover:text-brand-red transition-smooth leading-tight">
                        {member.name}
                      </h4>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-350 opacity-0 group-hover:opacity-100 transition-smooth" />
                    </div>
                    <span className="inline-block px-1.5 py-0.5 bg-zinc-100 border border-zinc-200/50 text-zinc-500 text-[8.5px] font-black rounded uppercase tracking-wide mt-1.5">
                      {member.category}
                    </span>
                    <p className="text-[11px] text-zinc-800 font-extrabold mt-2 truncate leading-tight">
                      {member.company}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-semibold truncate leading-none mt-1">
                      {member.chapter}
                    </p>
                  </div>
                </div>
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

    </div>
  );
}
