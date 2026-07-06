import React from 'react';
import {
  Users,
  Bolt,
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  ClipboardList,
  Layers,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  MapPin
} from 'lucide-react';

export default function Dashboard() {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 p-8 max-w-[1600px] mx-auto w-full">

      {/* Page Header section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-6">
        <div>
          <nav className="flex text-label-xs text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">
            <span className="hover:text-brand-red cursor-pointer transition-smooth">Admin</span>
            <span className="mx-2 text-zinc-300">/</span>
            <span className="text-zinc-800">Dashboard</span>
          </nav>
          <h2 className="text-dashboard-title text-zinc-950 font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-body-text text-zinc-500 mt-1">
            Welcome back, Admin. Here is the overview for <span className="font-semibold text-zinc-800">{formattedDate}</span>.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-1.5 rounded-full border border-emerald-100/80 shadow-sm shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-label-md font-bold uppercase tracking-wider">
            Current Conclave Running
          </span>
        </div>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Members */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white hover:border-brand-red/30 transition-smooth shadow-sm hover:shadow-md group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-label-md text-zinc-500 uppercase font-semibold">Total Members</p>
            <div className="p-2 rounded-lg bg-zinc-50 text-zinc-400 group-hover:bg-brand-red/5 group-hover:text-brand-red transition-smooth">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-display-sm font-bold text-zinc-900 leading-none">842</h3>
            <span className="text-emerald-600 text-label-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="mt-4 h-8 w-full bg-zinc-50 rounded-lg relative overflow-hidden flex items-end gap-[3px] p-1">
            <div className="flex-1 bg-emerald-100/50 h-[35%] rounded-sm"></div>
            <div className="flex-1 bg-emerald-100 h-[50%] rounded-sm"></div>
            <div className="flex-1 bg-emerald-100 h-[45%] rounded-sm"></div>
            <div className="flex-1 bg-emerald-200 h-[70%] rounded-sm"></div>
            <div className="flex-1 bg-emerald-300 h-[85%] rounded-sm"></div>
            <div className="flex-1 bg-brand-red h-[100%] rounded-sm"></div>
          </div>
        </div>

        {/* Active Capacity */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white hover:border-brand-red/30 transition-smooth shadow-sm hover:shadow-md group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-label-md text-zinc-500 uppercase font-semibold">Active Capacity</p>
            <div className="p-2 rounded-lg bg-zinc-50 text-zinc-400 group-hover:bg-brand-red/5 group-hover:text-brand-red transition-smooth">
              <Bolt className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-display-sm font-bold text-zinc-900 leading-none">790</h3>
            <span className="text-zinc-500 text-label-xs font-medium">/ 842 active</span>
          </div>
          <div className="mt-6">
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-red h-full w-[94%] rounded-full shadow-[0_0_8px_rgba(207,46,46,0.3)]"></div>
            </div>
            <span className="text-caption text-zinc-400 mt-2 block font-medium">94% capacity occupied</span>
          </div>
        </div>

        {/* Leadership */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white hover:border-brand-red/30 transition-smooth shadow-sm hover:shadow-md group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-label-md text-zinc-500 uppercase font-semibold">Leadership</p>
            <div className="p-2 rounded-lg bg-zinc-50 text-zinc-400 group-hover:bg-brand-red/5 group-hover:text-brand-red transition-smooth">
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
              <div className="w-7 h-7 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 shadow-sm">SM</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700 shadow-sm">AR</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-brand-red text-white flex items-center justify-center text-[10px] font-bold shadow-sm">+45</div>
            </div>
            <span className="text-caption text-zinc-400 font-semibold cursor-pointer hover:text-brand-red transition-smooth">View All</span>
          </div>
        </div>

        {/* Conclave Pipeline */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white hover:border-brand-red/30 transition-smooth shadow-sm hover:shadow-md group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-label-md text-zinc-500 uppercase font-semibold">Conclave Pipeline</p>
            <div className="p-2 rounded-lg bg-zinc-50 text-zinc-400 group-hover:bg-brand-red/5 group-hover:text-brand-red transition-smooth">
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
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Quick Management Panel */}
        <div className="lg:col-span-3 flex flex-col justify-between p-6 border border-zinc-200 rounded-xl bg-zinc-50/50 shadow-sm space-y-4">
          <div>
            <h4 className="text-label-xs font-bold text-zinc-400 uppercase px-1 tracking-wider">Quick Actions</h4>
            <p className="text-caption text-zinc-500 px-1 mt-1 leading-relaxed">Operate conclave cycles and validation checks.</p>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-brand-red hover:bg-red-700 text-white rounded-lg transition-smooth shadow-sm hover:shadow group cursor-pointer">
              <span className="text-button">Add New Member</span>
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            </button>

            <button className="w-full flex items-center justify-between px-4 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg transition-smooth shadow-sm hover:shadow group cursor-pointer">
              <span className="text-button">Create Conclave</span>
              <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 rounded-lg transition-smooth shadow-sm hover:shadow group cursor-pointer">
              <span className="text-button">Run Validation Gate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            </button>

            <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 rounded-lg transition-smooth shadow-sm hover:shadow group cursor-pointer">
              <span className="text-button">Generate Schedule</span>
              <Bolt className="w-4 h-4 text-amber-500 group-hover:animate-pulse transition-transform" />
            </button>
          </div>
        </div>

        {/* Featured Conclave Highlight */}
        <div className="lg:col-span-9 p-6 border border-brand-red/20 rounded-xl bg-brand-red text-white flex flex-col md:flex-row gap-6 relative overflow-hidden group shadow-md">
          {/* Decorative Background Icon */}
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20">
            <Award className="w-[180px] h-[180px] text-white" />
          </div>

          <div className="flex-1 space-y-5 z-10 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-white/20 rounded-xl text-white border border-white/10 shadow-inner flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-headline-md font-bold leading-tight">Annual Conclave Q4</h3>
                <div className="flex flex-wrap gap-3 mt-1.5">
                  <span className="text-label-xs bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-tight shadow-sm">
                    Live Status: Running
                  </span>
                  <span className="text-label-xs text-white/80 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Mumbai, Grand Ballroom
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 border-y border-white/10">
              <div className="space-y-0.5">
                <p className="text-label-xs text-white/70 uppercase font-semibold">Round Progress</p>
                <p className="font-bold text-title-lg">2 / 5 Rounds</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-label-xs text-white/70 uppercase font-semibold">Tables</p>
                <p className="font-bold text-title-lg">24 Active</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-label-xs text-white/70 uppercase font-semibold">Attendance</p>
                <p className="font-bold text-title-lg">310 / 320</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-label-xs text-white/70 uppercase font-semibold">Validation</p>
                <p className="font-bold text-white flex items-center gap-1 text-title-lg">
                  <CheckCircle2 className="w-4 h-4 text-white" /> Passed
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-label-xs font-bold uppercase text-white/80">
                <span>Overall Conclave Progress</span>
                <span>40%</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden shadow-inner">
                <div className="bg-white h-full w-[40%] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"></div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[240px] bg-white/10 backdrop-blur-md p-5 rounded-lg border border-white/25 space-y-4 z-10 flex flex-col justify-between">
            <div>
              <p className="text-label-xs font-bold text-white/80 uppercase tracking-wider">Captain Activity</p>
              <div className="space-y-2.5 mt-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span className="text-body-sm font-semibold">12 Captains Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  <span className="text-body-sm font-semibold">3 Pending Approval</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 text-label-md font-bold text-white border border-white/40 rounded-lg hover:bg-white/10 transition-smooth cursor-pointer mt-4">
              Manage Logistics
            </button>
          </div>
        </div>
      </section>

      {/* Analytics: Validation & Business Mix */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Validation health radial chart */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white shadow-sm hover:shadow-md transition-smooth">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-title-lg text-zinc-950 font-bold">Validation Health</h4>
            <span className="text-label-xs text-zinc-400 font-bold uppercase tracking-wider">Last Run: 12m ago</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-zinc-50" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-emerald-500" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" stroke-dashoffset="7.2" stroke-width="8" strokeLinecap="round"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-display-sm text-zinc-950 font-bold leading-none">98%</span>
                <span className="text-label-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">Score</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-2.5">
              <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg border border-zinc-100 shadow-sm">
                <span className="text-body-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span> Rules Passed
                </span>
                <span className="font-bold text-emerald-600 text-body-md">42</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg border border-zinc-100 shadow-sm">
                <span className="text-body-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-amber-500 rounded-full"></span> Warnings
                </span>
                <span className="font-bold text-amber-600 text-body-md">2</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg border border-zinc-100 shadow-sm">
                <span className="text-body-sm font-semibold text-zinc-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-brand-red rounded-full"></span> Critical Errors
                </span>
                <span className="font-bold text-brand-red text-body-md">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business type distribution */}
        <div className="p-6 border border-zinc-200/80 rounded-xl bg-white shadow-sm hover:shadow-md transition-smooth">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-title-lg text-zinc-950 font-bold">Business Type Mix</h4>
            <button className="text-brand-red text-label-md font-bold hover:underline transition-smooth cursor-pointer flex items-center gap-0.5">
              View All 124 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-body-sm">
                <span className="text-zinc-600 font-semibold">Real Estate & Construction</span>
                <span className="font-bold text-zinc-900">24%</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-red h-full w-[24%] rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-body-sm">
                <span className="text-zinc-600 font-semibold">Financial Services</span>
                <span className="font-bold text-zinc-900">18%</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-zinc-800 h-full w-[18%] rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-body-sm">
                <span className="text-zinc-600 font-semibold">Marketing & Advertising</span>
                <span className="font-bold text-zinc-900">15%</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[15%] rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-body-sm">
                <span className="text-zinc-600 font-semibold">Information Technology</span>
                <span className="font-bold text-zinc-900">12%</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[12%] rounded-full shadow-sm"></div>
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
            <h4 className="text-title-lg text-zinc-950 font-bold">Recent Conclaves</h4>
            <button className="text-zinc-500 hover:text-zinc-950 text-label-md flex items-center gap-1.5 transition-smooth cursor-pointer font-semibold border border-zinc-200 px-3 py-1.5 rounded-lg bg-zinc-50/50 hover:bg-zinc-100">
              <ClipboardList className="w-4 h-4" /> Filter
            </button>
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
                    <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer flex items-center justify-center ml-auto">
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
                    <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer flex items-center justify-center ml-auto">
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
                    <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer flex items-center justify-center ml-auto">
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
            <h4 className="text-title-lg text-zinc-950 font-bold mb-6">Recent Activity</h4>

            <div className="relative space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-100">

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-brand-red shadow-sm">
                  <Bolt className="w-3 h-3 text-brand-red" />
                </div>
                <div>
                  <p className="text-body-sm text-zinc-700">
                    <span className="font-semibold text-zinc-900">Sarah Jenkins</span> generated a new schedule for Alpha Conclave.
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
                    <span className="font-semibold text-zinc-900">Captain Michael</span> assigned to Table 14.
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

          <button className="w-full mt-6 py-2.5 text-label-md font-bold text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:text-zinc-800 transition-smooth cursor-pointer">
            View Audit Log
          </button>
        </div>

      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-brand-red hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-smooth flex items-center justify-center group cursor-pointer">
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </button>
      </div>

    </div>
  );
}
