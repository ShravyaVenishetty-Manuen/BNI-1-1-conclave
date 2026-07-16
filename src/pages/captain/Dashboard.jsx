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
  History
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CaptainHeader from '../../components/CaptainHeader';
import Table from './Table';
import CurrentRound from './CurrentRound';
import Schedule from './Schedule';
import Profile from './Profile';
import Referrals from '../Referrals';

// Import tables to match seating data dynamically
import initialTables from '../../data/tables.json';

export default function CaptainDashboard({ loggedInCaptain, activeTab = 'dashboard', onTabChange, onLogout }) {
  const [tables, setTables] = useState(initialTables);
  const [attendance, setAttendance] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeRound, setActiveRound] = useState('Round 3');
  const [searchQuery, setSearchQuery] = useState('');

  const displayTable = String(loggedInCaptain.tableId || '5').toLowerCase().startsWith('table')
    ? loggedInCaptain.tableId
    : `Table ${loggedInCaptain.tableId || '5'}`;

  // Live ticking countdown timer starting at 08:42 (522 seconds)
  const [secondsLeft, setSecondsLeft] = useState(522);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Find the table details assigned to this Captain
  const myTable = tables.find(t => t.id === loggedInCaptain.tableId) || {
    id: loggedInCaptain.tableId,
    status: 'validated',
    capacity: '8/8',
    members: [
      { id: 'm-101', name: 'Anita Sharma', category: 'ARCHITECTURE', company: 'Blue Lotus Architecture', initials: 'AS' },
      { id: 'm-102', name: 'Rajesh Varma', category: 'IT SERVICES', company: 'TechFlow Solutions', initials: 'RV' },
      { id: 'm-103', name: 'Meera Iyer', category: 'LEGAL SERVICES', company: 'Iyer & Co Legal', initials: 'MI' },
      { id: 'm-104', name: 'Siddharth Shah', category: 'LOGISTICS', company: 'Elite Logistics', initials: 'SS' }
    ]
  };

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

  const handleSubmitAttendance = () => {
    if (isLocked) return;

    const totalMembers = myTable.members ? myTable.members.length : 0;
    const checkedCount = Object.values(attendance).filter(status => status !== null).length;

    if (checkedCount < totalMembers) {
      showToast('Incomplete Check-In', 'Please record attendance for all assigned members.');
      return;
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
                      Running
                    </span>
                    <span className="text-zinc-450 font-semibold text-xs tracking-wider">Event ID: ABC-2026-05</span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950 tracking-tight">
                    Annual Business Conclave 2026
                  </h1>

                  <div className="flex flex-wrap gap-4 text-zinc-500 text-[13px] font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4.5 h-4.5 text-zinc-400" />
                      <span>Grand Convention Center, Ballroom A</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4.5 h-4.5 text-zinc-400" />
                      <span>Oct 24, 2026</span>
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
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
                  <p className="text-[11px] font-bold text-zinc-450 uppercase tracking-wide">Current Round</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-lg font-black text-zinc-900 leading-none">
                      3 <span className="text-zinc-400 text-xs font-semibold">of 6</span>
                    </span>
                    <RefreshCw className="w-5 h-5 text-brand-red shrink-0" />
                  </div>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
                  <p className="text-[11px] font-bold text-zinc-450 uppercase tracking-wide">Assigned Table</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-lg font-black text-zinc-900 leading-none">
                      {displayTable}
                    </span>
                    <Award className="w-5 h-5 text-brand-red shrink-0" />
                  </div>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
                  <p className="text-[11px] font-bold text-zinc-450 uppercase tracking-wide">Total Members</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-lg font-black text-zinc-900 leading-none">
                      6 <span className="text-zinc-400 text-xs font-semibold">Active</span>
                    </span>
                    <Users className="w-5 h-5 text-brand-red shrink-0" />
                  </div>
                </div>
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
                  <p className="text-[11px] font-bold text-zinc-450 uppercase tracking-wide">Time Remaining</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-lg font-black text-brand-red leading-none">{formatTimeSimple(secondsLeft)}</span>
                    <Clock className="w-5 h-5 text-brand-red shrink-0 animate-pulse" />
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
                        LIVE ROUND 3
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
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px] font-semibold text-zinc-600">
                          <div className="space-y-1">
                            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Synergy Score</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-black text-zinc-950 leading-none">85% Optimal</span>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 leading-none">Excellent</span>
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
                              Phoenix Chapter, South Phoenix, Vista Chapter, Downtown Chapter
                            </p>
                          </div>
                        </div>
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
                      {myTable.members.map((member) => (
                        <div
                          key={member.id}
                          className="bg-white p-4.5 rounded-xl border border-zinc-200 hover:border-brand-red/35 hover:bg-zinc-50/20 shadow-2xs flex items-start gap-4 transition-smooth"
                        >
                          <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-sm text-zinc-500 shrink-0 shadow-inner">
                            {member.initials}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="text-[13px] font-bold text-zinc-850 leading-tight">{member.name}</h4>
                            <p className="text-[11px] text-zinc-450 font-semibold leading-normal mt-0.5">{member.company}</p>
                            <div className="pt-1.5">
                              <span className="bg-zinc-100 text-zinc-650 text-[8px] font-black px-2 py-0.5 rounded border border-zinc-200/50 uppercase tracking-wide">
                                {member.category}
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
                  {/* My Table Summary Card */}
                  <div className="bg-brand-red p-6 rounded-xl border border-red-700 shadow-md text-white select-none">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Your Station</p>
                        <h3 className="text-2xl font-black mt-1 leading-none">Table 05</h3>
                      </div>
                      <Award className="w-7 h-7 text-white opacity-50 shrink-0" />
                    </div>

                    <div className="flex items-center gap-2.5 mb-6">
                      <div className="flex -space-x-1.5">
                        <div className="w-7 h-7 rounded-full border border-brand-red bg-red-700/60 flex items-center justify-center text-[7px] font-bold">AS</div>
                        <div className="w-7 h-7 rounded-full border border-brand-red bg-red-700/60 flex items-center justify-center text-[7px] font-bold">RV</div>
                        <div className="w-7 h-7 rounded-full border border-brand-red bg-red-700/60 flex items-center justify-center text-[7px] font-bold font-black">+4</div>
                      </div>
                      <span className="text-[10.5px] font-extrabold text-red-50">6 Members Present</span>
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
                      <div className="relative pl-8">
                        <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300 border-2 border-white z-10"></div>
                        <div className="flex flex-col">
                          <span className="text-zinc-400 font-extrabold text-[9px] uppercase tracking-wider">09:00 AM - 09:30 AM</span>
                          <span className="text-zinc-800 font-bold text-[11.5px] mt-0.5">Breakfast & Networking</span>
                        </div>
                      </div>
                      <div className="relative pl-8">
                        <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300 border-2 border-white z-10"></div>
                        <div className="flex flex-col">
                          <span className="text-zinc-400 font-extrabold text-[9px] uppercase tracking-wider">09:30 AM - 10:00 AM</span>
                          <span className="text-zinc-800 font-bold text-[11.5px] mt-0.5">Opening Keynote</span>
                        </div>
                      </div>
                      <div className="relative pl-8">
                        <div className="absolute left-[3px] top-1.5 w-[18px] h-[18px] rounded-full bg-brand-red border-4 border-red-100 z-10 shadow-xs animate-pulse"></div>
                        <div className="flex flex-col">
                          <span className="text-brand-red font-black text-[9px] uppercase tracking-wider">10:00 AM - 10:45 AM (ACTIVE)</span>
                          <span className="text-zinc-900 font-extrabold text-[12px] mt-0.5">Round 3: 1-to-1 Meetings</span>
                        </div>
                      </div>
                      <div className="relative pl-8">
                        <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-150 border-2 border-white z-10"></div>
                        <div className="flex flex-col">
                          <span className="text-zinc-400 font-bold text-[9px] uppercase tracking-wider">10:45 AM - 11:00 AM</span>
                          <span className="text-zinc-505 font-semibold text-[11.5px] mt-0.5">Short Break</span>
                        </div>
                      </div>
                    </div>
                  </section>


                </div>
              </div>
            </div>
          )}

          {/* Sub-tab view: My Table Seating Checklist */}
          {activeTab === 'my-table' && (
            <Table loggedInCaptain={loggedInCaptain} searchQuery={searchQuery} />
          )}

          {/* Sub-tab view: Current Round Info */}
          {activeTab === 'current-round' && (
            <CurrentRound loggedInCaptain={loggedInCaptain} />
          )}

          {/* Sub-tab view: Schedule */}
          {activeTab === 'schedule' && (
            <Schedule loggedInCaptain={loggedInCaptain} />
          )}

          {/* Sub-tab view: Referrals Page */}
          {activeTab === 'referrals' && (
            <Referrals loggedInUser={loggedInCaptain} userType="captain" />
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
