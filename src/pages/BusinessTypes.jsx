import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronRight,
  Plus,
  X,
  Edit2,
  Trash2,
  Download,
  Upload,
  Layers,
  MoreVertical
} from 'lucide-react';
import Pagination from '../components/Pagination';

const initialCategories = [
  {
    id: 'BT-00492',
    name: 'Financial Consultancy',
    description: 'Wealth management, tax preparation, and audit services for SMEs. This includes specialized forensic accounting and risk mitigation advisory.',
    memberCount: 458,
    growth: '+12.4%',
    createdDate: 'Nov 05, 2023',
    status: 'Active',
    usage: [30, 50, 45, 70, 65, 85],
    chapters: [
      { name: 'BNI Alpha Mumbai', members: 42 },
      { name: 'Elite Synergy Bengaluru', members: 38 },
      { name: 'Global Connect Delhi', members: 29 }
    ]
  },
  {
    id: 'BT-00101',
    name: 'Architectural Services',
    description: 'Commercial and residential structural design and planning. Specializing in green building certifications.',
    memberCount: 312,
    growth: '+4.2%',
    createdDate: 'Oct 12, 2023',
    status: 'Active',
    usage: [20, 35, 40, 55, 50, 60],
    chapters: [
      { name: 'BNI Alpha Mumbai', members: 25 },
      { name: 'Peak Pioneers Pune', members: 18 }
    ]
  },
  {
    id: 'BT-00103',
    name: 'Web & Software Dev',
    description: 'IT solutions, custom mobile applications development, and enterprise cloud infrastructure management.',
    memberCount: 612,
    growth: '+18.6%',
    createdDate: 'Jan 18, 2024',
    status: 'Active',
    usage: [40, 60, 55, 80, 75, 95],
    chapters: [
      { name: 'Global Connect Delhi', members: 55 },
      { name: 'Elite Synergy Bengaluru', members: 48 },
      { name: 'Tech Leaders Hyderabad', members: 32 }
    ]
  },
  {
    id: 'BT-00104',
    name: 'Legal Arbitration',
    description: 'Dispute resolution, commercial contract law services, and statutory compliance reviews for large corporate entities.',
    memberCount: 0,
    growth: '0.0%',
    createdDate: 'Feb 22, 2024',
    status: 'Inactive',
    usage: [10, 15, 10, 5, 0, 0],
    chapters: []
  },
  {
    id: 'BT-00105',
    name: 'Corporate Training',
    description: 'Leadership coaching, team productivity bootcamps, and soft skills training programs for enterprises.',
    memberCount: 124,
    growth: '+8.1%',
    createdDate: 'Aug 15, 2023',
    status: 'Active',
    usage: [15, 20, 30, 25, 35, 45],
    chapters: [
      { name: 'Capital Leaders Kochi', members: 15 }
    ]
  },
  {
    id: 'BT-00106',
    name: 'Interior Styling',
    description: 'Aesthetic spacing and modular furniture design planning for residential and luxury commercial sites.',
    memberCount: 98,
    growth: '+3.9%',
    createdDate: 'Dec 11, 2023',
    status: 'Active',
    usage: [10, 12, 18, 22, 20, 28],
    chapters: [
      { name: 'Peak Performance Mumbai', members: 12 }
    ]
  }
];

