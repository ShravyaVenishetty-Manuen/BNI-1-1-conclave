import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Download,
  RefreshCw,
  Camera,
  Calendar,
  CheckCircle2,
  XCircle,
  Sliders,
  Check,
  Building2
} from 'lucide-react';
import Pagination from '../components/Pagination';

import initialConclaves from '../data/conclaves_snapshot.json';

export default function Snapshot({ searchQuery }) {
  const [conclaves, setConclaves] = useState(initialConclaves);
  const [activeConclaveIndex, setActiveConclaveIndex] = useState(0);
  const currentConclave = conclaves[activeConclaveIndex];

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const searchVal = searchQuery !== undefined ? searchQuery : searchTerm;
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Selection/checkboxes
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Modals
  const [isConclaveSelectorOpen, setIsConclaveSelectorOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [toast, setToast] = useState(null);
  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtered participants
  const filteredParticipants = useMemo(() => {
    setCurrentPage(1);
    setSelectedRows(new Set());
    return currentConclave.participants.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.category.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.captain.toLowerCase().includes(searchVal.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' ||
        p.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [currentConclave, searchVal, categoryFilter]);

  // Paginated list
  const paginatedParticipants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredParticipants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredParticipants, currentPage]);

  const toggleRow = (id, e) => {
    e.stopPropagation();
    const updated = new Set(selectedRows);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedRows(updated);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredParticipants.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredParticipants.map(p => p.id)));
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setSelectedRows(new Set());
  };

  const handleExport = () => {
    const headers = ['ID', 'Member Name', 'Business Type', 'Assigned Captain', 'Login Status', 'Included', 'Remarks'];
    const rows = filteredParticipants.map(p => [
      p.id,
      `"${p.name}"`,
      `"${p.category}"`,
      `"${p.captain}"`,
      p.loginStatus,
      p.included ? 'Yes' : 'No',
      p.remarks
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `snapshot_${currentConclave.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Completed', `Successfully exported snapshot with ${filteredParticipants.length} members.`);
  };

  const handleTakeSnapshot = () => {
    // Generate new version tag and update timestamp
    setConclaves(prev => prev.map((c, idx) => {
      if (idx === activeConclaveIndex) {
        const currentVer = parseFloat(c.version.substring(2));
        const newVer = `V. ${(currentVer + 0.1).toFixed(1)}`;
        return {
          ...c,
          version: newVer,
          lastSnapshot: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date().toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })}`
        };
      }
      return c;
    }));
    setIsSnapshotModalOpen(false);
    showToast('Snapshot Captured', `New frozen participant state version has been locked successfully.`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">

      {/* Breadcrumbs & Header */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Snapshot Management</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Review and freeze active participant listings.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => showToast('Sync Complete', 'Latest active connection logs synced.')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-zinc-400" />
            Refresh Active
          </button>
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            Export Snapshot
          </button>
          <button
            onClick={() => setIsSnapshotModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button rounded-lg transition-smooth shadow-md cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            Take Snapshot
          </button>
        </div>
      </div>

      {/* Conclave Selector Card */}
      <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-5">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-red-50 border border-red-100 flex items-center justify-center rounded-lg text-brand-red shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Conclave Name</span>
              <span className="text-body-sm font-bold text-zinc-900 mt-0.5">{currentConclave.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Event Dates</span>
              <span className="text-body-sm font-semibold text-zinc-650 mt-0.5">{currentConclave.dateRange}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Venue Location</span>
              <span className="text-body-sm text-zinc-650 mt-0.5">{currentConclave.venue}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Current Status</span>
              <div className="flex items-center gap-1.5 text-emerald-700 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-body-sm font-bold">{currentConclave.status}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsConclaveSelectorOpen(true)}
          className="text-label-md font-bold text-brand-red hover:underline shrink-0 text-button cursor-pointer"
        >
          Change Selection
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Total Registered</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">{currentConclave.totalRegistered}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Active Members</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">{currentConclave.activeMembers}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Inactive Members</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-brand-red leading-none">{currentConclave.inactive}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Last Snap Locked</span>
          <div className="flex flex-col mt-2.5">
            <span className="text-body-sm font-bold text-zinc-800 leading-tight">{currentConclave.version}</span>
            <span className="text-[10px] text-zinc-450 font-semibold mt-1">{currentConclave.lastSnapshot}</span>
          </div>
        </div>
      </div>

      {/* Snapshot Info & Table Container */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
        {/* Table Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-col lg:flex-row gap-3 items-center justify-between bg-zinc-50/20">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <h3 className="font-bold text-zinc-950 text-body-sm">Snapshot Directory</h3>
            <span className="px-2 py-0.5 bg-red-50 text-[10px] font-extrabold rounded text-brand-red border border-red-100 uppercase">
              Ver: {currentConclave.version}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-450 w-3.5 h-3.5" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 border border-zinc-200 rounded-lg text-[11px] placeholder-zinc-400 focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white w-40 transition-smooth"
                placeholder="Search name, category..."
                type="text"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-zinc-200 rounded-lg px-2.5 py-1 text-[11px] focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white font-medium text-zinc-700 transition-smooth cursor-pointer"
            >
              <option value="All">All Business Types</option>
              <option value="Cloud Solutions">Cloud Solutions</option>
              <option value="Corporate Law">Corporate Law</option>
              <option value="Commercial Interior">Commercial Interior</option>
              <option value="Event Management">Event Management</option>
              <option value="Real Estate Dev">Real Estate Dev</option>
            </select>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-brand-red hover:underline px-2 cursor-pointer transition-smooth shrink-0"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-label-xs font-bold text-zinc-400 uppercase tracking-wider">
                <th className="px-5 py-4 w-12 text-center">
                  <input
                    checked={filteredParticipants.length > 0 && selectedRows.size === filteredParticipants.length}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                    type="checkbox"
                  />
                </th>
                <th className="px-5 py-4">Member Name</th>
                <th className="px-5 py-4">Business Type</th>
                <th className="px-5 py-4">Assigned Captain</th>
                <th className="px-5 py-4 text-center">Login Status</th>
                <th className="px-5 py-4 text-center">Included</th>
                <th className="px-5 py-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-table-text">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-zinc-400 font-medium">
                    No snap participants matching standard tags.
                  </td>
                </tr>
              ) : (
                paginatedParticipants.map((p) => (
                  <tr
                    key={p.id}
                    className={`group ${!p.included ? 'bg-red-50/20' : ''}`}
                  >
                    <td className="px-5 py-4 text-center">
                      <input
                        checked={selectedRows.has(p.id)}
                        onChange={(e) => toggleRow(p.id, e)}
                        className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                        type="checkbox"
                      />
                    </td>
                    <td className="px-5 py-4 font-bold text-zinc-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-red/10 text-brand-red font-bold text-[10px] flex items-center justify-center shrink-0">
                          {p.avatar}
                        </div>
                        <span className={!p.included ? 'text-brand-red' : ''}>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-650">{p.category}</td>
                    <td className="px-5 py-4 font-semibold text-zinc-700">{p.captain}</td>
                    <td className="px-5 py-4 text-center">
                      {p.loginStatus === 'Online' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span> Offline
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {p.included ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-brand-red mx-auto" />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-body-sm font-semibold ${!p.included ? 'text-brand-red font-bold italic' : 'text-zinc-500'}`}>
                        {p.remarks}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination wrapper */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredParticipants.length}
          onPageChange={setCurrentPage}
          label="members"
        />
      </div>

      {/* Bottom Summary & Algorithmic Preview panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
        {/* Participant Summary */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-4">
          <h4 className="font-bold text-zinc-950 border-b border-zinc-100 pb-2 text-body-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-red" />
            Participant Summary
          </h4>
          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-body-sm py-1 border-b border-dashed border-zinc-100">
              <span className="text-zinc-500">Members Included</span>
              <span className="font-bold text-zinc-800">{currentConclave.activeMembers}</span>
            </div>
            <div className="flex justify-between items-center text-body-sm py-1 border-b border-dashed border-zinc-100">
              <span className="text-zinc-500">Members Excluded</span>
              <span className="font-bold text-brand-red">{currentConclave.inactive}</span>
            </div>
            <div className="flex justify-between items-center text-body-sm py-1">
              <span className="text-zinc-500">Captains Included</span>
              <span className="font-bold text-zinc-800">{currentConclave.captains}</span>
            </div>
          </div>
        </div>

        {/* Scheduler Preview Logic */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-4">
          <h4 className="font-bold text-zinc-950 border-b border-zinc-100 pb-2 text-body-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-red" />
            Scheduler Preview Logic
          </h4>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="bg-zinc-550/10 p-3.5 bg-zinc-50 rounded-lg border border-zinc-100">
              <span className="text-[9px] text-zinc-400 font-bold uppercase block">Tables Required</span>
              <span className="text-body-lg font-bold text-zinc-900 block mt-1">155</span>
              <span className="text-[9px] text-zinc-500 font-semibold block mt-0.5">@ 8 per table</span>
            </div>
            <div className="bg-zinc-550/10 p-3.5 bg-zinc-50 rounded-lg border border-zinc-100">
              <span className="text-[9px] text-zinc-400 font-bold uppercase block">Expected Rounds</span>
              <span className="text-body-lg font-bold text-zinc-900 block mt-1">3 Rounds</span>
              <span className="text-[9px] text-zinc-500 font-semibold block mt-0.5">45 mins each</span>
            </div>

            <div className="col-span-2 bg-white border border-zinc-100 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[9px] text-zinc-400 font-bold uppercase block">Readiness Indicator</span>
                <span className="text-body-sm font-bold text-emerald-700 block mt-0.5">High Confidence</span>
              </div>
              <div className="flex gap-1">
                <div className="w-7 h-2 rounded bg-emerald-600"></div>
                <div className="w-7 h-2 rounded bg-emerald-600"></div>
                <div className="w-7 h-2 rounded bg-emerald-600"></div>
                <div className="w-7 h-2 rounded bg-zinc-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHANGE SELECTION MODAL */}
      {isConclaveSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h3 className="font-extrabold text-zinc-950 text-body-sm">Select Conclave Profile</h3>
              <button type="button" onClick={() => setIsConclaveSelectorOpen(false)} className="p-1 hover:bg-zinc-200 rounded text-zinc-400 transition-smooth">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-2.5 max-h-[50vh] overflow-y-auto">
              {conclaves.map((c, idx) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveConclaveIndex(idx);
                    setIsConclaveSelectorOpen(false);
                    showToast('Selection Swapped', `Active snapshot loaded for ${c.name}.`);
                  }}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-smooth flex items-center justify-between ${idx === activeConclaveIndex ? 'border-brand-red bg-red-50/10' : 'border-zinc-100 hover:bg-zinc-50'
                    }`}
                >
                  <div>
                    <h4 className="text-body-sm font-bold text-zinc-900 leading-tight">{c.name}</h4>
                    <p className="text-[10px] text-zinc-450 font-semibold mt-1">{c.venue} • {c.dateRange}</p>
                  </div>
                  {idx === activeConclaveIndex && (
                    <Check className="w-4 h-4 text-brand-red shrink-0" />
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

      {/* TAKE SNAPSHOT MODAL */}
      {isSnapshotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-xl border border-zinc-100 shadow-2xl p-5 space-y-4 animate-scale-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-body-sm font-bold text-zinc-950 leading-tight">Freeze Snapshot Version</h3>
                <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">
                  Are you sure you want to capture and lock version {(parseFloat(currentConclave.version.substring(2)) + 0.1).toFixed(1)} of the participant directory? This snapshot freezes registration states.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsSnapshotModalOpen(false)}
                className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold border border-zinc-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTakeSnapshot}
                className="px-3.5 py-1.5 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold"
              >
                Confirm Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 text-white rounded-lg shadow-2xl py-2 px-4 flex items-center gap-3.5 border border-zinc-800 animate-slide-up text-body-sm font-semibold select-none">
          <span className="text-[10px] font-extrabold uppercase tracking-wide bg-zinc-800 px-2 py-0.5 rounded text-zinc-350">{selectedRows.size} Selected</span>
          <div className="w-px h-4 bg-zinc-800" />
          <button
            onClick={() => {
              showToast('Export Selected', `Exported ${selectedRows.size} participants.`);
              setSelectedRows(new Set());
            }}
            className="text-white hover:text-brand-red transition-smooth flex items-center gap-1.5 cursor-pointer text-button text-[10px]"
          >
            <Download className="w-3.5 h-3.5 animate-bounce-slow" />
            Export Selected
          </button>
        </div>
      )}

      {/* Live Toast Notifications */}
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
