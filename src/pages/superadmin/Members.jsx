import React, { useState } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  Layers, 
  Users, 
  Award, 
  BookOpen,
  ChevronRight,
  Eye,
  Calendar
} from 'lucide-react';
import { mockGlobalMembers, mockRegions } from '../../data/mockConclaveData';

export default function SuperadminMembers({ searchQuery }) {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [activeMember, setActiveMember] = useState(null);

  // Filter list
  const filteredMembers = mockGlobalMembers.filter(member => {
    const q = searchQuery ? searchQuery.toLowerCase() : '';
    const matchesSearch = 
      member.name.toLowerCase().includes(q) || 
      member.company.toLowerCase().includes(q) || 
      member.category.toLowerCase().includes(q) || 
      member.chapter.toLowerCase().includes(q);
    
    const matchesRegion = selectedRegion === 'All' ? true : member.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-16 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-zinc-955 tracking-tight">Global Members Directory</h1>
          <p className="text-xs text-zinc-500 font-semibold">Directory index of all registered BNI members across regional databases.</p>
        </div>
      </div>

      {/* Filter Row */}
      <section className="flex justify-between items-center bg-white border border-zinc-200 rounded-xl p-4.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-zinc-450 uppercase tracking-widest shrink-0">Filter Region:</span>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="h-9 px-2.5 bg-zinc-55 border border-zinc-200 rounded-lg text-body-sm font-bold text-zinc-700 focus:outline-hidden focus:ring-1 focus:ring-brand-red focus:border-brand-red cursor-pointer"
          >
            <option value="All">All Regions</option>
            {mockRegions.map(reg => (
              <option key={reg.id} value={reg.name}>{reg.name}</option>
            ))}
          </select>
        </div>

        <span className="text-[11px] font-bold text-zinc-450">
          Showing {filteredMembers.length} of {mockGlobalMembers.length} Members
        </span>
      </section>

      {/* Members Table */}
      <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black text-zinc-455 uppercase tracking-wider">
                <th className="p-4 pl-6">Member Name</th>
                <th className="p-4">Business Category</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Company</th>
                <th className="p-4">BNI Chapter</th>
                <th className="p-4">Region</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-[12.5px] font-semibold text-zinc-700">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <button 
                      onClick={() => setActiveMember(member)}
                      className="font-black text-zinc-900 hover:text-brand-red text-left cursor-pointer"
                    >
                      {member.name}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 bg-red-50 text-brand-red text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {member.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-900 font-bold leading-tight select-all">{member.email}</span>
                      <span className="text-[10px] text-zinc-450 font-semibold mt-0.5 select-all">{member.mobile}</span>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-500 font-bold">{member.company}</td>
                  <td className="p-4 text-zinc-500">{member.chapter}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-550 text-[10px] font-bold rounded-full">
                      {member.region}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => setActiveMember(member)}
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

      {/* Member detail drawer */}
      {activeMember && (
        <>
          <div 
            onClick={() => setActiveMember(null)}
            className="fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300"
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-[60] p-6 overflow-y-auto border-l border-zinc-200 animate-slide-in flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
                <div>
                  <h2 className="text-base font-black text-zinc-900 leading-tight">Member Profile overview</h2>
                  <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Member ID: {activeMember.id}</p>
                </div>
                <button 
                  onClick={() => setActiveMember(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-455"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3.5 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <div className="w-12 h-12 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center font-black text-[13px]">
                    {activeMember.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-[13.5px] font-black text-zinc-900 leading-none">{activeMember.name}</h3>
                    <p className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider mt-1">{activeMember.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-2xs">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Business category</span>
                    <span className="text-body-sm font-bold text-brand-red mt-1 block truncate uppercase tracking-wider">{activeMember.category}</span>
                  </div>
                  <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-2xs">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">BNI Region node</span>
                    <span className="text-body-sm font-bold text-zinc-800 mt-1 block truncate">{activeMember.region}</span>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-3.5 pt-2">
                  <h4 className="text-[11px] font-black text-zinc-450 uppercase tracking-widest px-0.5">Contact Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-2xs">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Email Address</span>
                      <span className="text-body-sm font-bold text-zinc-800 mt-1 block truncate select-all">{activeMember.email}</span>
                    </div>
                    <div className="p-3.5 bg-white border border-zinc-200 rounded-xl shadow-2xs">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Mobile Number</span>
                      <span className="text-body-sm font-bold text-zinc-800 mt-1 block select-all">{activeMember.mobile}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-zinc-450 font-bold">BNI Chapter</span>
                    <span className="text-zinc-800 font-black">{activeMember.chapter}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-zinc-455 font-bold">Active Table Seating</span>
                    <span className="text-brand-red font-black flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Table 05 (Floor 1)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-zinc-455 font-bold">Membership tier</span>
                    <span className="text-zinc-800 font-black">Platinum tier</span>
                  </div>
                </div>

                {/* Past Conclave matches logs */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-0.5">Recent Seating History</h4>
                  <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200">
                    {[
                      { title: "Annual Global Summit 2024", date: "Oct 12, 2024", table: "Table 14", captain: "Rohan Wagle" },
                      { title: "Regional Directors Meet", date: "Aug 24, 2024", table: "Table 02", captain: "Sanjay Joshi" }
                    ].map((history, idx) => (
                      <div key={idx} className="p-3.5 bg-white hover:bg-zinc-50/50 transition-colors text-body-sm">
                        <div className="flex justify-between items-start">
                          <p className="font-black text-zinc-800">{history.title}</p>
                          <span className="text-[9px] text-zinc-400 font-semibold">{history.date}</span>
                        </div>
                        <p className="text-[10px] text-zinc-450 font-semibold mt-1">Seated at {history.table} (Captain: {history.captain})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <button 
                onClick={() => setActiveMember(null)}
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
