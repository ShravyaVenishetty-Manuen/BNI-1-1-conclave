import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  RefreshCw, 
  ArrowUpDown, 
  MessageSquare, 
  X, 
  Award, 
  Star, 
  Users, 
  Clock, 
  Check, 
  FileText 
} from 'lucide-react';

export default function MemberConclaveHistory({ loggedInMember }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedConclave, setSelectedConclave] = useState(null);

  // Conclaves mock data
  const conclaves = [
    {
      id: 1,
      title: "Annual Global Summit 2024",
      status: "Completed",
      location: "Grand Hyatt, Dubai",
      date: "Oct 12, 2024",
      year: "2024",
      rounds: "6/6 Rounds",
      icon: "event_available",
      details: {
        subtitle: "Global Summit 2024",
        rounds: [
          { name: "Round 1 (9:00 AM)", table: "Table #14", captain: "Rohan Wagle", attendeesCount: 5 },
          { name: "Round 2 (10:30 AM)", table: "Table #08", captain: "Ekta Ramachandran", attendeesCount: 5 },
          { name: "Round 3 (12:00 PM)", table: "Networking Lunch", type: "Lunch" }
        ],
        contacts: 34,
        referrals: 12,
        recommendation: "Significant interest from the Logistics sector in Round 2. Follow-up recommended with Rohan Wagle."
      }
    },
    {
      id: 2,
      title: "Regional Directors Meet",
      status: "Completed",
      location: "Convention Centre, Mumbai",
      date: "Aug 24, 2024",
      year: "2024",
      rounds: "4/4 Rounds",
      icon: "corporate_fare",
      details: {
        subtitle: "Regional Directors Meet",
        rounds: [
          { name: "Round 1 (10:00 AM)", table: "Table #02", captain: "Sanjay Joshi", attendeesCount: 4 },
          { name: "Round 2 (11:30 AM)", table: "Table #05", captain: "Manish Tiwari", attendeesCount: 4 }
        ],
        contacts: 21,
        referrals: 8,
        recommendation: "Strong synergy with Manish Tiwari regarding real estate leads. Schedule one-to-one."
      }
    },
    {
      id: 3,
      title: "Quarterly Synergy 2024 Q2",
      status: "Cancelled",
      location: "Virtual Event",
      date: "May 15, 2024",
      year: "2024",
      rounds: "0/4 Rounds",
      icon: "event_busy"
    },
    {
      id: 4,
      title: "National Business Conclave 2023",
      status: "Completed",
      location: "Taj Palace, New Delhi",
      date: "Dec 05, 2023",
      year: "2023",
      rounds: "6/6 Rounds",
      icon: "event_available",
      details: {
        subtitle: "National Conclave 2023",
        rounds: [
          { name: "Round 1 (9:00 AM)", table: "Table #11", captain: "Deepak Chawla", attendeesCount: 6 },
          { name: "Round 2 (10:30 AM)", table: "Table #03", captain: "Meera Gupta", attendeesCount: 6 }
        ],
        contacts: 28,
        referrals: 15,
        recommendation: "Deepak Chawla expressed interest in digital marketing collaboration."
      }
    }
  ];

  // Filtered conclaves list
  const filteredConclaves = conclaves.filter(conclave => {
    const matchesSearch = conclave.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          conclave.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === 'All' ? true : conclave.year === selectedYear;
    const matchesStatus = selectedStatus === 'All' ? true : conclave.status === selectedStatus;
    return matchesSearch && matchesYear && matchesStatus;
  });

  const handleOpenDrawer = (conclave) => {
    if (conclave.status === 'Cancelled') return;
    setSelectedConclave(conclave);
    setShowDrawer(true);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-955 tracking-tight">Conclave History</h1>
        <p className="text-xs text-zinc-500 font-semibold mt-1">Review your participation, connections, and achievements from past conclaves.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Content (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* KPI Summary Cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Conclaves", value: 12 },
              { label: "Rounds Participated", value: 72 },
              { label: "People Met", value: 432 },
              { label: "Business Categories", value: 48 }
            ].map((kpi, idx) => (
              <div 
                key={idx} 
                className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col items-center text-center justify-center min-h-[92px]"
              >
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">{kpi.label}</span>
                <span className="text-xl md:text-2xl font-black text-brand-red mt-1.5 leading-none">{kpi.value}</span>
              </div>
            ))}
          </section>



          {/* Filter Bar */}
          <section className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conclaves..."
                className="w-full h-10 pl-10 pr-4 bg-white border border-zinc-250 rounded-lg text-[12.5px] font-semibold text-zinc-800 placeholder-zinc-400 focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:outline-hidden"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-10 px-3.5 bg-white border border-zinc-250 rounded-lg text-[12px] font-black uppercase tracking-wider text-zinc-600 focus:ring-1 focus:ring-brand-red focus:outline-hidden"
              >
                <option value="All">All Years</option>
                <option value="2024">Year: 2024</option>
                <option value="2023">Year: 2023</option>
              </select>

              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 px-3.5 bg-white border border-zinc-250 rounded-lg text-[12px] font-black uppercase tracking-wider text-zinc-600 focus:ring-1 focus:ring-brand-red focus:outline-hidden"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>


            </div>
          </section>

          {/* History Cards List */}
          <section className="space-y-4">
            {filteredConclaves.length > 0 ? (
              filteredConclaves.map((conclave) => (
                <div 
                  key={conclave.id} 
                  className={`bg-white border border-zinc-200 rounded-xl shadow-2xs hover:shadow-xs transition-smooth group ${
                    conclave.status === 'Cancelled' ? 'opacity-65' : ''
                  }`}
                >
                  <div className="p-5 flex flex-col md:flex-row md:items-center gap-5">
                    <div className="w-14 h-14 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                      {conclave.status === 'Cancelled' ? (
                        <X className="w-6 h-6 text-zinc-400" />
                      ) : (
                        <Check className="w-6 h-6 text-brand-red stroke-[2.5]" />
                      )}
                    </div>
                    
                    <div className="flex-grow space-y-1.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-body-md font-black text-zinc-900 leading-tight group-hover:text-brand-red transition-smooth">
                          {conclave.title}
                        </h3>
                        <span className={`px-2 py-0.5 text-[8.5px] font-black rounded uppercase tracking-wider ${
                          conclave.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-zinc-150 text-zinc-500 border border-zinc-200'
                        }`}>
                          {conclave.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-450 text-[11px] font-semibold leading-none">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" /> 
                          {conclave.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" /> 
                          {conclave.date}
                        </span>
                        {conclave.status !== 'Cancelled' && (
                          <span className="flex items-center gap-1.5 text-brand-red font-black">
                            <RefreshCw className="w-3 h-3 animate-spin-slow" /> 
                            {conclave.rounds}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenDrawer(conclave)}
                      disabled={conclave.status === 'Cancelled'}
                      className={`shrink-0 h-10 px-4.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-smooth ${
                        conclave.status === 'Cancelled'
                          ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
                          : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-2xs cursor-pointer'
                      }`}
                    >
                      {conclave.status === 'Cancelled' ? 'No Details' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center text-zinc-400 font-semibold shadow-2xs">
                No past conclaves found matching your search.
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Sidebar (4 cols) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Industry Distribution */}
          <section className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h2 className="text-body-md font-black text-zinc-900">Industry Distribution</h2>
            <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Top industries connected in past seating rounds.</p>
            
            <div className="space-y-3.5 pt-2">
              {[
                { name: "Information Technology", percentage: 32, count: 23, color: "bg-brand-red" },
                { name: "Real Estate & Construction", percentage: 24, count: 17, color: "bg-red-700" },
                { name: "Financial Services", percentage: 18, count: 13, color: "bg-red-500" },
                { name: "Marketing & Advertising", percentage: 15, count: 11, color: "bg-red-300" },
                { name: "Healthcare & Pharmaceuticals", percentage: 11, count: 8, color: "bg-red-200" }
              ].map((ind, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-black text-zinc-755 leading-none">
                    <span>{ind.name}</span>
                    <span className="text-zinc-500 font-extrabold">{ind.count} met ({ind.percentage}%)</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`${ind.color} h-full rounded-full`}
                      style={{ width: `${ind.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Connections Sidebar */}
          <section className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
              <h2 className="text-body-sm font-black text-zinc-900">Recent Connections</h2>
              <span className="text-brand-red font-black text-[9px] uppercase tracking-wider select-none">Top 3</span>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Shalini Sen", title: "Founder, Nexus Tech", initials: "SS" },
                { name: "Mukul Arya", title: "Lead Architect, ArchiBuild", initials: "MA" },
                { name: "Priya Sharma", title: "Director, WealthWise", initials: "PS" }
              ].map((person, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-[10.5px] text-zinc-550 shrink-0 group-hover:border-brand-red/35 transition-smooth select-none">
                    {person.initials}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-[12.5px] font-black text-zinc-850 group-hover:text-brand-red transition-smooth truncate leading-none">{person.name}</p>
                    <p className="text-[10px] text-zinc-450 font-semibold truncate leading-none mt-1">{person.title}</p>
                  </div>

                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Drawer Overlay */}
      {showDrawer && selectedConclave && (
        <div 
          onClick={() => setShowDrawer(false)}
          className="fixed inset-0 bg-zinc-950/45 backdrop-blur-xs z-50 transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Detail Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-55 transition-transform duration-300 border-l border-zinc-200 flex flex-col ${
          showDrawer && selectedConclave ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedConclave && (
          <>
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div>
                <h2 className="text-body-md font-black text-zinc-900 leading-tight">Conclave Details</h2>
                <p className="text-[11px] text-zinc-450 font-semibold mt-0.5">{selectedConclave.details?.subtitle}</p>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-150 p-1.5 rounded-lg transition-smooth cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Round Timeline */}
              <div className="space-y-4">
                <h3 className="text-body-sm font-black text-zinc-900 border-b border-zinc-100 pb-2">Round Timeline</h3>
                <div className="space-y-6 relative pl-4 border-l border-zinc-200 ml-2 pt-1">
                  
                  {selectedConclave.details?.rounds.map((rnd, rIdx) => (
                    <div key={rIdx} className="relative">
                      {/* Circle bullet */}
                      <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-brand-red bg-white"></span>
                      
                      <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3.5 space-y-2.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[11.5px] font-black text-zinc-800">{rnd.name}</span>
                          {rnd.table && (
                            <span className="px-1.5 py-0.5 bg-zinc-200/60 text-zinc-650 text-[9px] font-black rounded uppercase tracking-wide leading-none">{rnd.table}</span>
                          )}
                        </div>
                        {rnd.captain && (
                          <p className="text-[11px] text-zinc-500 font-semibold">
                            Captain: <strong className="text-zinc-700 font-bold">{rnd.captain}</strong>
                          </p>
                        )}
                        {rnd.type === 'Lunch' && (
                          <p className="text-[11px] text-zinc-400 italic font-semibold">Self-organized table transitions</p>
                        )}
                        {rnd.attendeesCount && (
                          <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-1.5">
                              <span className="w-5 h-5 rounded-full bg-zinc-100 border border-white text-[7px] font-bold flex items-center justify-center">AA</span>
                              <span className="w-5 h-5 rounded-full bg-zinc-100 border border-white text-[7px] font-bold flex items-center justify-center">KV</span>
                              <span className="w-5 h-5 rounded-full bg-zinc-100 border border-white text-[7px] font-bold flex items-center justify-center">RS</span>
                            </div>
                            <span className="text-[9.5px] text-zinc-400 font-semibold">+{rnd.attendeesCount - 2} met</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                </div>
              </div>

              {/* Event Impact */}
              <div className="space-y-4">
                <h3 className="text-body-sm font-black text-zinc-900 border-b border-zinc-100 pb-2">Event Impact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 border border-zinc-200/80 p-4 rounded-xl text-center">
                    <p className="text-brand-red font-black text-xl leading-none">{selectedConclave.details?.contacts}</p>
                    <p className="text-[9.5px] text-zinc-450 font-bold uppercase tracking-wider mt-2">New Contacts</p>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200/80 p-4 rounded-xl text-center">
                    <p className="text-brand-red font-black text-xl leading-none">{selectedConclave.details?.referrals}</p>
                    <p className="text-[9.5px] text-zinc-450 font-bold uppercase tracking-wider mt-2">Referrals Given</p>
                  </div>
                </div>

                {selectedConclave.details?.recommendation && (
                  <div className="bg-red-50/50 border border-red-100/50 p-4 rounded-xl">
                    <p className="text-brand-red text-[11px] italic font-semibold leading-relaxed">
                      "{selectedConclave.details.recommendation}"
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-zinc-200 bg-zinc-50">
              <button className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer shadow-sm flex items-center justify-center gap-1.5">
                <FileText className="w-4 h-4" />
                Download Attendance Certificate
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
