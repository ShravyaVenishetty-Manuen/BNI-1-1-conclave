import React, { useState, useMemo } from 'react';
import Pagination from '../components/Pagination';
import {
  Printer,
  FileSpreadsheet,
  FileDown,
  Calendar,
  Search,
  CheckCircle2,
  TrendingUp,
  X,
  PieChart as PieChartIcon,
  Users,
  RefreshCw,
  Shield
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import reportsSeed from '../data/reports_data.json';
const { initialMembers, conclaveList } = reportsSeed;

export default function Reports({ searchQuery: globalSearchQuery }) {
  const [activeConclaveIndex, setActiveConclaveIndex] = useState(0);
  const [isConclaveSelectorOpen, setIsConclaveSelectorOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const searchVal = globalSearchQuery !== undefined ? globalSearchQuery : localSearchQuery;
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  const selectedConclave = conclaveList[activeConclaveIndex];

  // Recharts Participation Data (R1 - R6)
  const barData = [
    { name: 'R1', Members: 1100, Captains: 40 },
    { name: 'R2', Members: 1150, Captains: 42 },
    { name: 'R3', Members: 1200, Captains: 45 },
    { name: 'R4', Members: 1180, Captains: 44 },
    { name: 'R5', Members: 1120, Captains: 41 },
    { name: 'R6', Members: 1240, Captains: 48 }
  ];

  // Recharts Business Diversity Data
  const donutData = [
    { name: 'Finance', value: 34, color: '#af101a' },     // BNI Brand Red
    { name: 'Marketing', value: 28, color: '#bee9ff' },   // Slate Tertiary
    { name: 'Legal', value: 22, color: '#005f7b' },       // Teal
    { name: 'Technology', value: 16, color: '#ffe2de' }   // Soft Red Container
  ];

  // Recharts Mini Gauge Data
  const satisfactionData = [{ value: 90 }, { value: 10 }];
  const diversityData = [{ value: 95 }, { value: 5 }];
  const captainData = [{ value: 80 }, { value: 20 }];

  const [filterRound, setFilterRound] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCaptain, setFilterCaptain] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Seating Table filter
  const filteredMembers = useMemo(() => {
    return initialMembers.filter(m => {
      const matchSearch = !searchVal ||
        m.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        m.category.toLowerCase().includes(searchVal.toLowerCase()) ||
        m.captain.toLowerCase().includes(searchVal.toLowerCase());
      const matchCategory = filterCategory === 'all' || m.category === filterCategory;
      const matchCaptain = filterCaptain === 'all' || m.captain === filterCaptain;
      return matchSearch && matchCategory && matchCaptain;
    });
  }, [searchVal, filterCategory, filterCaptain]);

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  // Reset to page 1 on filter change
  React.useEffect(() => { setCurrentPage(1); }, [searchVal, filterCategory, filterCaptain]);

  // Export helpers
  const exportCSV = () => {
    const headers = ['Name', 'Region', 'Category', 'Captain', 'Rounds', 'Meetings', 'Status'];
    const rows = filteredMembers.map(m =>
      [m.name, m.region, m.category, m.captain, m.rounds, m.meetings, m.status]
        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conclave-report-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV Downloaded', `Exported ${filteredMembers.length} member records.`);
  };

  const exportPDF = () => {
    const printContent = `
      <html><head><title>Conclave Report</title>
      <style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#af101a;color:white}</style>
      </head><body>
      <h2>Conclave Report — ${selectedConclave.name}</h2>
      <p>${selectedConclave.details}</p>
      <table><thead><tr><th>Name</th><th>Region</th><th>Category</th><th>Captain</th><th>Rounds</th><th>Meetings</th><th>Status</th></tr></thead><tbody>
      ${filteredMembers.map(m => `<tr><td>${m.name}</td><td>${m.region}</td><td>${m.category}</td><td>${m.captain}</td><td>${m.rounds}</td><td>${m.meetings}</td><td>${m.status}</td></tr>`).join('')}
      </tbody></table></body></html>`;
    const w = window.open('', '_blank');
    w.document.write(printContent);
    w.document.close();
    w.focus();
    w.print();
    showToast('PDF Ready', 'Print dialog opened for PDF export.');
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in relative">

      {/* Header & Actions */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Reports & Analytics</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Analyze conclave attendance, participation, and scheduling metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-zinc-400" />
            Print Report
          </button>

          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
            Export CSV
          </button>

          <button
            onClick={exportPDF}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button rounded-lg transition-smooth shadow-md cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters Selection Card */}
      <section className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-wrap items-center gap-5 shadow-sm">
        <div className="flex flex-col gap-1 flex-1 min-w-[280px]">
          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider px-1">Selected Conclave</label>
          <div
            onClick={() => setIsConclaveSelectorOpen(true)}
            className="relative cursor-pointer border border-zinc-200 rounded-lg px-4 py-2.5 flex items-center justify-between hover:border-brand-red transition-smooth"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-brand-red" />
              <div>
                <p className="text-body-sm font-bold text-zinc-800">{selectedConclave.name}</p>
                <p className="text-[10px] text-zinc-450 font-semibold">{selectedConclave.details}</p>
              </div>
            </div>
            <span className="text-zinc-400 font-semibold">▼</span>
          </div>
        </div>

        <div className="hidden lg:block w-px h-10 bg-zinc-150" />

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider px-1">Date Range</label>
            <select
              value={filterRound}
              onChange={e => setFilterRound(e.target.value)}
              className="px-4 py-2.5 border border-zinc-200 bg-white rounded-lg text-body-sm font-bold text-zinc-700 transition-smooth cursor-pointer focus:outline-none focus:border-brand-red"
            >
              <option value="all">All Rounds</option>
              <option value="R1">Round 1</option>
              <option value="R2">Round 2</option>
              <option value="R3">Round 3</option>
              <option value="R4">Round 4</option>
              <option value="R5">Round 5</option>
              <option value="R6">Round 6</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider px-1">Business Type</label>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border border-zinc-200 bg-white rounded-lg text-body-sm font-bold text-zinc-700 transition-smooth cursor-pointer focus:outline-none focus:border-brand-red"
            >
              <option value="all">All Categories</option>
              <option value="LEGAL">Legal</option>
              <option value="MARKETING">Marketing</option>
              <option value="FINANCE">Finance</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider px-1">Captain</label>
            <select
              value={filterCaptain}
              onChange={e => setFilterCaptain(e.target.value)}
              className="px-4 py-2.5 border border-zinc-200 bg-white rounded-lg text-body-sm font-bold text-zinc-700 transition-smooth cursor-pointer focus:outline-none focus:border-brand-red"
            >
              <option value="all">All Captains</option>
              <option value="Shweta Iyer">Shweta Iyer</option>
              <option value="Manoj Kumar">Manoj Kumar</option>
            </select>
          </div>
        </div>
      </section>

      {/* KPI Dashboard Row */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-smooth">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-brand-red">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Members</p>
            <h4 className="text-headline-md font-extrabold text-zinc-950 mt-0.5">1,240</h4>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-smooth">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-500">
              <TrendingUp className="w-4.5 h-4.5 text-brand-red" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase">Unique Meetings</p>
            <h4 className="text-headline-md font-extrabold text-zinc-950 mt-0.5">98.4%</h4>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-smooth">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-500">
              <RefreshCw className="w-4.5 h-4.5 text-brand-red" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase">Repeat Pairings</p>
            <h4 className="text-headline-md font-extrabold text-zinc-950 mt-0.5">0%</h4>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-smooth">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-500">
              <CheckCircle2 className="w-4.5 h-4.5 text-brand-red" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase">Seating Quality</p>
            <h4 className="text-headline-md font-extrabold text-zinc-950 mt-0.5">
              96<span className="text-body-sm font-normal text-zinc-450">/100</span>
            </h4>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-smooth">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-500">
              <Shield className="w-4.5 h-4.5 text-brand-red" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase">Validation Score</p>
            <h4 className="text-headline-md font-extrabold text-zinc-950 mt-0.5">
              100<span className="text-body-sm font-normal text-zinc-450">/100</span>
            </h4>
          </div>
        </div>
      </section>

      {/* Analytics Main section */}
      <div className="space-y-6">

        {/* Charts & Tables Area */}
        <div className="space-y-6">

          {/* Bento Charts Block */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Recharts Bar Chart — wider */}
            <div className="lg:col-span-3 bg-white border border-zinc-200/80 p-5 rounded-xl h-[350px] flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-body-sm font-extrabold text-zinc-900 uppercase">Participation Trends</h3>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Members vs Captains per Round</p>
                </div>
              </div>

              <div className="flex-1 min-h-0 text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} fontStyle="semibold" />
                    <YAxis stroke="#a1a1aa" fontSize={10} fontStyle="semibold" />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #f4f4f5' }} cursor={false} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Bar dataKey="Members" fill="#af101a" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Captains" fill="#8f6f6c" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recharts Pie Donut Chart */}
            <div className="lg:col-span-2 bg-white border border-zinc-200/80 p-5 rounded-xl h-[350px] flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-body-sm font-extrabold text-zinc-900 uppercase">Business Diversity</h3>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Category Distribution</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 items-center min-h-0">
                <div className="relative w-full h-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {donutData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke="none" 
                            onMouseEnter={() => setHoveredSlice(entry)}
                            onMouseLeave={() => setHoveredSlice(null)}
                            className="outline-none cursor-pointer"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center pointer-events-none">
                    <span className="text-xl font-black text-zinc-950 leading-none">
                      {hoveredSlice ? `${hoveredSlice.value}%` : '34%'}
                    </span>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase mt-1">
                      {hoveredSlice ? hoveredSlice.name : 'Finance'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 font-semibold text-zinc-650">
                  {donutData.map((d, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-600">{d.name}</span>
                        <span className="text-zinc-900 font-bold">{d.value}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart layout="vertical" data={[{ value: d.value }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <Bar dataKey="value" fill={d.color} radius={[2, 2, 2, 2]} background={{ fill: '#e4e4e7' }} barSize={6} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Member table section */}
          <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/20">
              <h3 className="text-body-sm font-extrabold text-zinc-950 uppercase">Member Participation</h3>
              <div className="flex gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth"
                    placeholder="Search members..."
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-body-sm min-w-[800px]">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-bold text-zinc-455 uppercase">
                    <th className="px-6 py-3">Member</th>
                    <th className="px-6 py-3">Business Type</th>
                    <th className="px-6 py-3">Captain</th>
                    <th className="px-6 py-3">Rounds</th>
                    <th className="px-6 py-3">Meetings</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 font-semibold text-zinc-650">
                  {paginatedMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50/10">
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-50 text-brand-red border border-red-100 flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0">
                            {m.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-800 leading-tight">{m.name}</p>
                            <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">{m.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[9px] font-extrabold uppercase border border-zinc-200/50">
                          {m.category}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                          <span className="text-[11px] whitespace-nowrap">{m.captain}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 font-mono">{m.rounds}</td>
                      <td className="px-6 py-4.5 font-mono">{m.meetings}</td>
                      <td className="px-6 py-4.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold border uppercase whitespace-nowrap ${m.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-100'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-zinc-400 italic py-8">No matching records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              totalItems={filteredMembers.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              label="members"
            />
          </div>
        </div>
      </div>

      {/* SWITCH ACTIVE CONCLAVE SELECTOR MODAL */}
      {isConclaveSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h3 className="font-extrabold text-zinc-950 text-body-sm">Switch Conclave Data</h3>
              <button type="button" onClick={() => setIsConclaveSelectorOpen(false)} className="p-1 hover:bg-zinc-200 rounded text-zinc-400 transition-smooth">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-2.5 max-h-[50vh] overflow-y-auto">
              {conclaveList.map((c, idx) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveConclaveIndex(idx);
                    setIsConclaveSelectorOpen(false);
                    showToast('Conclave Swapped', `Displaying analytics logs for ${c.name}.`);
                  }}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-smooth flex items-center justify-between ${idx === activeConclaveIndex ? 'border-brand-red bg-red-50/10' : 'border-zinc-100 hover:bg-zinc-50'
                    }`}
                >
                  <div>
                    <h4 className="text-body-sm font-bold text-zinc-900 leading-tight">{c.name}</h4>
                    <p className="text-[10px] text-zinc-450 font-semibold mt-1">{c.details}</p>
                  </div>
                  {idx === activeConclaveIndex && (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsConclaveSelectorOpen(false)}
                className="px-4 py-2 border border-zinc-100 bg-white text-zinc-700 text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert Feedback */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[70] bg-zinc-900 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-xl flex items-center gap-2 border border-zinc-800 animate-slide-up">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          <div>
            <p className="font-bold">{toast.title}</p>
            <p className="text-zinc-400 font-semibold mt-0.5">{toast.desc}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-white opacity-40 hover:opacity-100 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
