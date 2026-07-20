import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Mail,
  Phone,
  Plus,
  X,
  Edit,
  MoreVertical,
  Download,
  Upload,
} from 'lucide-react';
import Pagination from '../components/Pagination';
import SearchableDropdown from '../components/SearchableDropdown';
import { api } from '../services/api';

import membersData from '../data/members.json';

export default function Members({ searchQuery, selectedConclaveId }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedConclaveId) return;
    async function loadRegistrations() {
      setIsLoading(true);
      try {
        const data = await api.get(`/admin/conclaves/${selectedConclaveId}/registrations`);
        const mapped = data.registrations.map(r => {
          return {
            id: r.uid,
            name: r.name,
            email: r.email,
            phone: r.phone,
            company: r.businessName,
            category: r.businessCategory || 'Uncategorized',
            address: r.location ? (typeof r.location === 'object' ? (r.location.place || '') : r.location) : '',
            state: r.state || 'Andhra Pradesh',
            country: r.country || 'India',
            isCaptain: r.role === 'captain',
            status: r.isActive ? 'Active' : 'Inactive',
            joinDate: r.registeredAt ? new Date(r.registeredAt).toLocaleDateString([], { month: 'short', year: 'numeric' }) : 'N/A',
            avatar: r.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'M',
            conclaveIds: [selectedConclaveId],
            history: [{ event: 'Registered', date: r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : 'N/A', role: r.role === 'captain' ? 'Captain' : 'Member' }]
          };
        });
        setMembers(mapped);
      } catch (err) {
        console.error("Failed to load registrations from API:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRegistrations();
  }, [selectedConclaveId]);
  const [referrals, setReferrals] = useState(() => {
    const stored = localStorage.getItem('bni_referrals');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('bni_referrals');
      if (stored) {
        setReferrals(JSON.parse(stored));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const searchVal = searchQuery !== undefined ? searchQuery : searchTerm;
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [captainFilter, setCaptainFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [viewScope, setViewScope] = useState('region'); // 'region' or 'global'
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [reassignTarget, setReassignTarget] = useState(null);
  const [newChapterVal, setNewChapterVal] = useState('Peak Performance');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const getMemberRegion = (member) => {
    if (member.region) return member.region;
    if (member.chapter === 'Peak Performance' || member.chapter === 'Apex Chapter') return 'Guntur Region';
    if (member.chapter === 'Capital Chapter') return 'Hyderabad Region';
    return 'Guntur Region';
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset to first page when search or filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchVal, categoryFilter, captainFilter, statusFilter]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Real Estate',
    email: '',
    phone: '',
    company: '',
    chapter: 'Peak Performance',
    address: '',
    isCaptain: false,
    status: 'Active'
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      category: 'Real Estate',
      email: '',
      phone: '',
      company: '',
      chapter: 'Peak Performance',
      address: '',
      isCaptain: false,
      status: 'Active'
    });
    setIsFormOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      category: member.category,
      email: member.email,
      phone: member.phone,
      company: member.company,
      chapter: member.chapter,
      address: member.address,
      isCaptain: member.isCaptain,
      status: member.status
    });
    setSelectedMember(null); // Close the details side drawer
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Please enter the member's name.", "error");
      return;
    }

    if (editingMember) {
      // Edit mode
      if (editingMember.isCaptain !== formData.isCaptain) {
        api.post(`/admin/conclaves/${selectedConclaveId}/registrations/${editingMember.id}/role`, {
          role: formData.isCaptain ? 'captain' : 'member'
        }).then(() => {
          showToast(`Role updated to ${formData.isCaptain ? 'Captain' : 'Member'} successfully.`);
        }).catch(err => {
          console.error("Failed to sync role to backend:", err);
          showToast("Failed to update role on backend.", "error");
        });
      }

      setMembers(prev => prev.map(m => m.id === editingMember.id ? {
        ...m,
        ...formData,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || m.avatar
      } : m));

      setSelectedMember(prev => prev && prev.id === editingMember.id ? {
        ...prev,
        ...formData,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || prev.avatar
      } : prev);
    } else {
      // Add mode
      const newMember = {
        ...formData,
        id: `BNI-00${Math.floor(100 + Math.random() * 900)}`,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'M',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        history: [{ event: 'Created manually', date: new Date().toLocaleDateString(), role: formData.isCaptain ? 'Captain' : 'Member' }],
        conclaveIds: [selectedConclaveId]
      };
      setMembers(prev => [newMember, ...prev]);
    }

    setIsFormOpen(false);
  };

  // Conclave-specific members subset
  const conclaveMembers = useMemo(() => {
    return members.filter(m => m.conclaveIds && m.conclaveIds.includes(selectedConclaveId));
  }, [members, selectedConclaveId]);

  // Dynamic statistics calculations
  const totalCount = conclaveMembers.length;
  const activeCount = conclaveMembers.filter(m => m.status === 'Active').length;
  const activePercentage = totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : '0';
  const captainCount = conclaveMembers.filter(m => m.isCaptain).length;
  const businessClassCount = new Set(conclaveMembers.map(m => m.category)).size;

  // Get distinct states and countries for members
  const statesList = useMemo(() => {
    const list = new Set(members.map(m => m.state).filter(Boolean));
    return ['All', ...Array.from(list).sort()];
  }, [members]);

  const countriesList = useMemo(() => {
    const list = new Set(members.map(m => m.country).filter(Boolean));
    return ['All', ...Array.from(list).sort()];
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return conclaveMembers.filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        member.id.toLowerCase().includes(searchVal.toLowerCase()) ||
        member.email.toLowerCase().includes(searchVal.toLowerCase()) ||
        member.phone.includes(searchVal);

      const matchesCategory = categoryFilter === 'All' || member.category === categoryFilter;

      const matchesCaptain =
        captainFilter === 'All' ||
        (captainFilter === 'Captain' && member.isCaptain) ||
        (captainFilter === 'Member' && !member.isCaptain);

      const matchesStatus = statusFilter === 'All' || member.status === statusFilter;

      const matchesViewScope = viewScope === 'global' || 
        member.chapter === 'Peak Performance' || 
        member.chapter === 'Apex Chapter';

      const matchesState = stateFilter === 'All' || member.state === stateFilter;
      const matchesCountry = countryFilter === 'All' || member.country === countryFilter;

      return matchesSearch && matchesCategory && matchesCaptain && matchesStatus && matchesViewScope && matchesState && matchesCountry;
    });
  }, [conclaveMembers, searchVal, categoryFilter, captainFilter, statusFilter, stateFilter, countryFilter, viewScope]);

  // Paginated members slice
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  // Export filtered members to CSV file
  const handleExport = () => {
    if (filteredMembers.length === 0) {
      showToast('No members found to export!', 'error');
      return;
    }
    const headers = ['Member ID', 'Name', 'Category', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Company', 'Chapter', 'Region'];
    const rows = filteredMembers.map(m => [
      m.id,
      `"${m.name}"`,
      `"${m.category}"`,
      m.email,
      m.phone,
      m.isCaptain ? 'Captain' : 'Member',
      m.status,
      m.joinDate,
      `"${m.company}"`,
      `"${m.chapter}"`,
      `"${getMemberRegion(m)}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bni_members_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export only checked members to CSV
  const handleBulkExport = () => {
    const selectedList = members.filter(m => selectedRows.has(m.id));
    if (selectedList.length === 0) return;

    const headers = ['Member ID', 'Name', 'Category', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Company', 'Chapter'];
    const rows = selectedList.map(m => [
      m.id,
      `"${m.name}"`,
      `"${m.category}"`,
      m.email,
      m.phone,
      m.isCaptain ? 'Captain' : 'Member',
      m.status,
      m.joinDate,
      `"${m.company}"`,
      `"${m.chapter}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `selected_members_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Successfully exported ${selectedList.length} selected members.`, 'success');
  };

  // Import members from CSV file
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length <= 1) return;

      const newMembers = [];
      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',').map(col => col.replace(/^["']|["']$/g, '').trim());
        if (columns.length >= 5) {
          const [id, name, category, email, phone, role, status, joinDate, company, chapter] = columns;

          const avatar = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'M';

          newMembers.push({
            id: id || `BNI-00${Math.floor(100 + Math.random() * 900)}`,
            name: name || 'Unknown Member',
            category: category || 'General',
            email: email || 'n/a',
            phone: phone || 'n/a',
            isCaptain: role === 'Captain',
            status: status === 'Inactive' ? 'Inactive' : 'Active',
            joinDate: joinDate || 'Just now',
            company: company || 'Self Employed',
            chapter: chapter || 'Peak Performance',
            avatar: avatar,
            history: [{ event: 'Imported via CSV', date: new Date().toLocaleDateString(), role: 'Active Member' }],
            conclaveIds: [selectedConclaveId]
          });
        }
      }

      if (newMembers.length > 0) {
        setMembers(prev => [...newMembers, ...prev]);
        showToast(`Successfully imported ${newMembers.length} members from CSV!`, 'success');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle individual row checkbox toggle
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

  // Handle select all checkbox toggle
  const toggleSelectAll = () => {
    if (selectedRows.size === filteredMembers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredMembers.map(m => m.id)));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setCaptainFilter('All');
    setStatusFilter('All');
    setStateFilter('All');
    setCountryFilter('All');
    setSelectedRows(new Set());
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">

      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-955 font-extrabold tracking-tight">Members Management</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Manage registered BNI members and chapter seating details.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <input
            type="file"
            id="csv-file-input"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <Upload className="w-4 h-4 text-zinc-400" />
            Export
          </button>
          <button
            onClick={() => document.getElementById('csv-file-input').click()}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-zinc-200 bg-white text-zinc-700 font-bold text-button rounded-lg hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            Import
          </button>
          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-red-700 text-white font-bold text-button rounded-lg transition-smooth shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Scope Navigation Tabs */}
      <div className="flex border-b border-zinc-200 -mt-2">
        <button
          onClick={() => setViewScope('region')}
          className={`px-4 py-2 text-body-sm font-black uppercase tracking-wider border-b-2 transition-smooth cursor-pointer -mb-px ${
            viewScope === 'region'
              ? 'border-brand-red text-brand-red font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          My Region
        </button>
        <button
          onClick={() => setViewScope('global')}
          className={`px-4 py-2 text-body-sm font-black uppercase tracking-wider border-b-2 transition-smooth cursor-pointer -mb-px ${
            viewScope === 'global'
              ? 'border-brand-red text-brand-red font-extrabold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Global Network
        </button>
      </div>

      {/* Statistics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Total Members</span>
          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">{totalCount}</span>
        </div>
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Active Members</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">{activeCount}</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Chapter Captains</span>
          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">{captainCount}</span>
        </div>
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Business Classifications</span>
          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">{businessClassCount}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-zinc-200/80 p-3.5 flex flex-col lg:flex-row gap-3 items-center justify-between rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm placeholder-zinc-400 focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth bg-zinc-50/20"
              placeholder="Search by member name, ID, email..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Category Filter */}
            <SearchableDropdown
              label="Category"
              options={['All', 'Real Estate', 'Marketing', 'Finance', 'Corporate Gifting', 'IT Services', 'HR Services', 'Legal Services', 'Graphic Design']}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="Search category..."
            />

            {/* Captain Status */}
            <SearchableDropdown
              label="Role"
              options={['All', 'Captain', 'Member']}
              value={captainFilter}
              onChange={setCaptainFilter}
              placeholder="Search role..."
            />

            {/* Status */}
            <SearchableDropdown
              label="Status"
              options={['All', 'Active', 'Inactive']}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Search status..."
            />

            {/* State Filter */}
            <SearchableDropdown
              label="State"
              options={statesList}
              value={stateFilter}
              onChange={setStateFilter}
              placeholder="Search state..."
            />

            {/* Country Filter */}
            <SearchableDropdown
              label="Country"
              options={countriesList}
              value={countryFilter}
              onChange={setCountryFilter}
              placeholder="Search country..."
            />
          </div>
        </div>
        <button
          onClick={resetFilters}
          className="text-label-md font-bold text-brand-red hover:underline px-4 cursor-pointer shrink-0 transition-smooth"
        >
          Reset Filters
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-label-xs font-bold text-zinc-400 uppercase tracking-wider">
                <th className="px-5 py-4 w-12 text-center">
                  <input
                    checked={filteredMembers.length > 0 && selectedRows.size === filteredMembers.length}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                    type="checkbox"
                  />
                </th>
                <th className="px-5 py-4">Member Name</th>
                <th className="px-5 py-4">Member ID</th>
                <th className="px-5 py-4">Region</th>
                <th className="px-5 py-4">Classification</th>
                <th className="px-5 py-4">Contact Info</th>
                <th className="px-5 py-4">Chapter Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Given</th>
                <th className="px-5 py-4 text-center">Taken</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-table-text">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-zinc-400 font-medium">
                    No members match the active filters. Try resetting search queries.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member) => (
                  <tr
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="group cursor-pointer"
                  >
                    <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        checked={selectedRows.has(member.id)}
                        onChange={(e) => toggleRow(member.id, e)}
                        className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                        type="checkbox"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red font-bold text-xs flex items-center justify-center shrink-0 border border-brand-red/10">
                          {member.avatar}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-body-sm font-bold text-zinc-900 transition-smooth leading-tight">{member.name}</span>
                          <span className="text-[10px] text-zinc-455 font-semibold uppercase mt-0.5">Member since {member.joinDate.split(' ')[1] || member.joinDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-zinc-700">{member.id}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-550 text-[10px] font-bold rounded-full whitespace-nowrap">
                        {getMemberRegion(member)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold border border-zinc-200">
                        {member.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-body-sm text-zinc-650 leading-tight select-all">{member.email}</span>
                        <span className="text-[10px] text-zinc-400 font-semibold mt-0.5 select-all">{member.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {member.isCaptain ? (
                        <span className="px-2.5 py-0.5 border border-brand-red/35 text-brand-red bg-brand-red/5 font-extrabold rounded-md text-[9px] uppercase tracking-wide">
                          Captain
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 border border-zinc-200 text-zinc-500 bg-zinc-50 font-semibold rounded-md text-[9px] uppercase tracking-wide">
                          Member
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {member.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-zinc-805">
                      {referrals.filter(r => r.fromMemberId === member.id).length}
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-zinc-805">
                      {referrals.filter(r => r.toMemberId === member.id).length}
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                            className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer"
                            title="More Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeDropdown === member.id && (
                            <>
                              {/* Overlay to close the dropdown when clicking outside */}
                              <div
                                onClick={() => setActiveDropdown(null)}
                                className="fixed inset-0 z-40 cursor-default"
                              />
                              <div className="absolute right-0 mt-1 w-36 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-50 text-left animate-fade-in">
                                <button
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 transition-smooth"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    openEditModal(member);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 transition-smooth"
                                >
                                  Edit Profile
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget(member);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-[11px] font-extrabold text-brand-red transition-smooth border-t border-zinc-100"
                                >
                                  Delete Member
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination Component */}
        <Pagination
          totalItems={filteredMembers.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          label="localized Indian members"
        />
      </div>

      {/* Member Details Drawer overlay */}
      <div
        onClick={() => setSelectedMember(null)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[55] transition-opacity duration-300 ${selectedMember ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Sliding Drawer component */}
      <div className={`fixed right-0 top-0 h-screen w-full max-w-[420px] bg-white z-[60] border-l border-zinc-100 shadow-2xl transform transition-transform duration-300 ${selectedMember ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {selectedMember && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-700 transition-smooth cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-section-heading font-extrabold text-zinc-955">Member Details</h3>
              </div>
              <button
                onClick={() => openEditModal(selectedMember)}
                className="p-1.5 hover:bg-zinc-200 rounded-lg text-brand-red hover:bg-brand-red/5 transition-smooth cursor-pointer"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Profile Card Summary */}
              <div className="flex flex-col items-center gap-3 text-center bg-white p-4 rounded-xl border border-zinc-200/60 shadow-2xs">
                <div className="w-20 h-20 rounded-full border-2 border-brand-red/20 p-1 bg-white">
                  <div className="w-full h-full rounded-full bg-brand-red/10 text-brand-red font-bold text-xl flex items-center justify-center shadow-inner">
                    {selectedMember.avatar}
                  </div>
                </div>
                <div>
                  <h4 className="text-headline-md font-bold text-zinc-950 leading-tight">{selectedMember.name}</h4>
                  <p className="text-body-text text-zinc-500 font-semibold">{selectedMember.company}</p>
                  <div className="flex gap-2 mt-2.5 justify-center">
                    {selectedMember.isCaptain ? (
                      <span className="px-2.5 py-0.5 border border-brand-red/35 text-brand-red bg-brand-red/5 font-extrabold rounded-md text-[9px] uppercase tracking-wide">
                        Captain
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 border border-zinc-200 text-zinc-500 bg-white font-semibold rounded-md text-[9px] uppercase tracking-wide">
                        Member
                      </span>
                    )}
                    {selectedMember.status === 'Active' ? (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-md text-[9px] font-extrabold uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-500 border border-zinc-200 rounded-md text-[9px] font-semibold uppercase">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2.5 mt-3 justify-center border-t border-zinc-100 pt-2.5 w-full">
                    <span className="px-2 py-1 bg-zinc-50 border border-zinc-150 rounded-lg text-[9.5px] font-bold text-zinc-600">
                      Sent: {referrals.filter(r => r.fromMemberId === selectedMember.id).length}
                    </span>
                    <span className="px-2 py-1 bg-zinc-50 border border-zinc-150 rounded-lg text-[9.5px] font-bold text-zinc-600">
                      Received: {referrals.filter(r => r.toMemberId === selectedMember.id).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Member Info details */}
              <section className="space-y-3">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">Member Information</h5>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Member ID</span>
                    <span className="text-body-sm font-bold text-zinc-800">{selectedMember.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">BNI Chapter</span>
                    <span className="text-body-sm font-bold text-zinc-800">{selectedMember.chapter}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Classification</span>
                    <span className="text-body-sm font-bold text-zinc-800">{selectedMember.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Join Date</span>
                    <span className="text-body-sm font-bold text-zinc-800">{selectedMember.joinDate}</span>
                  </div>
                </div>
              </section>

              {/* Contact Details */}
              <section className="space-y-4">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">Contact Details</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-zinc-100 text-zinc-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-semibold block">Email Address</span>
                      <span className="text-body-sm font-bold text-zinc-800 select-all">{selectedMember.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-zinc-100 text-zinc-500 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-semibold block">Mobile Number</span>
                      <span className="text-body-sm font-bold text-zinc-800 select-all">{selectedMember.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="p-1.5 bg-zinc-100 text-zinc-500 rounded-lg flex items-center justify-center mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-semibold block">Office Location</span>
                      <span className="text-body-sm font-bold text-zinc-800 select-all">{selectedMember.address}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Conclave History */}
              <section className="space-y-3.5">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">Conclave Activity</h5>
                <div className="relative pl-3 space-y-5 border-l border-zinc-100 ml-1.5">
                  {selectedMember.history.map((hist, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[17.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-brand-red' : 'bg-zinc-300'
                        }`} />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-caption font-bold text-zinc-800 leading-tight">{hist.event}</span>
                        <span className="text-[10px] text-zinc-500 font-medium">{hist.date} • {hist.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Referral History */}
              <section className="space-y-3.5">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">Referral History</h5>
                <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200">
                  {referrals.filter(r => r.fromMemberId === selectedMember.id || r.toMemberId === selectedMember.id).length === 0 ? (
                    <p className="p-4 text-center text-[10.5px] text-zinc-400 font-semibold bg-white">No referrals logged for this member.</p>
                  ) : (
                    referrals.filter(r => r.fromMemberId === selectedMember.id || r.toMemberId === selectedMember.id).map(ref => {
                      const isGiven = ref.fromMemberId === selectedMember.id;
                      return (
                        <div key={ref.id} className="p-3 bg-white hover:bg-zinc-50/50 transition-colors text-body-sm">
                          <div className="flex justify-between items-start">
                            <p className="font-black text-zinc-800 text-[11.5px]">
                              {isGiven ? `Given to: ${ref.toName}` : `Received from: ${ref.fromName}`}
                            </p>
                            <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded border ${
                              ref.status === 'Connected'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                                : ref.status === 'Closed'
                                ? 'bg-zinc-150 text-zinc-650 border-zinc-250'
                                : 'bg-amber-50 text-amber-700 border-amber-150'
                            }`}>
                              {ref.status}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-zinc-500 mt-1 italic">"{ref.description}"</p>
                          <span className="text-[8px] text-zinc-400 font-extrabold uppercase mt-1 block">{ref.date}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-col gap-2 shrink-0">
              <button
                onClick={() => {
                  setReassignTarget(selectedMember);
                  setNewChapterVal(selectedMember.chapter);
                }}
                className="w-full py-2 bg-brand-red hover:bg-red-700 text-white rounded-lg text-button font-bold transition-smooth shadow-sm cursor-pointer"
              >
                Reassign Chapter
              </button>
              <button
                onClick={() => setSelectedMember(null)}
                className="w-full py-2 bg-white border border-zinc-100 text-zinc-650 hover:bg-zinc-50 rounded-lg text-button font-bold transition-smooth shadow-sm cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Member Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-white">
              <h3 className="text-section-heading font-extrabold text-zinc-950">
                {editingMember ? 'Edit Member Profile' : 'Add New Member'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 font-bold transition-smooth text-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth"
                    placeholder="e.g. Rajesh Mehta"
                  />
                </div>

                {/* Classification / Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Classification</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white font-medium text-zinc-700 cursor-pointer"
                  >
                    <option value="Real Estate">Real Estate</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Corporate Gifting">Corporate Gifting</option>
                    <option value="IT Services">IT Services</option>
                    <option value="HR Services">HR Services</option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>

                {/* Chapter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">BNI Chapter</label>
                  <select
                    value={formData.chapter}
                    onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white font-medium text-zinc-700 cursor-pointer"
                  >
                    <option value="Peak Performance">Peak Performance</option>
                    <option value="Apex Chapter">Apex Chapter</option>
                    <option value="Capital Chapter">Capital Chapter</option>
                  </select>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth"
                    placeholder="name@company.com"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth"
                    placeholder="+91 98XXX XXXXX"
                  />
                </div>

                {/* Company Name */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth"
                    placeholder="e.g. Mehta Developers"
                  />
                </div>

                {/* Office Location */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Office Location</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth"
                    placeholder="Full business office address"
                  />
                </div>

                {/* Role Toggle & Status Select */}
                <div className="col-span-2 flex items-center justify-between pt-2 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="form-is-captain"
                      checked={formData.isCaptain}
                      onChange={(e) => setFormData({ ...formData, isCaptain: e.target.checked })}
                      className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="form-is-captain" className="text-body-sm font-semibold text-zinc-700 cursor-pointer select-none">
                      Assign as Chapter Captain
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Status:</span>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="border border-zinc-200 rounded-lg px-2.5 py-1 text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white font-semibold text-zinc-700 cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-button rounded-lg transition-smooth shadow-sm cursor-pointer border border-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth shadow-sm cursor-pointer"
                >
                  {editingMember ? 'Save Changes' : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-xl border border-zinc-100 shadow-2xl p-5 space-y-4 animate-scale-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-body-sm font-bold text-zinc-950 leading-tight">Confirm Deletion</h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  Are you sure you want to remove this member? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-zinc-200/60 shadow-2xs text-[11px] text-zinc-500 font-medium">
              Name: <span className="font-bold text-zinc-900">{deleteTarget.name}</span><br />
              ID: <span className="font-mono text-zinc-700 font-bold">{deleteTarget.id}</span>
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
                  setMembers(prev => prev.filter(m => m.id !== deleteTarget.id));
                  showToast(`Member "${deleteTarget.name}" has been deleted.`, 'success');
                  setDeleteTarget(null);
                }}
                className="px-3.5 py-1.5 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-xl border border-zinc-100 shadow-2xl p-5 space-y-4 animate-scale-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                <X className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-body-sm font-bold text-zinc-950 leading-tight">Confirm Bulk Deletion</h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  Are you sure you want to remove all {selectedRows.size} selected members? This action is permanent and cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsBulkDeleteConfirmOpen(false)}
                className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold border border-zinc-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setMembers(prev => prev.filter(m => !selectedRows.has(m.id)));
                  showToast(`Successfully deleted ${selectedRows.size} selected members.`, 'success');
                  setSelectedRows(new Set());
                  setIsBulkDeleteConfirmOpen(false);
                }}
                className="px-3.5 py-1.5 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Chapter Modal */}
      {reassignTarget && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-white">
              <h3 className="text-section-heading font-extrabold text-zinc-955">Reassign Chapter</h3>
              <button
                onClick={() => setReassignTarget(null)}
                className="text-zinc-400 hover:text-zinc-700 font-bold transition-smooth cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-white p-3 rounded-lg border border-zinc-200/60 shadow-2xs text-[11px] text-zinc-500 font-medium">
                Member: <span className="font-bold text-zinc-900">{reassignTarget.name}</span><br />
                Current: <span className="font-semibold text-zinc-700">{reassignTarget.chapter}</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Target BNI Chapter</label>
                <select
                  value={newChapterVal}
                  onChange={(e) => setNewChapterVal(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white font-medium text-zinc-700 cursor-pointer animate-none"
                >
                  <option value="Peak Performance">Peak Performance</option>
                  <option value="Apex Chapter">Apex Chapter</option>
                  <option value="Capital Chapter">Capital Chapter</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setReassignTarget(null)}
                  className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold border border-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMembers(prev => prev.map(m => m.id === reassignTarget.id ? { ...m, chapter: newChapterVal } : m));
                    setSelectedMember(prev => prev ? { ...prev, chapter: newChapterVal } : null);
                    showToast(`Successfully reassigned ${reassignTarget.name} to ${newChapterVal}.`, 'success');
                    setReassignTarget(null);
                  }}
                  className="px-3.5 py-1.5 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold"
                >
                  Reassign
                </button>
              </div>
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
            onClick={handleBulkExport}
            className="text-white hover:text-brand-red transition-smooth flex items-center gap-1.5 cursor-pointer text-button text-[10px]"
          >
            <Upload className="w-3.5 h-3.5" />
            Export Selected
          </button>
          <button
            onClick={() => setIsBulkDeleteConfirmOpen(true)}
            className="text-brand-red hover:text-red-400 transition-smooth flex items-center gap-1.5 cursor-pointer text-button text-[10px]"
          >
            <X className="w-3.5 h-3.5" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[70] bg-zinc-900 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-xl flex items-center gap-2 border border-zinc-800 animate-slide-up">
          {toast.type === 'success' ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          )}
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
