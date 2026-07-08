import React from 'react';
import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Users,
  Bolt,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  UserCheck,
  MapPin,
  UserPlus,
  PlusCircle,
  BadgeCheck,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 max-w-[1600px] mx-auto w-full">

      {/* Page Header section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Admin Dashboard</h2>
          <p className="text-body-text text-zinc-500 mt-1">
            Welcome back, Admin.
          </p>
        </div>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Members */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white transition-smooth shadow-sm group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-label-md text-zinc-500 uppercase font-semibold">Total Members</p>
            <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-display-sm font-bold text-zinc-900 leading-none">842</h3>
          </div>
          <div className="mt-4 h-8 w-full bg-zinc-50 rounded-lg p-1 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ v: 35, c: '#a7f3d0' }, { v: 50, c: '#a7f3d0' }, { v: 45, c: '#a7f3d0' }, { v: 70, c: '#6ee7b7' }, { v: 85, c: '#34d399' }, { v: 100, c: '#af101a' }]}>
                <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                  {[{ v: 35, c: '#a7f3d0' }, { v: 50, c: '#a7f3d0' }, { v: 45, c: '#a7f3d0' }, { v: 70, c: '#6ee7b7' }, { v: 85, c: '#34d399' }, { v: 100, c: '#af101a' }].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.c} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Capacity */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white transition-smooth shadow-sm group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-label-md text-zinc-500 uppercase font-semibold">Active Capacity</p>
            <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red">
              <Bolt className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-display-sm font-bold text-zinc-900 leading-none">790</h3>
            <span className="text-zinc-500 text-label-xs font-medium">/ 842 active</span>
          </div>
          <div className="mt-6">
            <div className="w-full h-2 rounded-full overflow-hidden cursor-pointer pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={[{ name: 'Capacity', value: 94 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip formatter={(value) => `${value}%`} cursor={false} />
                  <Bar dataKey="value" fill="#af101a" radius={[4, 4, 4, 4]} background={{ fill: '#f4f4f5' }} barSize={8} activeBar={{ fill: '#af101a' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <span className="text-caption text-zinc-400 mt-2 block font-medium">94% capacity occupied</span>
          </div>
        </div>

        {/* Leadership */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white transition-smooth shadow-sm group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-label-md text-zinc-500 uppercase font-semibold">Leadership</p>
            <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-display-sm font-bold text-zinc-900 leading-none">48</h3>
            <span className="text-zinc-500 text-label-xs font-medium">Captains Assigned</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2 items-center">
              <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-sm">JI</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[9px] font-bold text-emerald-700 shadow-sm">SM</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-amber-100 flex items-center justify-center text-[9px] font-bold text-amber-700 shadow-sm">AR</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-brand-red text-white flex items-center justify-center text-[9px] font-bold shadow-sm">+45</div>
            </div>
          </div>
        </div>

        {/* Conclave Pipeline */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white transition-smooth shadow-sm group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-label-md text-zinc-500 uppercase font-semibold">Conclave Pipeline</p>
            <div className="p-2 rounded-lg bg-brand-red/5 text-brand-red">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="text-center p-2 bg-zinc-50 rounded-lg border border-zinc-100 shadow-sm">
              <span className="block font-bold text-title-lg text-zinc-800">2</span>
              <span className="text-label-xs text-zinc-500 font-semibold uppercase">Drafts</span>
            </div>
            <div className="text-center p-2 border border-brand-red/15 bg-brand-red/5 rounded-lg shadow-sm">
              <span className="block font-bold text-title-lg text-brand-red">1</span>
              <span className="text-label-xs text-brand-red font-semibold uppercase">Active</span>
            </div>
          </div>
        </div>

      </section>

      {/* Quick Actions & Featured Conclave Highlight */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Quick Management Panel */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 px-0.5">Quick Management</span>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab && setActiveTab('members')}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">Add New Member</span>
              <UserPlus className="w-[18px] h-[18px] text-brand-red" />
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('conclaves')}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">Create Conclave</span>
              <PlusCircle className="w-[18px] h-[18px] text-brand-red" />
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('validation')}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">Run Validation</span>
              <BadgeCheck className="w-[18px] h-[18px] text-brand-red" />
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('schedule-gen')}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">Generate Schedule</span>
              <Sparkles className="w-[18px] h-[18px] text-brand-red" />
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('reports')}
              className="w-full flex items-center justify-between px-4 py-3.5 border quick-action-btn text-zinc-850 rounded-lg transition-smooth cursor-pointer font-bold tracking-tight"
            >
              <span className="text-button">View Reports</span>
              <BarChart3 className="w-[18px] h-[18px] text-brand-red" />
            </button>
          </div>
        </div>

        {/* Featured Conclave Highlight */}
        <div className="lg:col-span-9 p-6 border border-zinc-200 bg-zinc-50/50 text-zinc-800 flex flex-col md:flex-row gap-6 relative overflow-hidden group shadow-sm rounded-xl justify-between items-stretch">

          <div className="flex-1 z-10 flex flex-col py-1">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-white rounded-xl text-brand-red border border-zinc-200 shadow-inner flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-headline-md font-bold leading-tight text-zinc-950">Annual Conclave Q4</h3>
                <div className="flex flex-wrap gap-3 mt-1.5 items-center">
                  <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded font-extrabold uppercase tracking-wider shadow-sm">
                    Current Conclave Running
                  </span>
                  <span className="text-label-xs text-zinc-500 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" /> V Convention, Guntur
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-4 py-4 border-y border-zinc-200/80 mt-5">
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Round Progress</p>
                <p className="font-extrabold text-[15px] text-zinc-950 leading-tight mt-1">2 / 5 Rounds</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Tables</p>
                <p className="font-extrabold text-[15px] text-zinc-950 leading-tight mt-1">24 Active</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Attendance</p>
                <p className="font-extrabold text-[15px] text-zinc-950 leading-tight mt-1">310 / 320</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Validation</p>
                <p className="font-extrabold text-[15px] text-emerald-700 leading-tight mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600" /> Passed
                </p>
              </div>
            </div>

            {/* Live event banner notice to fill spacing */}
            <div className="mt-4 flex items-start gap-2.5">
              <span className="flex h-2 w-2 relative mt-1 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
              </span>
              <p className="text-[11px] leading-normal font-semibold text-zinc-600">
                <strong className="text-brand-red font-bold">Round 3 Seating Setup</strong> is currently in progress. Captains should check-in attendees at their respective tables.
              </p>
            </div>

            <div className="space-y-2 mt-auto pt-4">
              <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-555 tracking-wider">
                <span>Overall Conclave Progress</span>
                <span className="text-zinc-950">40%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-250 cursor-pointer pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={[{ name: 'Progress', value: 40 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip formatter={(value) => `${value}%`} cursor={false} />
                    <Bar dataKey="value" fill="#cf2e2e" radius={[4, 4, 4, 4]} background={{ fill: '#e4e4e7' }} barSize={8} activeBar={{ fill: '#cf2e2e' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[250px] z-10 flex flex-col justify-between min-h-[175px] md:border-l border-zinc-200/80 md:pl-6 pt-4 md:pt-0">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Captain Activity</p>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-body-sm font-semibold text-zinc-800">12 Captains Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span className="text-body-sm font-semibold text-zinc-800">3 Pending Approval</span>
                </div>
              </div>

              {/* Online Captain Avatars Grid */}
              <div className="flex items-center gap-2 mt-5 pl-0.5">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[7.5px] font-black border-2 border-white shadow-xs">MT</div>
                  <div className="w-6 h-6 rounded-full bg-zinc-700 text-white flex items-center justify-center text-[7.5px] font-black border-2 border-white shadow-xs">ER</div>
                  <div className="w-6 h-6 rounded-full bg-zinc-500 text-white flex items-center justify-center text-[7.5px] font-black border-2 border-white shadow-xs">DC</div>
                  <div className="w-6 h-6 rounded-full bg-zinc-300 text-zinc-800 flex items-center justify-center text-[7.5px] font-black border-2 border-white shadow-xs">SR</div>
                </div>
                <span className="text-[9.5px] text-zinc-450 font-bold uppercase tracking-wider ml-1">+8 online</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab && setActiveTab('captains')}
              className="w-full py-2.5 text-label-md font-bold text-zinc-800 border border-zinc-200 bg-white hover:bg-zinc-50 transition-smooth cursor-pointer mt-4 uppercase tracking-wider text-[10px] shadow-xs rounded-lg"
            >
              Manage Logistics
            </button>
          </div>
        </div>
      </section>

      {/* Analytics: Validation & Business Mix */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Referrals Tracker card */}
        <div className="p-5 border border-zinc-200/80 rounded-xl bg-white shadow-sm hover:shadow-md transition-smooth flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-title-lg text-zinc-950 font-semibold">Referrals Tracker</h4>
              <span className="text-label-xs text-zinc-400 font-bold uppercase tracking-wider">Goal: 1,500 Referrals</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-3">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <PieChart width={128} height={128}>
                  <Pie
                    data={[
                      { value: 1320, fill: '#cf2e2e' },
                      { value: 1500 - 1320, fill: '#f4f4f5' }
                    ]}
                    dataKey="value"
                    innerRadius={46}
                    outerRadius={56}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  />
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-display-sm text-zinc-950 font-bold leading-none">1,320</span>
                  <span className="text-label-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">88% Goal</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-zinc-50 rounded-lg border border-zinc-100 shadow-sm">
                  <span className="text-body-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-brand-red rounded-full"></span> Inside Referrals
                  </span>
                  <span className="font-bold text-zinc-800 text-body-md">842</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-zinc-50 rounded-lg border border-zinc-100 shadow-sm">
                  <span className="text-body-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-zinc-400 rounded-full"></span> Outside Referrals
                  </span>
                  <span className="font-bold text-zinc-800 text-body-md">478</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-zinc-50 rounded-lg border border-zinc-100 shadow-sm">
                  <span className="text-body-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full"></span> Closed Business Value
                  </span>
                  <span className="font-bold text-emerald-600 text-body-md">$54,600</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Referral Givers Leaderboard */}
        <div className="p-5 border border-zinc-200/80 rounded-xl bg-white shadow-sm hover:shadow-md transition-smooth flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-title-lg text-zinc-950 font-semibold">Top Referral Givers</h4>
            </div>

            <div className="space-y-1">

              <div className="flex items-center justify-between py-1.5 px-2 hover:bg-zinc-50 rounded-lg transition-smooth border border-transparent hover:border-zinc-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red font-bold text-xs flex items-center justify-center shrink-0 border border-brand-red/10">
                    1
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-zinc-900 leading-tight">Rajesh Mehta</p>
                    <p className="text-caption text-zinc-500 mt-0.5 leading-none">Real Estate & Construction</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-body-sm font-bold text-brand-red">42</span>
                  <span className="text-[9px] text-zinc-400 font-semibold uppercase block tracking-wider mt-0.5">Referrals</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 px-2 hover:bg-zinc-50 rounded-lg transition-smooth border border-transparent hover:border-zinc-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red font-bold text-xs flex items-center justify-center shrink-0 border border-brand-red/10">
                    2
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-zinc-900 leading-tight">Anjali Sharma</p>
                    <p className="text-caption text-zinc-500 mt-0.5 leading-none">Marketing & Advertising</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-body-sm font-bold text-brand-red">38</span>
                  <span className="text-[9px] text-zinc-400 font-semibold uppercase block tracking-wider mt-0.5">Referrals</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 px-2 hover:bg-zinc-50 rounded-lg transition-smooth border border-transparent hover:border-zinc-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red font-bold text-xs flex items-center justify-center shrink-0 border border-brand-red/10">
                    3
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-zinc-900 leading-tight">Vikram Malhotra</p>
                    <p className="text-caption text-zinc-500 mt-0.5 leading-none">Financial Services</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-body-sm font-bold text-brand-red">35</span>
                  <span className="text-[9px] text-zinc-400 font-semibold uppercase block tracking-wider mt-0.5">Referrals</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Data Table & Timeline section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">

        {/* Recent conclaves list */}
        <div className="lg:col-span-8 p-6 border border-zinc-200/80 rounded-xl bg-white flex flex-col shadow-sm hover:shadow-md transition-smooth">
          <div className="flex justify-between items-center mb-5">
            <h4 className="text-title-lg text-zinc-950 font-semibold">Recent Conclaves</h4>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-y border-zinc-200 text-label-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="px-4 py-3.5">Conclave Name</th>
                  <th className="px-4 py-3.5 text-center">Date</th>
                  <th className="px-4 py-3.5 text-center">Members</th>
                  <th className="px-4 py-3.5 text-center">Rounds</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-table-text">
                <tr className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-4 py-4 font-semibold text-zinc-900">Annual Conclave Q4</td>
                  <td className="px-4 py-4 text-center text-zinc-500 font-medium">Oct 24, 2023</td>
                  <td className="px-4 py-4 text-center text-zinc-800 font-semibold">310</td>
                  <td className="px-4 py-4 text-center text-zinc-800 font-semibold">5</td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-label-xs font-bold border border-brand-red/20 text-brand-red bg-brand-red/5">
                      RUNNING
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setActiveTab && setActiveTab('conclaves')}
                      className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer flex items-center justify-center ml-auto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-4 py-4 font-semibold text-zinc-900">Western Region Meet</td>
                  <td className="px-4 py-4 text-center text-zinc-500 font-medium">Sep 15, 2023</td>
                  <td className="px-4 py-4 text-center text-zinc-800 font-semibold">184</td>
                  <td className="px-4 py-4 text-center text-zinc-800 font-semibold">4</td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-label-xs font-bold border border-emerald-200 text-emerald-800 bg-emerald-50">
                      COMPLETED
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setActiveTab && setActiveTab('conclaves')}
                      className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer flex items-center justify-center ml-auto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-4 py-4 font-semibold text-zinc-900">Leadership Connect</td>
                  <td className="px-4 py-4 text-center text-zinc-500 font-medium">Nov 12, 2023</td>
                  <td className="px-4 py-4 text-center text-zinc-800 font-semibold">50</td>
                  <td className="px-4 py-4 text-center text-zinc-800 font-semibold">3</td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-label-xs font-bold border border-amber-200 text-amber-800 bg-amber-50">
                      SCHEDULED
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setActiveTab && setActiveTab('conclaves')}
                      className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer flex items-center justify-center ml-auto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent activity timeline */}
        <div className="lg:col-span-4 p-6 border border-zinc-200/80 rounded-xl bg-white shadow-sm hover:shadow-md transition-smooth flex flex-col justify-between">
          <div>
            <h4 className="text-title-lg text-zinc-950 font-semibold mb-6">Recent Activity</h4>

            <div className="relative space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-100">

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-brand-red shadow-sm">
                  <Bolt className="w-3 h-3 text-brand-red" />
                </div>
                <div>
                  <p className="text-body-sm text-zinc-700">
                    <span className="font-semibold text-zinc-900">Shweta Iyer</span> generated a new schedule for Alpha Conclave.
                  </p>
                  <p className="text-label-xs text-zinc-400 mt-1.5 uppercase font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 5 minutes ago
                  </p>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-zinc-300 shadow-sm">
                  <Award className="w-3 h-3 text-zinc-500" />
                </div>
                <div>
                  <p className="text-body-sm text-zinc-700">
                    <span className="font-semibold text-zinc-900">Captain Manoj</span> assigned to Table 14.
                  </p>
                  <p className="text-label-xs text-zinc-400 mt-1.5 uppercase font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 2 hours ago
                  </p>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-emerald-400 shadow-sm">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                </div>
                <div>
                  <p className="text-body-sm text-zinc-700">
                    System validation <span className="text-emerald-600 font-semibold">passed</span> for all 24 tables.
                  </p>
                  <p className="text-label-xs text-zinc-400 mt-1.5 uppercase font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Yesterday
                  </p>
                </div>
              </div>

            </div>
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('active-users')}
            className="w-full mt-6 py-2.5 text-label-md font-bold text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:text-zinc-800 transition-smooth cursor-pointer"
          >
            View Audit Log
          </button>
        </div>
      </section>
    </div>
  );
}
