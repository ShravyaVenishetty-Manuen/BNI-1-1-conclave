import React from 'react';
import { 
  Award, 
  Layers, 
  CalendarRange, 
  Users, 
  Activity, 
  Clock, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';
import { mockAdmins, mockRegions, mockGlobalConclaves, mockGlobalMembers } from '../../data/mockConclaveData';

export default function SuperadminDashboard({ setActiveTab }) {
  // Aggregate KPIs
  const totalAdminsCount = mockAdmins.length;
  const totalRegionsCount = mockRegions.length;
  const totalConclavesCount = mockGlobalConclaves.length;
  const totalMembersCount = mockGlobalMembers.length;

  // Distribution helpers
  const conclavesPerRegion = mockRegions.map(reg => {
    const count = mockGlobalConclaves.filter(c => c.region === reg.name).length;
    return { name: reg.name, count };
  });

  const adminsPerRegion = mockRegions.map(reg => {
    const count = mockAdmins.filter(a => a.region === reg.name).length;
    return { name: reg.name, count };
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-955 tracking-tight">Superadmin Dashboard</h1>
        <p className="text-xs text-zinc-500 font-semibold mt-1">Global BNI Conclave directory network oversight &amp; regional admin statistics.</p>
      </div>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total BNI Regions", value: totalRegionsCount, sub: "Active regions globally", Icon: Layers, tab: "admins" },
          { label: "Regional Admins", value: totalAdminsCount, sub: "Created login profiles", Icon: Award, tab: "admins" },
          { label: "All-Time Conclaves", value: totalConclavesCount, sub: "Aggregated conclave events", Icon: CalendarRange, tab: "conclaves" },
          { label: "Total Network Members", value: totalMembersCount, sub: "Registered across regions", Icon: Users, tab: "members" }
        ].map((kpi, idx) => {
          const Icon = kpi.Icon;
          return (
            <div 
              key={idx}
              onClick={() => setActiveTab && setActiveTab(kpi.tab)}
              className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs hover:shadow-md hover:border-brand-red/30 transition-smooth cursor-pointer flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex justify-between items-start">
                <span className="text-[9.5px] font-black text-zinc-400 uppercase tracking-wider">{kpi.label}</span>
                <Icon className="w-4.5 h-4.5 text-zinc-450 shrink-0" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-brand-red leading-none">{kpi.value}</span>
                <span className="text-[10px] text-zinc-450 font-semibold block mt-1">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Distributions & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Conclaves distribution list */}
        <section className="lg:col-span-6 bg-white border border-zinc-200 rounded-xl shadow-2xs p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-body-md font-black text-zinc-900 leading-tight">Conclaves per Region</h2>
              <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Events count grouped by BNI region.</p>
            </div>
            
            <div className="space-y-3.5 pt-2">
              {conclavesPerRegion.map((item, idx) => {
                const percentage = totalConclavesCount > 0 ? (item.count / totalConclavesCount) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11.5px] font-bold text-zinc-700">
                      <span className="truncate">{item.name}</span>
                      <span className="text-zinc-850 font-black shrink-0">{item.count} conclaves</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-red rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button 
            onClick={() => setActiveTab && setActiveTab('conclaves')}
            className="w-full text-center text-[10px] font-black text-brand-red uppercase tracking-wider hover:underline pt-5 mt-4 border-t border-zinc-100 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View All Conclaves</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>

        {/* Admins distribution list */}
        <section className="lg:col-span-6 bg-white border border-zinc-200 rounded-xl shadow-2xs p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-body-md font-black text-zinc-900 leading-tight">Admins per Region</h2>
              <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Number of administrative profiles assigned.</p>
            </div>
            
            <div className="space-y-3.5 pt-2">
              {adminsPerRegion.map((item, idx) => {
                const percentage = totalAdminsCount > 0 ? (item.count / totalAdminsCount) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11.5px] font-bold text-zinc-700">
                      <span className="truncate">{item.name}</span>
                      <span className="text-zinc-850 font-black shrink-0">{item.count} admins</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-red rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button 
            onClick={() => setActiveTab && setActiveTab('admins')}
            className="w-full text-center text-[10px] font-black text-brand-red uppercase tracking-wider hover:underline pt-5 mt-4 border-t border-zinc-100 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Manage Admins &amp; Regions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>

      </div>

      {/* Global Activity Feed Logs */}
      <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs p-5">
        <div className="mb-4">
          <h2 className="text-body-md font-black text-zinc-900 leading-tight">Recent Global Activity</h2>
          <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Real-time status changes and regional conclave events log.</p>
        </div>
        
        <div className="space-y-4">
          {[
            { msg: "Regional Admin Meera Nair status set to Inactive", time: "2 hours ago", info: "Singapore Metro" },
            { msg: "New Conclave 'Quarterly Synergy Q1' created by Sanjay Wagle", time: "Yesterday, 3:20 PM", info: "Guntur Region" },
            { msg: "Schedule matching verified with 0 repeat collisions", time: "2 days ago", info: "Phoenix Chapter" }
          ].map((activity, idx) => (
            <div key={idx} className="flex gap-3 items-start text-body-sm">
              <div className="p-1.5 bg-red-50 text-brand-red rounded-lg shrink-0">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-zinc-800 leading-tight truncate">{activity.msg}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-zinc-450 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {activity.time}
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-[10px] text-brand-red font-black uppercase tracking-wider flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {activity.info}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