export default function BusinessTypes({ searchQuery }) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const searchVal = searchQuery !== undefined ? searchQuery : searchTerm;
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  // Modals & toast states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
    if (selectedRows.size === filteredCategories.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredCategories.map(c => c.id)));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSelectedRows(new Set());
  };

  // KPI Calculations
  const totalTypes = categories.length;
  const activeCount = categories.filter(c => c.status === 'Active').length;
  const totalMembersCount = categories.reduce((sum, c) => sum + c.memberCount, 0);
  const inactiveCount = categories.filter(c => c.status === 'Inactive').length;

  // Filtered List
  const filteredCategories = useMemo(() => {
    setCurrentPage(1); // Reset to page 1 on filter changes
    setSelectedRows(new Set());
    return categories.filter(cat => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        cat.id.toLowerCase().includes(searchVal.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchVal.toLowerCase());

      const matchesStatus = statusFilter === 'All' || cat.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchVal, statusFilter]);

  // Paginated List
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage]);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      status: 'Active'
    });
    setIsFormOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      status: category.status
    });
    setSelectedCategory(null); // close drawer if open
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a classification name.', 'error');
      return;
    }

    if (editingCategory) {
      // Edit mode
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? {
        ...c,
        ...formData
      } : c));
      showToast(`Category "${formData.name}" was successfully updated.`, 'success');
    } else {
      // Add mode
      const newCat = {
        id: `BT-00${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        description: formData.description,
        memberCount: 0,
        growth: '0.0%',
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: formData.status,
        usage: [0, 0, 0, 0, 0, 0],
        chapters: []
      };
      setCategories(prev => [newCat, ...prev]);
      showToast(`Created new classification "${formData.name}".`, 'success');
    }

    setIsFormOpen(false);
  };

  const handleExport = () => {
    if (filteredCategories.length === 0) {
      showToast('No classifications to export!', 'error');
      return;
    }
    const headers = ['Classification ID', 'Name', 'Description', 'Member Count', 'Growth', 'Created Date', 'Status'];
    const rows = filteredCategories.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.description}"`,
      c.memberCount,
      c.growth,
      c.createdDate,
      c.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bni_classifications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export only checked classifications to CSV
  const handleBulkExport = () => {
    const selectedList = categories.filter(c => selectedRows.has(c.id));
    if (selectedList.length === 0) return;
    
    const headers = ['Classification ID', 'Name', 'Description', 'Member Count', 'Growth', 'Created Date', 'Status'];
    const rows = selectedList.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.description}"`,
      c.memberCount,
      c.growth,
      c.createdDate,
      c.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `selected_classifications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Successfully exported ${selectedList.length} selected classifications.`, 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length <= 1) return;

      const newCats = [];
      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',').map(col => col.replace(/^["']|["']$/g, '').trim());
        if (columns.length >= 3) {
          const [id, name, description, memberCount, growth, createdDate, status] = columns;
          newCats.push({
            id: id || `BT-00${Math.floor(100 + Math.random() * 900)}`,
            name: name || 'Unnamed Category',
            description: description || 'No description provided.',
            memberCount: parseInt(memberCount) || 0,
            growth: growth || '0.0%',
            createdDate: createdDate || 'Just now',
            status: status === 'Inactive' ? 'Inactive' : 'Active',
            usage: [0, 0, 0, 0, 0, 0],
            chapters: []
          });
        }
      }

      if (newCats.length > 0) {
        setCategories(prev => [...newCats, ...prev]);
        showToast(`Successfully imported ${newCats.length} classifications from CSV!`, 'success');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">

      {/* Page Header */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">Business Types</h2>
          <p className="text-body-text text-zinc-500 mt-2">
            Manage professional classifications and network categories.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <input
            type="file"
            id="csv-class-input"
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
            onClick={() => document.getElementById('csv-class-input').click()}
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
            Add Category
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Total Types</span>
          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">{totalTypes}</span>
        </div>
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Active Classifications</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">{activeCount}</span>
            <span className="text-label-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {totalTypes > 0 ? ((activeCount / totalTypes) * 100).toFixed(0) : 0}% Ratio
            </span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Total Members</span>
          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">
            {totalMembersCount.toLocaleString()}
          </span>
        </div>
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">Unused Items</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-display-sm font-extrabold text-zinc-900 leading-none">{inactiveCount}</span>
            {inactiveCount > 0 && (
              <span className="text-label-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">Attention</span>
            )}
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
              placeholder="Filter by name, ID, or description..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-zinc-200 rounded-lg px-3 py-2 text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none bg-white font-medium text-zinc-700 transition-smooth cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button
          onClick={resetFilters}
          className="text-label-md font-bold text-brand-red hover:underline px-4 cursor-pointer shrink-0 transition-smooth"
        >
          Reset Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-label-xs font-bold text-zinc-400 uppercase tracking-wider">
                <th className="px-5 py-4 w-12 text-center">
                  <input
                    checked={filteredCategories.length > 0 && selectedRows.size === filteredCategories.length}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                    type="checkbox"
                  />
                </th>
                <th className="px-5 py-4">Business Type</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4 text-center">Members</th>
                <th className="px-5 py-4">Created Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-table-text">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-zinc-400 font-medium">
                    No business classifications match the active filters.
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className="group cursor-pointer"
                  >
                    <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        checked={selectedRows.has(cat.id)}
                        onChange={(e) => toggleRow(cat.id, e)}
                        className="rounded border-zinc-300 text-brand-red focus:ring-brand-red cursor-pointer w-4 h-4"
                        type="checkbox"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${cat.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-300'
                          }`} />
                        <span className="text-body-sm font-bold text-zinc-900 transition-smooth">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-body-sm text-zinc-650 max-w-xs truncate">
                      {cat.description}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-650 text-[10px] font-bold font-mono">
                        {cat.memberCount}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-body-sm font-medium text-zinc-500">{cat.createdDate}</td>
                    <td className="px-5 py-4">
                      {cat.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === cat.id ? null : cat.id)}
                            className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-brand-red transition-smooth cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {activeDropdown === cat.id && (
                            <>
                              <div
                                onClick={() => setActiveDropdown(null)}
                                className="fixed inset-0 z-40 cursor-default"
                              />
                              <div className="absolute right-0 mt-1 w-36 bg-white border border-zinc-100 rounded-lg shadow-lg py-1 z-50 text-left animate-fade-in">
                                <button
                                  onClick={() => {
                                    setSelectedCategory(cat);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 transition-smooth"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    openEditModal(cat);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 transition-smooth"
                                >
                                  Edit Category
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget(cat);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-[11px] font-extrabold text-brand-red transition-smooth border-t border-zinc-100"
                                >
                                  Delete Category
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

        {/* Reusable Pagination */}
        <Pagination
          totalItems={filteredCategories.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          label="classifications"
        />
      </div>

      {/* Details Side Drawer */}
      <div
        onClick={() => setSelectedCategory(null)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[55] transition-opacity duration-300 ${selectedCategory ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      <div className={`fixed right-0 top-0 h-screen w-full max-w-[420px] bg-white z-[60] border-l border-zinc-200 shadow-2xl transform transition-transform duration-300 ${selectedCategory ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {selectedCategory && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-700 transition-smooth cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-section-heading font-extrabold text-zinc-950">Category Details</h3>
              </div>
              <button
                onClick={() => openEditModal(selectedCategory)}
                className="p-1.5 hover:bg-zinc-200 rounded-lg text-brand-red hover:bg-brand-red/5 transition-smooth cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Category Card Summary */}
              <div className="flex flex-col items-center gap-3 text-center bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <div className="w-16 h-16 rounded-full border-2 border-brand-red/20 p-1 bg-white">
                  <div className="w-full h-full rounded-full bg-brand-red/10 text-brand-red font-bold text-lg flex items-center justify-center shadow-inner">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-headline-md font-bold text-zinc-950 leading-tight">{selectedCategory.name}</h4>
                  <p className="text-[10px] font-mono text-zinc-400 font-bold mt-1">ID: {selectedCategory.id}</p>
                  <div className="flex gap-2 mt-2 justify-center">
                    {selectedCategory.status === 'Active' ? (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-md text-[9px] font-extrabold uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-500 border border-zinc-200 rounded-md text-[9px] font-semibold uppercase">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Details */}
              <section className="space-y-3">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">Description</h5>
                <p className="text-body-sm text-zinc-500 leading-relaxed">{selectedCategory.description}</p>
              </section>

              {/* Performance metrics */}
              <section className="space-y-3">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">Growth Performance</h5>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Members</span>
                    <span className="text-headline-lg font-bold text-zinc-950 block mt-1">{selectedCategory.memberCount}</span>
                  </div>
                  <div className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Growth Rate</span>
                    <span className="text-headline-lg font-bold text-brand-red block mt-1">{selectedCategory.growth}</span>
                  </div>
                </div>
              </section>

              {/* Usage analytics chart */}
              <section className="space-y-3.5">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">Usage Frequency (6mo)</h5>
                <div className="w-full h-24 bg-white flex items-end px-2 gap-1.5 pb-2 border-b border-zinc-100 mt-2.5">
                  {selectedCategory.usage.map((height, i) => (
                    <div
                      key={i}
                      style={{ height: `${height}%` }}
                      className={`flex-1 transition-smooth rounded-t-sm hover:bg-brand-red/30 cursor-pointer ${i === 5 ? 'bg-brand-red' : 'bg-zinc-100'
                        }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between px-1 text-[9px] font-bold text-zinc-350 uppercase">
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span className="text-brand-red">Feb</span>
                </div>
              </section>

              {/* Top Chapters */}
              {selectedCategory.chapters.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Top Chapters</h5>
                    <span className="text-[9px] font-bold text-brand-red uppercase">Region Peak</span>
                  </div>
                  <div className="space-y-1">
                    {selectedCategory.chapters.map((ch, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-zinc-50 transition-smooth group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-brand-red transition-colors" />
                          <span className="text-body-sm text-zinc-700 font-semibold">{ch.name}</span>
                        </div>
                        <span className="text-body-sm font-bold font-mono text-zinc-400">{ch.members}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-col gap-2 shrink-0">
              <button
                onClick={() => showToast(`Manage Assignments for "${selectedCategory.name}" is coming soon!`, 'success')}
                className="w-full py-2 bg-brand-red hover:bg-red-700 text-white text-button font-bold rounded-lg shadow-sm transition-smooth cursor-pointer"
              >
                Manage Assignments
              </button>
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-full py-2 bg-white border border-zinc-100 text-zinc-650 hover:bg-zinc-50 text-button font-bold rounded-lg shadow-sm transition-smooth cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-xl border border-zinc-100 shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <h3 className="text-section-heading font-extrabold text-zinc-950">
                {editingCategory ? 'Edit Classification' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-450 hover:text-zinc-700 transition-smooth cursor-pointer font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Classification Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth"
                    placeholder="e.g. Accounting Systems"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Description Details</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-body-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth resize-none"
                    placeholder="Provide a detailed scope of this business classification..."
                  />
                </div>

                {/* Status selection */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Classification Status</span>
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

              {/* Form Buttons */}
              <div className="pt-4 flex justify-end gap-2.5 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-button rounded-lg transition-smooth cursor-pointer border border-zinc-200 text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-red hover:bg-red-700 text-white text-button rounded-lg transition-smooth cursor-pointer text-[10px] font-bold"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
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
                  Are you sure you want to remove this classification? All assigned member counts will be reset.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-[11px] text-zinc-500 font-medium">
              Category: <span className="font-bold text-zinc-900">{deleteTarget.name}</span><br />
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
                  setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
                  showToast(`Classification "${deleteTarget.name}" was deleted.`, 'success');
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
                  Are you sure you want to remove all {selectedRows.size} selected classifications? This action is permanent and cannot be undone.
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
                  setCategories(prev => prev.filter(c => !selectedRows.has(c.id)));
                  showToast(`Successfully deleted ${selectedRows.size} classifications.`, 'success');
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
