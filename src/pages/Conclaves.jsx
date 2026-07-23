import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronRight,
  X,
  Download,
  Upload,
  Plus,
  MoreVertical,
  Calendar,
  MapPin,
  Users,
  Award,
  Layers,
  ArrowRight,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Play
} from 'lucide-react';
import Pagination from '../components/Pagination';
import { ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import SearchableDropdown from '../components/SearchableDropdown';
import { api } from '../services/api';

export default function Conclaves({ searchQuery, setActiveTab, loggedInAdmin }) {
  const [conclaves, setConclaves] = useState([]);
  const [isLoadingConclaves, setIsLoadingConclaves] = useState(false);

  useEffect(() => {
    async function loadConclaves() {
      setIsLoadingConclaves(true);
      try {
        const data = await api.get('/admin/conclaves');
        setConclaves(data.map(c => {
          let state = c.state;
          let country = c.country;
          if (!state || !country) {
            const r = (c.region || "").toLowerCase();
            if (r.includes("guntur")) {
              state = "Andhra Pradesh";
              country = "India";
            } else if (r.includes("london")) {
              state = "Greater London";
              country = "United Kingdom";
            } else if (r.includes("singapore")) {
              state = "Central Region";
              country = "Singapore";
            } else if (r.includes("south")) {
              state = "Tamil Nadu";
              country = "India";
            } else {
              state = "Andhra Pradesh";
              country = "India";
            }
          }

          const venue = c.venueLocation || c.venue || 'N/A';
          const venueShort = venue.split(',')[0] || 'N/A';
          const startDate = c.date || c.startDate || '';
          const dateRange = c.date ? new Date(c.date).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' }) : (c.dateRange || 'N/A');
          const coordinator = c.coordinator || 'Sanjay Wagle';
          
          let status = c.status;
          const s = (c.status || '').toLowerCase();
          if (s === 'registration_open') status = 'Upcoming';
          else if (s === 'running') status = 'Running';
          else if (s === 'completed') status = 'Completed';
          else if (s === 'draft') status = 'Draft';
          else if (s === 'cancelled') status = 'Cancelled';

          return {
            ...c,
            state,
            country,
            venue,
            venueShort,
            startDate,
            dateRange,
            coordinator,
            status,
            memberCount: c.registrationCount || c.memberCount || 0,
            memberLimit: c.memberLimit || 100,
            captainCount: c.captainCount || 0,
            captainLimit: c.captainLimit || 12,
            progress: (s === 'completed' || s === 'locked' || Boolean(c.scheduleSummary || c.schedule)) ? 100 : s === 'running' ? 60 : 0
          };
        }));
      } catch (err) {
        console.error("Failed to load conclaves from API:", err);
        setConclaves([]);
      } finally {
        setIsLoadingConclaves(false);
      }
    }
    loadConclaves();
  }, []);

  useEffect(() => {
    if (conclaves && conclaves.length > 0) {
      localStorage.setItem('bni_conclaves', JSON.stringify(conclaves));
      window.dispatchEvent(new Event('storage'));
    }
  }, [conclaves]);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== null) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  const searchVal = searchTerm;
  const [statusFilter, setStatusFilter] = useState('All');
  const [venueFilter, setVenueFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('DateDesc');
  const [selectedConclave, setSelectedConclave] = useState(null);
  const [viewScope, setViewScope] = useState('region'); // 'region' or 'global'

  // Checked rows
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    venueShort: '',
    dateRange: '',
    startDate: '',
    endDate: '',
    regStartDate: '',
    regEndDate: '',
    memberLimit: 500,
    captainLimit: 20,
    status: 'Draft',
    region: '',
    coordinator: '',
    description: '',
    state: '',
    country: ''
  });

  const [toast, setToast] = useState(null);
  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 3000);
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get distinct states and countries
  const statesList = useMemo(() => {
    const list = new Set(conclaves.map(c => c.state).filter(Boolean));
    return ['All', ...Array.from(list).sort()];
  }, [conclaves]);

  const countriesList = useMemo(() => {
    const list = new Set(conclaves.map(c => c.country).filter(Boolean));
    return ['All', ...Array.from(list).sort()];
  }, [conclaves]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows(new Set());
  }, [searchVal, statusFilter, venueFilter, stateFilter, countryFilter, sortBy, viewScope]);

  // Filtered & Sorted conclaves
  const filteredConclaves = useMemo(() => {
    const q = (searchVal || '').trim().toLowerCase();

    let result = conclaves.filter(c => {
      const matchesSearch = !q || (
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.venue && c.venue.toLowerCase().includes(q)) ||
        (c.coordinator && c.coordinator.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.region && c.region.toLowerCase().includes(q)) ||
        (c.status && c.status.toLowerCase().includes(q))
      );

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesVenue = venueFilter === 'All' || c.venueShort === venueFilter;
      const matchesViewScope = viewScope === 'global' || c.region?.toLowerCase().includes('guntur');
      const matchesState = stateFilter === 'All' || c.state === stateFilter;
      const matchesCountry = countryFilter === 'All' || c.country === countryFilter;

      return matchesSearch && matchesStatus && matchesVenue && matchesViewScope && matchesState && matchesCountry;
    });

    // Sorting logic
    if (sortBy === 'NameAsc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Capacity') {
      result.sort((a, b) => b.memberLimit - a.memberLimit);
    } else { // DateDesc
      result.sort((a, b) => b.startDate.localeCompare(a.startDate));
    }

    return result;
  }, [conclaves, searchVal, statusFilter, venueFilter, stateFilter, countryFilter, sortBy, viewScope]);

  // Paginated list
  const paginatedConclaves = useMemo(() => {
    const totalPages = Math.ceil(filteredConclaves.length / itemsPerPage) || 1;
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return filteredConclaves.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredConclaves, currentPage, itemsPerPage]);

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
    const hisCreatedConclaves = filteredConclaves.filter(c => c.coordinator === loggedInAdmin?.name);
    if (selectedRows.size === hisCreatedConclaves.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(hisCreatedConclaves.map(c => c.id)));
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setVenueFilter('All');
    setStateFilter('All');
    setCountryFilter('All');
    setSortBy('DateDesc');
    setSelectedRows(new Set());
  };

  // CSV Export
  const handleExport = () => {
    if (filteredConclaves.length === 0) {
      showToast('No conclaves to export', 'error');
      return;
    }
    const headers = ['ID', 'Conclave Name', 'Venue', 'Date Range', 'Members Ratio', 'Captains Ratio', 'Status', 'Coordinator'];
    const rows = filteredConclaves.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.venue}"`,
      `"${c.dateRange}"`,
      `"${c.memberCount}/${c.memberLimit}"`,
      `"${c.captainCount}/${c.captainLimit}"`,
      c.status,
      c.coordinator
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bni_conclaves_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Completed', `Successfully exported ${filteredConclaves.length} conclave entries.`);
  };

  const handleBulkExport = () => {
    const selectedList = conclaves.filter(c => selectedRows.has(c.id));
    if (selectedList.length === 0) return;
    const headers = ['ID', 'Conclave Name', 'Venue', 'Date Range', 'Members Ratio', 'Captains Ratio', 'Status', 'Coordinator'];
    const rows = selectedList.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.venue}"`,
      `"${c.dateRange}"`,
      `"${c.memberCount}/${c.memberLimit}"`,
      `"${c.captainCount}/${c.captainLimit}"`,
      c.status,
      c.coordinator
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `selected_conclaves_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Selected', `Successfully exported ${selectedList.length} conclaves.`);
  };

  // Create & Edit form handlers
  const openAddModal = () => {
    setFormData({
      name: '',
      venue: '',
      venueShort: '',
      dateRange: '',
      startDate: '',
      endDate: '',
      regStartDate: '',
      regEndDate: '',
      memberLimit: 500,
      captainLimit: 20,
      status: 'Draft',
      region: '',
      coordinator: '',
      description: ''
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.venue || !formData.coordinator) {
      showToast('Validation Error', 'Please fill in all mandatory fields.');
      return;
    }

    const newConclave = {
      id: `CON-2024-00${Math.floor(100 + Math.random() * 950)}`,
      name: formData.name,
      venue: formData.venue,
      venueShort: formData.venueShort || formData.venue.split(',')[0],
      dateRange: formData.dateRange || 'TBD',
      startDate: formData.startDate || new Date().toISOString().slice(0, 10),
      endDate: formData.endDate || new Date().toISOString().slice(0, 10),
      regStartDate: formData.regStartDate || '',
      regEndDate: formData.regEndDate || '',
      memberCount: 0,
      memberLimit: Number(formData.memberLimit) || 500,
      captainCount: 0,
      captainLimit: Number(formData.captainLimit) || 20,
      status: formData.status,
      progress: formData.status === 'Completed' ? 100 : formData.status === 'Running' ? 80 : formData.status === 'Upcoming' ? 40 : 5,
      region: formData.region || 'Regional',
      coordinator: formData.coordinator,
      coordinatorAvatar: formData.coordinator.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      description: formData.description || 'No description provided.',
      timeline: [
        { event: 'Conclave Created', date: new Date().toLocaleString(), desc: `Workspace initiated by ${formData.coordinator}` }
      ]
    };

    setConclaves(prev => [newConclave, ...prev]);
    setIsAddModalOpen(false);
    showToast('Conclave Created', `Successfully created ${newConclave.name}.`);
  };

  const openEditModal = (c) => {
    setFormData({
      id: c.id,
      name: c.name,
      venue: c.venue,
      venueShort: c.venueShort,
      dateRange: c.dateRange,
      startDate: c.startDate,
      endDate: c.endDate,
      regStartDate: c.regStartDate || '',
      regEndDate: c.regEndDate || '',
      memberCount: c.memberCount,
      memberLimit: c.memberLimit,
      captainCount: c.captainCount,
      captainLimit: c.captainLimit,
      status: c.status,
      region: c.region,
      coordinator: c.coordinator,
      description: c.description
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setConclaves(prev => prev.map(c => {
      if (c.id === formData.id) {
        return {
          ...c,
          name: formData.name,
          venue: formData.venue,
          venueShort: formData.venueShort || formData.venue.split(',')[0],
          dateRange: formData.dateRange,
          startDate: formData.startDate,
          endDate: formData.endDate,
          regStartDate: formData.regStartDate,
          regEndDate: formData.regEndDate,
          memberLimit: Number(formData.memberLimit),
          captainLimit: Number(formData.captainLimit),
          status: formData.status,
          region: formData.region,
          coordinator: formData.coordinator,
          coordinatorAvatar: formData.coordinator.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          description: formData.description,
          progress: formData.status === 'Completed' ? 100 : formData.status === 'Running' ? 85 : formData.status === 'Upcoming' ? 60 : 5
        };
      }
      return c;
    }));
    setIsEditModalOpen(false);
    showToast('Conclave Updated', `Successfully updated conclave profile data.`);
  };

  // KPI aggregates
  const runningCount = conclaves.filter(c => c.status === 'Running').length;
  const upcomingCount = conclaves.filter(c => c.status === 'Upcoming').length;
  const completedCount = conclaves.filter(c => c.status === 'Completed').length;

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">

      {/* Breadcrumbs & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-955 font-extrabold tracking-tight">Conclave Management</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Create and manage BNI conclave schedules and lifecycle events.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            Export
          </button>
          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button rounded-lg transition-smooth shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Conclave
          </button>
        </div>
      </div>

      {/* Scope Navigation Tabs */}
      <div className="flex border-b border-zinc-200 -mt-2">
        <button
          onClick={() => setViewScope('region')}
          className={`px-4 py-2 text-body-sm font-black uppercase tracking-wider border-b-2 transition-smooth cursor-pointer -mb-px ${viewScope === 'region'
            ? 'border-brand-red text-brand-red font-extrabold'
            : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
        >
          My Region
        </button>
        <button
          onClick={() => setViewScope('global')}
          className={`px-4 py-2 text-body-sm font-black uppercase tracking-wider border-b-2 transition-smooth cursor-pointer -mb-px ${viewScope === 'global'
            ? 'border-brand-red text-brand-red font-extrabold'
            : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
        >
          Global Network
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Total Portfolios</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">{conclaves.length}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Running Now</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-brand-red leading-none">{runningCount}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Upcoming Seminars</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">{upcomingCount}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Completed Runs</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* Table Toolbar */}
      <div className="bg-white border border-zinc-200/80 p-3.5 flex flex-col lg:flex-row gap-3 items-center justify-between rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm placeholder-zinc-400 focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth bg-zinc-50/20"
              placeholder="Search conclaves, venues or region..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <SearchableDropdown
              label="Status"
              options={['All', 'Upcoming', 'Running', 'Completed']}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Search status..."
            />

            <SearchableDropdown
              label="State"
              options={statesList}
              value={stateFilter}
              onChange={setStateFilter}
              placeholder="Search state..."
            />

            <SearchableDropdown
              label="Country"
              options={countriesList}
              value={countryFilter}
              onChange={countryFilter === 'All' ? setCountryFilter : (val) => {
                setCountryFilter(val);
                // When selecting a country, reset state filter if it doesn't belong to it (optional check)
              }}
              placeholder="Search country..."
            />
          </div>
        </div>
        <button
          onClick={handleResetFilters}
          className="text-label-md font-bold text-brand-red hover:underline px-4 cursor-pointer shrink-0 transition-smooth text-button"
        >
          Reset Filters
        </button>
      </div>

      {/* Conclaves list table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-label-xs font-bold text-zinc-400 uppercase tracking-wider">
                <th className="px-5 py-4 w-12 text-center">
                  <input
                    checked={filteredConclaves.length > 0 && selectedRows.size === filteredConclaves.length}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                    type="checkbox"
                  />
                </th>
                <th className="px-5 py-4">Conclave Name</th>
                <th className="px-5 py-4">Region</th>
                <th className="px-5 py-4">Coordinator</th>
                <th className="px-5 py-4">Date Schedule</th>
                <th className="px-5 py-4">Venue Location</th>
                <th className="px-5 py-4 text-center">Members</th>
                <th className="px-5 py-4 text-center">Captains</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Progress</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-table-text">
              {filteredConclaves.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-zinc-400 font-medium">
                    No conclaves found matching the filter tags.
                  </td>
                </tr>
              ) : (
                paginatedConclaves.map((conclave) => {
                  const isHisCreated = conclave.coordinator === loggedInAdmin?.name;
                  return (
                    <tr
                      key={conclave.id}
                      onClick={() => setSelectedConclave(conclave)}
                      className="group cursor-pointer"
                    >
                      <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          checked={selectedRows.has(conclave.id)}
                          onChange={(e) => toggleRow(conclave.id, e)}
                          disabled={!isHisCreated}
                          className={`rounded border-zinc-300 text-brand-red focus:ring-brand-red w-4 h-4 ${!isHisCreated ? 'cursor-not-allowed opacity-30 bg-zinc-100' : 'cursor-pointer'
                            }`}
                          type="checkbox"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-body-sm font-bold text-zinc-900 transition-smooth leading-tight">{conclave.name}</span>
                          <span className="text-[9px] text-zinc-455 font-bold uppercase mt-0.5">ID: {conclave.id}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-555 text-[10px] font-bold rounded-full whitespace-nowrap">
                          {conclave.region || 'Guntur Region'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-red/10 text-brand-red font-bold text-[10px] flex items-center justify-center shrink-0">
                            {conclave.coordinatorAvatar}
                          </div>
                          <span className="font-semibold text-zinc-700">{conclave.coordinator}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-zinc-650">{conclave.dateRange}</td>
                      <td className="px-5 py-4 text-zinc-650">{conclave.venueShort}</td>
                      <td className="px-5 py-4 text-center font-bold text-zinc-800">
                        {conclave.memberCount}
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-zinc-800">
                        {conclave.captainCount}
                      </td>
                      <td className="px-5 py-4">
                        {conclave.status === 'Running' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Running
                          </span>
                        ) : conclave.status === 'Upcoming' ? (
                          <span className="inline-flex items-center gap-1 text-brand-red bg-red-50 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span> Upcoming
                          </span>
                        ) : conclave.status === 'Draft' ? (
                          <span className="inline-flex items-center gap-1 text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span> Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span> Completed
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 w-32">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden border border-zinc-200/10">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart layout="vertical" data={[{ value: conclave.progress }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <Bar dataKey="value" fill={conclave.status === 'Completed' ? '#3f3f46' : conclave.status === 'Draft' ? '#a1a1aa' : '#af101a'} radius={[2, 2, 2, 2]} background={{ fill: '#f4f4f5' }} barSize={6} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-600">{conclave.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === conclave.id ? null : conclave.id)}
                              className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {activeDropdown === conclave.id && (
                              <>
                                <div
                                  onClick={() => setActiveDropdown(null)}
                                  className="fixed inset-0 z-40 cursor-default"
                                />
                                <div className="absolute right-0 mt-1 w-36 bg-white border border-zinc-100 rounded-lg shadow-lg py-1 z-50 text-left animate-fade-in">
                                  <button
                                    onClick={() => {
                                      setSelectedConclave(conclave);
                                      setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 transition-smooth"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!isHisCreated) return;
                                      openEditModal(conclave);
                                      setActiveDropdown(null);
                                    }}
                                    disabled={!isHisCreated}
                                    className={`w-full text-left px-3.5 py-2 text-[11px] font-bold transition-smooth ${!isHisCreated ? 'text-zinc-300 cursor-not-allowed opacity-40' : 'hover:bg-zinc-50 text-zinc-700'
                                      }`}
                                  >
                                    Edit Profile
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!isHisCreated) return;
                                      setDeleteTarget(conclave);
                                      setActiveDropdown(null);
                                    }}
                                    disabled={!isHisCreated}
                                    className={`w-full text-left px-3.5 py-2 text-[11px] font-extrabold transition-smooth border-t border-zinc-100 ${!isHisCreated ? 'text-zinc-300 cursor-not-allowed opacity-40' : 'hover:bg-red-50 text-brand-red'
                                      }`}
                                  >
                                    Remove Conclave
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredConclaves.length}
          onPageChange={setCurrentPage}
          label="conclaves"
        />
      </div>

      {/* Conclave Details Drawer */}
      <div
        onClick={() => setSelectedConclave(null)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[55] transition-opacity duration-300 ${selectedConclave ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      <div className={`fixed right-0 top-0 h-screen w-full max-w-[440px] bg-white z-[60] border-l border-zinc-100 shadow-2xl transform transition-transform duration-300 ${selectedConclave ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {selectedConclave && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConclave(null)}
                  className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-700 transition-smooth cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-section-heading font-extrabold text-zinc-950">Conclave Details</h3>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">ID: {selectedConclave.id}</span>
                </div>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Description */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Description</span>
                <p className="text-body-md text-zinc-655 leading-relaxed bg-zinc-50 p-3.5 border border-zinc-100 rounded-xl select-text">
                  {selectedConclave.description || '—'}
                </p>
              </div>

              {/* Registration Window Info */}
              {(selectedConclave.regStartDate || selectedConclave.regEndDate) && (
                <div className="space-y-2 border-l-2 border-brand-red pl-3 py-0.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Registration Period</span>
                  <span className="text-body-sm font-semibold text-zinc-755 block">
                    {selectedConclave.regStartDate ?? 'TBD'}
                    <span className="text-zinc-400 mx-2">to</span>
                    {selectedConclave.regEndDate ?? 'TBD'}
                  </span>
                </div>
              )}

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 border border-zinc-100 bg-white rounded-lg shadow-sm">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Region Group</span>
                  <span className="text-body-sm font-bold text-zinc-800 block mt-1">
                    {selectedConclave.region || '—'}
                  </span>
                </div>
                <div className="p-3.5 border border-zinc-100 bg-white rounded-lg shadow-sm">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Coordinator</span>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedConclave.coordinator && (
                      <div className="w-5 h-5 rounded-full bg-brand-red/10 text-brand-red font-bold text-[9px] flex items-center justify-center shrink-0">
                        {selectedConclave.coordinator.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}
                    <span className="text-body-sm font-bold text-zinc-800">{selectedConclave.coordinator || '—'}</span>
                  </div>
                </div>
                <div className="p-3.5 border border-zinc-100 bg-white rounded-lg shadow-sm">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Registered Members</span>
                  <span className="text-body-sm font-bold text-zinc-800 block mt-1">
                    {selectedConclave.memberCount ?? selectedConclave.registrationCount ?? 0}
                    {selectedConclave.memberLimit ? <span className="text-zinc-400 font-medium"> / {selectedConclave.memberLimit}</span> : null}
                  </span>
                </div>
                <div className="p-3.5 border border-zinc-100 bg-white rounded-lg shadow-sm">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">Captains Checked</span>
                  <span className="text-body-sm font-bold text-zinc-800 block mt-1">
                    {selectedConclave.captainCount ?? 0}
                    {selectedConclave.captainLimit ? <span className="text-zinc-400 font-medium"> / {selectedConclave.captainLimit}</span> : null}
                  </span>
                </div>
              </div>

              {/* Timeline list */}
              {selectedConclave.timeline && selectedConclave.timeline.length > 0 && (
                <div className="space-y-3.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-100 pb-1.5">Activity Timeline</span>
                  <div className="relative pl-3 space-y-5 border-l border-zinc-100 ml-1.5 mt-2">
                    {selectedConclave.timeline.map((t, idx) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[17.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-brand-red' : 'bg-zinc-350'
                          }`} />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-body-sm font-bold text-zinc-800 leading-tight">{t.event}</span>
                          <span className="text-[9px] text-zinc-500 font-semibold">{t.date} • {t.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex gap-2 shrink-0">
              <button
                onClick={() => {
                  const isHisCreated = selectedConclave?.coordinator === loggedInAdmin?.name;
                  if (!isHisCreated) return;
                  openEditModal(selectedConclave);
                  setSelectedConclave(null);
                }}
                disabled={selectedConclave && selectedConclave.coordinator !== loggedInAdmin?.name}
                className={`flex-1 py-2.5 rounded-lg text-button font-bold transition-smooth shadow-sm ${selectedConclave && selectedConclave.coordinator !== loggedInAdmin?.name
                  ? 'bg-zinc-100 text-zinc-355 cursor-not-allowed border border-zinc-200/60 opacity-40'
                  : 'bg-white border border-zinc-100 text-zinc-655 hover:bg-zinc-50 cursor-pointer'
                  }`}
              >
                Edit Conclave
              </button>
              <button
                onClick={() => {
                  if (setActiveTab) {
                    setActiveTab('reports');
                  } else {
                    showToast('Fetching reports...', 'Starting file generation.');
                  }
                  setSelectedConclave(null);
                }}
                className="flex-1 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-lg text-button font-bold transition-smooth shadow-sm cursor-pointer"
              >
                View Reports
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <form onSubmit={handleAddSubmit} className="w-full max-w-lg bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h3 className="font-extrabold text-zinc-950 text-body-sm">Create New Conclave</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-zinc-200 rounded text-zinc-400 transition-smooth">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Conclave Name *</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    placeholder="Annual Global Summit"
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Coordinator Name *</label>
                  <input
                    value={formData.coordinator}
                    onChange={(e) => setFormData(prev => ({ ...prev, coordinator: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    placeholder="Vikram Malhotra"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Venue Location *</label>
                  <input
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value, venueShort: e.target.value.split(',')[0] }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    placeholder="V Convention, Guntur"
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">Region Group *</label>
                  <input
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    placeholder="Guntur Central"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">Date Schedule Text</label>
                  <input
                    value={formData.dateRange}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    placeholder="Nov 12 - Nov 14, 2024"
                    type="text"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">Start Date</label>
                  <input
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="date"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">End Date</label>
                  <input
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">Registration Open Date</label>
                  <input
                    value={formData.regStartDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, regStartDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="date"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">Registration Close Date</label>
                  <input
                    value={formData.regEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, regEndDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Members Limit</label>
                  <input
                    value={formData.memberLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, memberLimit: Number(e.target.value) }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Captains Limit</label>
                  <input
                    value={formData.captainLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, captainLimit: Number(e.target.value) }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Lifecycle Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white font-semibold text-zinc-700 cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20 min-h-[80px]"
                  placeholder="Details about matching sessions, sectors, coordinator notes..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-zinc-100 bg-white text-zinc-700 text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer"
              >
                Create Conclave
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <form onSubmit={handleEditSubmit} className="w-full max-w-lg bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h3 className="font-extrabold text-zinc-950 text-body-sm">Edit Conclave Profile</h3>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="p-1 hover:bg-zinc-200 rounded text-zinc-400 transition-smooth">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Conclave Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Coordinator Name</label>
                  <input
                    value={formData.coordinator}
                    onChange={(e) => setFormData(prev => ({ ...prev, coordinator: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Venue Location</label>
                  <input
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value, venueShort: e.target.value.split(',')[0] }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Region Group</label>
                  <input
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">Date Schedule Text</label>
                  <input
                    value={formData.dateRange}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="text"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">Start Date</label>
                  <input
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="date"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">End Date</label>
                  <input
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">Registration Open Date</label>
                  <input
                    value={formData.regStartDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, regStartDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="date"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-455 block mb-1">Registration Close Date</label>
                  <input
                    value={formData.regEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, regEndDate: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Members Limit</label>
                  <input
                    value={formData.memberLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, memberLimit: Number(e.target.value) }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Captains Limit</label>
                  <input
                    value={formData.captainLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, captainLimit: Number(e.target.value) }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20"
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Lifecycle Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white font-semibold text-zinc-700 cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-450 block mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-zinc-50/20 min-h-[80px]"
                />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-zinc-100 bg-white text-zinc-700 text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REMOVE SINGLE CONCLAVE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-xl border border-zinc-100 shadow-2xl p-5 space-y-4 animate-scale-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-body-sm font-bold text-zinc-950 leading-tight">Remove Conclave Portfolio</h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  Are you sure you want to permanently delete this conclave workspace? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-[11px] text-zinc-500 font-medium">
              Conclave: <span className="font-bold text-zinc-900">{deleteTarget.name}</span><br />
              Venue: <span className="text-zinc-700 font-bold">{deleteTarget.venue}</span>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold border border-zinc-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConclaves(prev => prev.filter(c => c.id !== deleteTarget.id));
                  showToast('Conclave Removed', `Successfully deleted ${deleteTarget.name}.`);
                  setDeleteTarget(null);
                }}
                className="px-3.5 py-1.5 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK REMOVE CONFIRMATION */}
      {isBulkDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-xl border border-zinc-100 shadow-2xl p-5 space-y-4 animate-scale-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-body-sm font-bold text-zinc-950 leading-tight">Remove Selected Conclaves</h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  Are you sure you want to delete all {selectedRows.size} selected conclaves from the database?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsBulkDeleteOpen(false)}
                className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold border border-zinc-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConclaves(prev => prev.filter(c => !selectedRows.has(c.id)));
                  showToast('Portfolios Deleted', `Deleted ${selectedRows.size} conclaves.`);
                  setSelectedRows(new Set());
                  setIsBulkDeleteOpen(false);
                }}
                className="px-3.5 py-1.5 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bulk Actions Footer */}
      {selectedRows.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 text-white rounded-lg shadow-2xl py-2 px-4 flex items-center gap-3.5 border border-zinc-800 animate-slide-up text-body-sm font-semibold select-none">
          <span className="text-[10px] font-extrabold uppercase tracking-wide bg-zinc-800 px-2 py-0.5 rounded text-zinc-350">{selectedRows.size} Selected</span>
          <div className="w-px h-4 bg-zinc-800" />
          <button
            onClick={handleBulkExport}
            className="text-white hover:text-brand-red transition-smooth flex items-center gap-1.5 cursor-pointer text-button text-[10px]"
          >
            <Download className="w-3.5 h-3.5 animate-bounce-slow" />
            Export Selected
          </button>
          <button
            onClick={() => setIsBulkDeleteOpen(true)}
            className="text-brand-red hover:text-red-400 transition-smooth flex items-center gap-1.5 cursor-pointer text-button text-[10px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Selected
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
