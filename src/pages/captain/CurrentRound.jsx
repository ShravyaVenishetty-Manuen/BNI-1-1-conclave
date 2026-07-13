import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Clock,
  Users,
  Award,
  Info,
  Check,
  Play,
  X
} from 'lucide-react';

import { captainParticipants, captainCategories } from '../../data/mockConclaveData';

export default function CurrentRound({ loggedInCaptain }) {
  // Countdown timer starting at 08:42 (522 seconds)
  const [timeLeft, setTimeLeft] = useState(522);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

  const participants = captainParticipants;
  const categories = captainCategories;

  return (
    <div className="space-y-6 animate-fade-in font-sans">

      {/* Live Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-zinc-955 tracking-tight mt-1">Current Round</h1>
          <p className="text-xs text-zinc-450 font-semibold">View all information related to the active networking round.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-zinc-100 text-zinc-650 font-black text-[10px] uppercase tracking-wider rounded-full border border-zinc-200 shadow-2xs">
            Round 3
          </span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-black text-[10px] uppercase tracking-wider rounded-full border border-emerald-150 flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Running
          </span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-5 items-start">

        {/* Hero Countdown Ring */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden h-auto md:h-[320px] shadow-2xs">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#af101a_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="absolute top-4 left-4">
            <span className="text-[11px] font-extrabold text-zinc-550 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
              LIVE ROUND 3
            </span>
          </div>

          {/* Left side: Countdown Ring */}
          <div className="flex flex-col items-center shrink-0 pt-6 md:pt-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Countdown circular track */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  className="text-zinc-100"
                  cx="88"
                  cy="88"
                  fill="transparent"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="7"
                />
                <circle
                  className="text-brand-red transition-all duration-1000"
                  cx="88"
                  cy="88"
                  fill="transparent"
                  r="80"
                  stroke="currentColor"
                  strokeDasharray={502.6}
                  strokeDashoffset={502.6 * (1 - timeLeft / 600)}
                  strokeLinecap="round"
                  strokeWidth="7"
                />
              </svg>

              <div className="text-center z-10">
                <span className="text-4xl font-black text-zinc-955 tracking-tighter leading-none">
                  {formatTime(timeLeft)}
                </span>
                <p className="text-[8.5px] text-zinc-400 font-black uppercase tracking-widest mt-1.5">Minutes Left</p>
              </div>
            </div>
          </div>

          {/* Right side: Discussion Progress */}
          <div className="flex-1 space-y-4 pt-4 md:pt-0 z-10 w-full">
            <div>
              <h3 className="text-body-md font-black text-zinc-955">Round Discussion Focus</h3>
              <p className="text-[11.5px] leading-relaxed font-semibold text-zinc-500 mt-1">
                Collaborative matchmaking topic: <strong className="text-zinc-800">Identify joint venture opportunities & primary connection needs</strong>.
              </p>
            </div>

            <div className="border-t border-zinc-100 pt-3.5 space-y-2.5">
              <span className="text-[9.5px] font-black text-zinc-450 uppercase tracking-wider block">Live Speaker Queue</span>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-zinc-50 border border-zinc-150 rounded-lg text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-zinc-650">Anita Sharma, Rajesh Varma</span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 uppercase leading-none">Completed</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-red-50/50 border border-red-100 rounded-lg text-[11px] font-bold animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red"></span>
                    <span className="text-zinc-955 font-black">Sanjay Joshi (Construction)</span>
                  </div>
                  <span className="text-[9px] font-black text-brand-red bg-red-50 border border-red-100 rounded px-1.5 py-0.5 uppercase tracking-wider leading-none">Speaking</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-zinc-50 border border-zinc-150 rounded-lg text-[11px] font-bold text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-300"></span>
                    <span>Deepak Chawla, Meera Gupta, Jagdish Wagle</span>
                  </div>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase leading-none">Up Next</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Round Overview Card */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-5 flex flex-col justify-between shadow-2xs h-[320px]">
          <div className="space-y-3.5">
            <h3 className="text-body-sm font-black text-zinc-900">Round Overview</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                <span className="text-zinc-450 font-semibold">Progress</span>
                <span className="font-extrabold text-zinc-800">3 of 6 Rounds</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                <span className="text-zinc-450 font-semibold">Assigned Table</span>
                <span className="font-extrabold text-zinc-800">Table 5 (Main Hall)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                <span className="text-zinc-450 font-semibold">Round Status</span>
                <span className="px-2 py-0.5 bg-red-50 border border-red-100 text-brand-red text-[9px] font-black rounded uppercase">Running</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-zinc-450 font-semibold">Captain</span>
                <span className="font-extrabold text-zinc-800">Ganesh V.</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/75 border border-blue-100 rounded-lg text-blue-800 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-semibold leading-relaxed">
              Please ensure all members are logged in before the timer hits 00:00.
            </p>
          </div>
        </div>

        {/* Current Table Summary */}
        <div className="col-span-12 bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-brand-red rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand-red/10">
              T5
            </div>
            <div>
              <h2 className="font-black text-zinc-900 text-body-sm">Table #5 Networking Cluster</h2>
              <p className="text-xs text-zinc-450 font-semibold mt-0.5">
                Table Captain: <span className="text-zinc-800 font-extrabold">Ganesh</span> • 6/8 Occupancy
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <span key={cat} className="px-2.5 py-1 bg-zinc-50 border border-zinc-200/60 rounded-full text-[9.5px] font-black text-zinc-500 uppercase tracking-wide">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Current Participants Grid */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {participants.map((p) => (
            <div key={p.name} className="bg-white border border-zinc-200 rounded-xl p-4 flex gap-3.5 hover:border-brand-red/20 shadow-2xs transition-smooth">
              <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-sm text-zinc-500 shrink-0 shadow-inner">
                {p.initials}
              </div>
              <div className="flex-1 space-y-1 overflow-hidden">
                <h4 className="text-[13px] font-black text-zinc-850 truncate leading-tight">{p.name}</h4>
                {/* Fixed: Changed leading-none to leading-normal mt-0.5 to prevent text cuts */}
                <p className="text-[11px] text-zinc-450 font-semibold truncate leading-normal mt-0.5">{p.company}</p>
                <div className="flex items-center gap-2 pt-1.5">
                  <span className="px-1.5 py-0.5 bg-red-50 border border-red-100 text-brand-red text-[8.5px] font-black rounded uppercase">{p.type}</span>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{p.chapter} Chapter</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Column */}
        <div className="col-span-12 lg:col-span-3 space-y-5">

          {/* Next Round Preview */}
          <div className="bg-zinc-900 border border-zinc-800 text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-[215px]">
            <div>
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Up Next: Round 4</p>
              <h3 className="text-lg font-black text-white mt-1 leading-tight">Table 5 Cluster</h3>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300 text-xs">
                  <Users className="w-3.5 h-3.5 text-brand-red" />
                  <span>7 Expected Members</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300 text-xs">
                  <Clock className="w-3.5 h-3.5 text-brand-red animate-pulse" />
                  <span>Starts at 10:45 AM</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDetailsModal(true)}
              className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 hover:text-white transition-smooth border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-wider text-zinc-200 cursor-pointer"
            >
              View Round Details
            </button>
          </div>
        </div>

        {/* Live Progress Timeline */}
        <div className="col-span-12 bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs">
          <h3 className="font-black text-zinc-955 text-body-sm mb-6">Conclave Timeline</h3>

          <div className="relative py-4 px-3">
            {/* Horizontal Track Background Line */}
            <div className="absolute top-[32px] left-6 right-6 h-0.5 bg-zinc-100 rounded-full z-0"></div>

            {/* Horizontal Active Track Progress Line */}
            <div className="absolute top-[32px] left-6 w-[40%] h-0.5 bg-brand-red rounded-full z-0"></div>

            {/* Steps Container */}
            <div className="relative flex justify-between items-start z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center z-10 shadow-xs border-2 border-white">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] font-extrabold text-zinc-800 uppercase tracking-wider mt-3">Round 1</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center z-10 shadow-xs border-2 border-white">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] font-extrabold text-zinc-800 uppercase tracking-wider mt-3">Round 2</span>
              </div>

              {/* Step 3 (Active) */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-9 h-9 -mt-0.5 flex items-center justify-center">
                  {/* Pulsing active background indicator glow */}
                  <div className="absolute -inset-1 rounded-full bg-red-100/60 animate-pulse z-0"></div>

                  {/* Solid mask circle to completely block the background progress line */}
                  <div className="relative w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center z-10 shadow-md shadow-brand-red/25 border-2 border-white">
                    <Play className="w-4 h-4 fill-current ml-0.5 animate-pulse" />
                  </div>
                </div>
                <span className="text-[10px] font-black text-brand-red uppercase tracking-wider mt-2.5">Round 3</span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-8 h-8 rounded-full bg-white border border-zinc-200 text-zinc-350 flex items-center justify-center z-10 text-[10.5px] font-extrabold shadow-xs select-none">
                  4
                </div>
                <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mt-3">Round 4</span>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-8 h-8 rounded-full bg-white border border-zinc-200 text-zinc-350 flex items-center justify-center z-10 text-[10.5px] font-extrabold shadow-xs select-none">
                  5
                </div>
                <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mt-3">Round 5</span>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-8 h-8 rounded-full bg-white border border-zinc-200 text-zinc-350 flex items-center justify-center z-10 text-[10.5px] font-extrabold shadow-xs select-none">
                  6
                </div>
                <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider mt-3">Round 6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Up / Overlay Modal for View Round Details */}
      {showDetailsModal && createPortal(
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-zinc-150 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-red" />
                <h3 className="font-black text-zinc-955 text-body-md">Round 3 Discussion Details</h3>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-200/50 transition-smooth cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="bg-red-50/50 border border-red-100 p-4 rounded-lg space-y-2">
                <span className="text-[10px] font-black text-brand-red uppercase tracking-wider block">Round Focus Topic</span>
                <p className="text-[12px] font-black text-zinc-900 leading-snug">
                  Identifying Cross-Classification Synergies & Shared Client Referral Opportunities
                </p>
                <p className="text-[11px] font-semibold text-zinc-500 leading-relaxed">
                  Members at this table represent Construction, Finance, Software, Manufacturing, and Healthcare. Locate matches where these industries share the same client base.
                </p>
              </div>

              <div className="space-y-2.5">
                <span className="text-[9.5px] font-black text-zinc-450 uppercase tracking-wider block">Timeline & Format</span>
                <div className="space-y-2 text-[11.5px] font-semibold text-zinc-650">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                    <span>Total Round Duration</span>
                    <span className="font-extrabold text-zinc-800">20 Minutes</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                    <span>Time per Pitch</span>
                    <span className="font-extrabold text-zinc-800 font-mono">2.0 Mins / Speaker</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                    <span>Q&A & Networking Wrap</span>
                    <span className="font-extrabold text-zinc-800">5 Minutes</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Seating Rule</span>
                    <span className="font-extrabold text-brand-red bg-red-50/50 px-2 py-0.5 rounded border border-red-100 text-[9px] uppercase font-black">Strict Attendance</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-150 flex justify-end bg-zinc-50">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
