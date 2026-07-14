import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Layers, 
  Users, 
  Award, 
  SlidersHorizontal,
  ChevronRight,
  Eye
} from 'lucide-react';
import { mockGlobalConclaves, mockRegions } from '../../data/mockConclaveData';

export default function SuperadminConclaves({ searchQuery }) {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [activeConclave, setActiveConclave] = useState(null);

  // Filter lists
  const filteredConclaves = mockGlobalConclaves.filter(conclave => {
    const q = searchQuery ? searchQuery.toLowerCase() : '';
    const matchesSearch = conclave.title.toLowerCase().includes(q) || conclave.venue.toLowerCase().includes(q);
    const matchesStatus = selectedStatus === 'All' ? true : conclave.status === selectedStatus;
    const matchesRegion = selectedRegion === 'All' ? true : conclave.region === selectedRegion;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-16 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-zinc-955 tracking-tight">Global Conclaves</h1>
          <p className="text-xs text-zinc-500 font-semibold">Oversight of conclaves created across all regions and administrator hubs.</p>
        </div>
      </div>

      {/* Filter Row */}
      <section className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white border border-zinc-200 rounded-xl p-4.5 shadow-2xs">
        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {['All', 'Active', 'Completed', 'Upcoming'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer ${
                selectedStatus === status 
                  ? 'bg-brand-red text-white' 
                  : 'bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-zinc-450 uppercase tracking-widest shrink-0">Filter Region:</span>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="h-9 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-body-sm font-bold text-zinc-700 focus:outline-hidden focus:ring-1 focus:ring-brand-red focus:border-brand-red cursor-pointer"
          >
            <option value="All">All Regions</option>
            {mockRegions.map(reg => (
              <option key={reg.id} value={reg.name}>{reg.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Conclaves Table */}
      <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-black text-zinc-450 uppercase tracking-wider">
                <th className="p-4 pl-6">Conclave Title</th>
                <th className="p-4">Region</th>
                <th className="p-4">Creator</th>
                <th className="p-4">Venue</th>
                <th className="p-4 text-center">Tables Count</th>
                <th className="p-4 text-center">Members Checked In</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 text-[12.5px] font-semibold text-zinc-700">
              {filteredConclaves.map((conclave) => (
                <tr key={conclave.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <button 
                      onClick={() => setActiveConclave(conclave)}
                      className="font-black text-zinc-900 hover:text-brand-red hover:underline text-left cursor-pointer"
                    >
                      {conclave.title}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-550 text-[10px] font-bold rounded-full">
                      {conclave.region}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-500">{conclave.creator}</td>
                  <td className="p-4 text-zinc-500 truncate max-w-[160px]">{conclave.venue}</td>
                  <td className="p-4 text-center font-bold text-zinc-800">{conclave.tablesCount} tables</td>
                  <td className="p-4 text-center font-bold text-zinc-800">{conclave.membersCount} members</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      conclave.status === 'Completed' 
                        ? 'bg-zinc-100 text-zinc-550 border border-zinc-200' 
                        : conclave.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                        : 'bg-red-50 text-brand-red border border-red-100'
                    }`}>
                      {conclave.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => setActiveConclave(conclave)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 transition-smooth cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Conclave detail drawer */}
      {activeConclave && (
        <>
          <div 
            onClick={() => setActiveConclave(null)}
            className="fixed inset-0 bg-zinc-955/40 backdrop-blur-xs z-40 transition-opacity duration-300"
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 p-6 overflow-y-auto border-l border-zinc-200 animate-slide-in flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                <div>
                  <h2 className="text-base font-black text-zinc-900 leading-tight">Conclave Event overview</h2>
                  <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Conclave ID: {activeConclave.id}</p>
                </div>
                <button 
                  onClick={() => setActiveConclave(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-455"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3.5 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <div className="w-12 h-12 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[13.5px] font-black text-zinc-900 leading-none">{activeConclave.title}</h3>
                    <p className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider mt-1">{activeConclave.region}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-2xs">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Venue Place</span>
                    <span className="text-body-sm font-bold text-zinc-800 mt-1 block truncate">{activeConclave.venue}</span>
                  </div>
                  <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-2xs">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Creator Admin</span>
                    <span className="text-body-sm font-bold text-zinc-800 mt-1 block truncate">{activeConclave.creator}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 bg-zinc-50/50 border border-zinc-200 rounded-xl flex flex-col items-center justify-center text-center">
                    <Layers className="w-4.5 h-4.5 text-brand-red shrink-0 mb-1" />
                    <span className="text-[9px] font-black text-zinc-450 uppercase tracking-wider">Tables</span>
                    <span className="text-[13px] font-black text-zinc-900 mt-0.5">{activeConclave.tablesCount} Assigned</span>
                  </div>
                  <div className="p-3.5 bg-zinc-50/50 border border-zinc-200 rounded-xl flex flex-col items-center justify-center text-center">
                    <Users className="w-4.5 h-4.5 text-brand-red shrink-0 mb-1" />
                    <span className="text-[9px] font-black text-zinc-450 uppercase tracking-wider">Checked In</span>
                    <span className="text-[13px] font-black text-zinc-900 mt-0.5">{activeConclave.membersCount} Members</span>
                  </div>
                  <div className="p-3.5 bg-zinc-50/50 border border-zinc-200 rounded-xl flex flex-col items-center justify-center text-center">
                    <Award className="w-4.5 h-4.5 text-brand-red shrink-0 mb-1" />
                    <span className="text-[9px] font-black text-zinc-450 uppercase tracking-wider">Captains</span>
                    <span className="text-[13px] font-black text-zinc-900 mt-0.5">8 Assigned</span>
                  </div>
                </div>

                {/* Schedule timeline outline */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-0.5">Schedule &amp; Sessions</h4>
                  <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-150">
                    {[
                      { name: "Round 1 (09:00 AM)", type: "Structured pairings 1-to-1 matching", status: "Active" },
                      { name: "Round 2 (10:30 AM)", type: "Commercial realty niche focus session", status: "Active" },
                      { name: "Round 3 (12:00 PM)", type: "Networking luncheon gathering", status: "Lunch" }
                    ].map((round, idx) => (
                      <div key={idx} className="p-3.5 flex justify-between items-center text-body-sm bg-white">
                        <div>
                          <p className="font-black text-zinc-800">{round.name}</p>
                          <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">{round.type}</p>
                        </div>
                        <span className="text-[9px] bg-zinc-50 border border-zinc-200 text-zinc-500 font-bold px-2.5 py-0.5 rounded-full">
                          {round.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-150">
              <button 
                onClick={() => setActiveConclave(null)}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition-smooth cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
