import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Layers,
  Users,
  Award,
  Eye,
  ArrowLeft,
  User,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';

export default function SuperadminConclaves({ searchQuery }) {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [activeConclave, setActiveConclave] = useState(null);
  const [conclaves, setConclaves] = useState([]);
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [conclavesList, regionsList] = await Promise.all([
          api.get('/admin/conclaves'),
          api.get('/admin/regions')
        ]);
        setConclaves(conclavesList || []);
        setRegions(regionsList || []);
      } catch (err) {
        console.error("Failed to load conclaves/regions:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (activeConclave) {
    return (
      <ConclaveDetailView 
        conclave={activeConclave}
        onBack={() => setActiveConclave(null)}
      />
    );
  }

  // Filter lists
  const filteredConclaves = conclaves.filter(conclave => {
    const q = searchQuery ? searchQuery.toLowerCase() : '';
    const title = conclave.name || conclave.title || '';
    const venue = conclave.venueLocation || conclave.venue || '';
    const matchesSearch = title.toLowerCase().includes(q) || venue.toLowerCase().includes(q);
    const matchesStatus = selectedStatus === 'All'
      ? true
      : conclave.status?.toLowerCase() === selectedStatus.toLowerCase();
    const matchesRegion = selectedRegion === 'All'
      ? true
      : (conclave.region || 'Guntur Region') === selectedRegion;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-16 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
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
              className={`px-3.5 py-1.5 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer ${selectedStatus === status
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
            {regions.map(reg => (
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
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black text-zinc-450 uppercase tracking-wider">
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
            <tbody className="divide-y divide-zinc-200 text-[12.5px] font-semibold text-zinc-700">
              {filteredConclaves.map((conclave) => (
                <tr key={conclave.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <button
                      onClick={() => setActiveConclave(conclave)}
                      className="font-black text-zinc-900 text-left cursor-pointer"
                    >
                      {conclave.name || conclave.title || 'Unnamed Conclave'}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-550 text-[10px] font-bold rounded-full whitespace-nowrap">
                      {conclave.region || 'Guntur Region'}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-500">{conclave.creator || 'Superadmin'}</td>
                  <td className="p-4 text-zinc-500 truncate max-w-[160px]">{conclave.venueLocation || conclave.venue || 'TBD Venue'}</td>
                  <td className="p-4 text-center font-bold text-zinc-800">{Math.ceil((conclave.registrationCount || conclave.membersCount || 0) / (conclave.personsPerTable || 7)) || 1} tables</td>
                  <td className="p-4 text-center font-bold text-zinc-800">{conclave.registrationCount || conclave.membersCount || 0} members</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${conclave.status?.toLowerCase() === 'completed'
                        ? 'bg-zinc-100 text-zinc-550 border border-zinc-200'
                        : conclave.status?.toLowerCase() === 'active' || conclave.status?.toLowerCase() === 'running'
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

    </div>
  );
}

function ConclaveDetailView({ conclave, onBack }) {
  const derivedTables = conclave.tablesCount || Math.ceil((conclave.registrationCount || conclave.membersCount || 0) / (conclave.personsPerTable || 7)) || 1;
  // Mock table seating structure
  const mockTableSeating = [
    {
      id: "tbl-1",
      number: "01",
      captain: "Rohan Wagle",
      members: [
        { name: "Anjali Sharma", category: "IT Infrastructure", company: "Zenith Systems", chapter: "Apex Chapter" },
        { name: "Manish Tiwari", category: "Real Estate", company: "Prime Realty Group", chapter: "Apex Chapter" },
        { name: "Anita Rao", category: "Digital Marketing", company: "Spark Media", chapter: "Prosperity Chapter" },
        { name: "Deepak Chawla", category: "Supply Chain", company: "Logistics Pro", chapter: "Prosperity Chapter" }
      ]
    },
    {
      id: "tbl-2",
      number: "02",
      captain: "Sanjay Joshi",
      members: [
        { name: "Meera Nair", category: "Business Consultant", company: "Nair & Associates", chapter: "Apex Chapter" },
        { name: "Suresh Pillai", category: "Financial Services", company: "Pillai Wealth", chapter: "Prosperity Chapter" },
        { name: "Ramesh Kumar", category: "Legal Advisory", company: "Kumar Law", chapter: "Phoenix Central" },
        { name: "Vikram Sen", category: "Retail Distribution", company: "Sen Retailers", chapter: "London Central Elite" }
      ]
    },
    {
      id: "tbl-3",
      number: "03",
      captain: "John Doe",
      members: [
        { name: "Ekta Ramachandran", category: "Law & Legal", company: "Rodriguez Partners", chapter: "Phoenix Central" },
        { name: "Ganesh Viswanathan", category: "Financial Planning", company: "WealthWise Advisors", chapter: "Phoenix Central" },
        { name: "Siddharth Mehta", category: "Commercial Realty", company: "Mehta Developers", chapter: "London Central Elite" },
        { name: "Priya Nair", category: "Wealth Management", company: "Nair Finance", chapter: "London Central Elite" }
      ]
    },
    {
      id: "tbl-4",
      number: "04",
      captain: "Jane Smith",
      members: [
        { name: "Kunal Shah", category: "Digital Marketing", company: "Shah Marketing Agency", chapter: "Singapore Prosperity" },
        { name: "Sneha Reddy", category: "Logistics", company: "Reddy Shipping", chapter: "Singapore Prosperity" },
        { name: "Amit Patel", category: "Software Development", company: "Patel Solutions", chapter: "Apex Chapter" },
        { name: "Neha Gupta", category: "Human Resources", company: "Gupta Consultants", chapter: "Prosperity Chapter" }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-16">
      {/* Header with Back button */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-body-sm font-black text-zinc-500 uppercase tracking-wider hover:text-zinc-800 transition-smooth cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Conclaves
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-zinc-955 tracking-tight">{conclave.name || conclave.title || 'Unnamed Conclave'}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${
                conclave.status?.toLowerCase() === 'completed' 
                  ? 'bg-zinc-150 text-zinc-550 border border-zinc-200' 
                  : conclave.status?.toLowerCase() === 'active' || conclave.status?.toLowerCase() === 'running'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                  : 'bg-red-50 text-brand-red border border-red-100'
              }`}>
                {conclave.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-semibold flex items-center gap-1.5 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {conclave.venueLocation || conclave.venue || 'TBD Venue'}
              <span className="text-zinc-300">•</span>
              <span>Region: {conclave.region || 'Guntur Region'}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Created By</span>
            <span className="text-body-sm font-black text-zinc-900 flex items-center sm:justify-end gap-1.5 mt-1">
              <User className="w-4 h-4 text-zinc-400" />
              {conclave.creator || 'Superadmin'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Assigned Stations</span>
          <span className="text-2xl font-black text-brand-red block mt-2">{derivedTables} Tables</span>
          <span className="text-[10px] text-zinc-455 font-semibold block mt-1">Structured 1-to-1 rooms</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Total Checked In</span>
          <span className="text-2xl font-black text-brand-red block mt-2">{conclave.registrationCount || conclave.membersCount || 0} Members</span>
          <div className="w-full bg-zinc-150 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, ((conclave.registrationCount || conclave.membersCount || 0) / (derivedTables * 4)) * 100)}%` }} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Table Captains</span>
          <span className="text-2xl font-black text-brand-red block mt-2">8 Assigned</span>
          <span className="text-[10px] text-zinc-450 font-semibold block mt-1">Monitoring active check-ins</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Category Diversity</span>
          <span className="text-2xl font-black text-brand-red block mt-2">12 Niches</span>
          <span className="text-[10px] text-zinc-455 font-semibold block mt-1">Zero category collisions</span>
        </div>
      </section>

      {/* Main Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (2/3 width) - Tables Seating Map */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs p-5">
            <div className="mb-4">
              <h2 className="text-body-md font-black text-zinc-900 leading-tight">Active Seating Map</h2>
              <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Round-by-round seat assignments and table captain details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTableSeating.map((table) => (
                <div key={table.id} className="border border-zinc-200 rounded-xl overflow-hidden shadow-3xs flex flex-col bg-zinc-50/20">
                  <div className="bg-zinc-50 p-3 border-b border-zinc-200 flex justify-between items-center">
                    <span className="text-xs font-black text-zinc-900">Station (Table {table.number})</span>
                    <span className="text-[10px] font-bold text-zinc-550">Captain: <strong className="font-extrabold text-zinc-800">{table.captain}</strong></span>
                  </div>
                  
                  <div className="p-3.5 divide-y divide-zinc-200 space-y-2.5">
                    {table.members.map((member, mIdx) => (
                      <div key={mIdx} className="pt-2.5 first:pt-0 flex justify-between items-start text-body-sm gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-800 leading-tight truncate">{member.name}</p>
                          <p className="text-[9.5px] text-zinc-450 font-semibold leading-normal truncate">{member.company}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="px-1.5 py-0.5 bg-red-50 text-brand-red rounded text-[8.5px] font-extrabold uppercase tracking-wide leading-none">{member.category}</span>
                          <span className="text-[8.5px] text-zinc-400 font-bold">{member.chapter}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (1/3 width) - Sessions & Action Logs */}
        <div className="space-y-6">
          {/* Conclave Schedule */}
          <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs p-5">
            <div className="mb-4">
              <h2 className="text-body-md font-black text-zinc-900 leading-tight">Schedule & Sessions</h2>
              <p className="text-[10px] text-zinc-455 font-semibold mt-0.5">Timeline layout of rounds and agendas.</p>
            </div>

            <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200">
              {[
                { name: "Round 1 (09:00 AM)", type: "Structured pairings 1-to-1 matching", status: "Active" },
                { name: "Round 2 (10:30 AM)", type: "Commercial realty niche focus session", status: "Active" },
                { name: "Round 3 (12:00 PM)", type: "Networking luncheon gathering", status: "Lunch" }
              ].map((round, idx) => (
                <div key={idx} className="p-3.5 flex justify-between items-center text-body-sm bg-white">
                  <div>
                    <p className="font-black text-zinc-800 leading-tight">{round.name}</p>
                    <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">{round.type}</p>
                  </div>
                  <span className="text-[9px] bg-zinc-50 border border-zinc-200 text-zinc-550 font-bold px-2.5 py-0.5 rounded-full">
                    {round.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* System logs */}
          <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs p-5">
            <div className="mb-4">
              <h2 className="text-body-md font-black text-zinc-900 leading-tight">Conclave Operations Log</h2>
              <p className="text-[10px] text-zinc-455 font-semibold mt-0.5">Audit log of system events for this conclave.</p>
            </div>

            <div className="space-y-3.5">
              {[
                { text: "Pairing matrix validated successfully", time: "09:00 AM", status: "success" },
                { text: "Table 04 Captain Rohan Wagle triggered Round 1 timers", time: "09:05 AM", status: "info" },
                { text: "Warning: Table 02 Captain Sanjay Joshi check-in delayed", time: "09:12 AM", status: "warning" },
                { text: "Superadmin verified matching schedule", time: "Yesterday", status: "success" }
              ].map((log, lIdx) => (
                <div key={lIdx} className="flex gap-2.5 items-start text-body-sm">
                  <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                    log.status === 'success' ? 'bg-emerald-500' : log.status === 'warning' ? 'bg-amber-500' : 'bg-brand-red'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-800 leading-tight">{log.text}</p>
                    <span className="text-[9.5px] text-zinc-400 font-semibold mt-0.5 block">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

    </div>
  );
}
