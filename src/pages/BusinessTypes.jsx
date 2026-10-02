import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  X,
  Layers,
} from 'lucide-react';
import Pagination from '../components/Pagination';
import SearchableDropdown from '../components/SearchableDropdown';
import { api } from '../services/api';

export default function BusinessTypes({
  searchQuery,
  selectedConclaveId,
  loggedInAdmin,
}) {
  const [categories, setCategories] = useState(() => {
    const cached = localStorage.getItem('bni_admin_categories_cache');

    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }

    return [];
  });

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load registrations and derive business categories
  useEffect(() => {
    async function loadMembersAndCategories() {
      setIsLoading(true);

      try {
        let rawList = [];

        if (selectedConclaveId) {
          try {
            const res = await api.get(
              `/admin/conclaves/${selectedConclaveId}/registrations`
            );

            if (res && Array.isArray(res.registrations)) {
              rawList = res.registrations;
            }
          } catch (error) {
            console.error('Failed to load conclave registrations:', error);
          }
        } else {
          const allUsers = await api.get('/admin/users');

          if (Array.isArray(allUsers)) {
            rawList = allUsers;
          }
        }

        const mapped = rawList.map((r) => {
          const displayName = r.name?.trim() || r.uid || 'Unknown Member';

          const fallbackCategory =
            r.category || r.businessCategory?.trim() || 'General';

          const fallbackCompany =
            r.company || r.businessName?.trim() || 'Self Employed';

          const fallbackLocation =
            typeof r.location === 'object' && r.location !== null
              ? r.location.place || r.location.city || ''
              : r.location || r.address || '';

          return {
            id: r.id || r.uid,
            name: displayName,
            email: r.email?.trim() || 'n/a',
            phone: r.phone?.trim() || r.mobile?.trim() || 'n/a',
            company: fallbackCompany,
            category: fallbackCategory,
            address: fallbackLocation,
            state: r.state || '',
            country: r.country || '',
            chapter: r.chapter || '',
            region: r.region || '',
            isCaptain: r.role === 'captain' || r.isTableCaptain === true,
            status: r.status || (r.isActive ? 'Active' : 'Inactive'),
          };
        });

        setMembers(mapped);

        // Derive business categories from registrations
        const catMap = new Map();

        mapped.forEach((member) => {
          const categoryName = member.category?.trim() || 'General';

          if (!catMap.has(categoryName)) {
            catMap.set(categoryName, {
              id: `BT-${String(catMap.size + 1).padStart(3, '0')}`,
              name: categoryName,
              description: `${categoryName} Industry Classification`,
              status: 'Active',
              memberCount: 0,
              growth: '0.0%',
              createdDate: '—',
              usage: [0, 0, 0, 0, 0, 0],
              chapters: [],
            });
          }
        });

        const categoryList = Array.from(catMap.values());

        setCategories(categoryList);
        localStorage.setItem(
          'bni_admin_categories_cache',
          JSON.stringify(categoryList)
        );
      } catch (error) {
        console.error(
          'Failed to load registrations for business types:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMembersAndCategories();
  }, [selectedConclaveId]);

  // Sync global search
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== null) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (selectedCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCategory]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  // Members are already filtered by selected conclave
  const conclaveMembers = members;

  // Calculate category member counts
  const categoriesWithCounts = useMemo(() => {
    return categories.map((category) => {
      const count = conclaveMembers.filter(
        (member) => member.category === category.name
      ).length;

      return {
        ...category,
        memberCount: count,
      };
    });
  }, [categories, conclaveMembers]);

  // KPI calculations
  const totalTypes = categoriesWithCounts.length;

  const activeCount = categoriesWithCounts.filter(
    (category) => category.status === 'Active'
  ).length;

  const totalMembersCount = categoriesWithCounts.reduce(
    (sum, category) => sum + category.memberCount,
    0
  );

  const unusedCount = categoriesWithCounts.filter(
    (category) => category.memberCount === 0
  ).length;

  // Filter categories
  const filteredCategories = useMemo(() => {
    const query = (searchTerm || '').trim().toLowerCase();

    return categoriesWithCounts.filter((category) => {
      const matchesSearch =
        !query ||
        category.name?.toLowerCase().includes(query) ||
        category.id?.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query) ||
        category.status?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'All' || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categoriesWithCounts, searchTerm, statusFilter]);

  // Paginated categories
  const paginatedCategories = useMemo(() => {
    const totalPages =
      Math.ceil(filteredCategories.length / itemsPerPage) || 1;

    const safeCurrentPage = Math.min(
      Math.max(1, currentPage),
      totalPages
    );

    const startIndex = (safeCurrentPage - 1) * itemsPerPage;

    return filteredCategories.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredCategories, currentPage]);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="border-b border-zinc-100 pb-6">
        <h2 className="text-dashboard-title text-zinc-950 font-extrabold tracking-tight">
          Business Types
        </h2>

        <p className="text-body-text text-zinc-500 mt-2">
          View professional classifications and network categories based on
          registered members.
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">
            Total Types
          </span>

          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">
            {totalTypes}
          </span>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">
            Active Classifications
          </span>

          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">
            {activeCount}
          </span>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">
            Total Members
          </span>

          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">
            {totalMembersCount.toLocaleString()}
          </span>
        </div>

        <div className="bg-white border border-zinc-200/80 p-5 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-smooth">
          <span className="text-label-md text-zinc-500 uppercase font-semibold">
            Unused Items
          </span>

          <span className="text-display-sm font-extrabold text-zinc-900 leading-none mt-3">
            {unusedCount}
          </span>
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
            <SearchableDropdown
              label="Status"
              options={['All', 'Active', 'Inactive']}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Search status..."
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

      {/* Data Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-label-xs font-bold text-zinc-400 uppercase tracking-wider">
                <th className="px-5 py-4">Business Type</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4 text-center">Members</th>
                <th className="px-5 py-4">Created Date</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 text-table-text">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-zinc-400 font-medium"
                  >
                    Loading business types...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-zinc-400 font-medium"
                  >
                    No business classifications match the active filters.
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category) => (
                  <tr
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className="group cursor-pointer hover:bg-zinc-50/70 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            category.status === 'Active'
                              ? 'bg-emerald-500'
                              : 'bg-zinc-300'
                          }`}
                        />

                        <span className="text-body-sm font-bold text-zinc-900 transition-smooth">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-body-sm text-zinc-650 max-w-xs truncate">
                      {category.description}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-650 text-[10px] font-bold font-mono">
                        {category.memberCount}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-body-sm font-medium text-zinc-500">
                      {category.createdDate || '—'}
                    </td>

                    <td className="px-5 py-4">
                      {category.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalItems={filteredCategories.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          label="classifications"
        />
      </div>

      {/* Details Side Drawer */}
      {createPortal(
        <>
          {/* Drawer Overlay */}
          <div
            onClick={() => setSelectedCategory(null)}
            className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[9999] transition-opacity duration-300 ${
              selectedCategory
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Drawer */}
          <div
            className={`fixed right-0 top-0 bottom-0 h-screen w-full max-w-[420px] bg-white border-l border-zinc-200 shadow-2xl transform transition-transform duration-300 flex flex-col overflow-hidden z-[10000] ${
              selectedCategory
                ? 'translate-x-0 pointer-events-auto'
                : 'translate-x-full pointer-events-none'
            }`}
          >
            {selectedCategory && (
              <>
                {/* Drawer Header */}
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-700 transition-smooth cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <h3 className="text-section-heading font-extrabold text-zinc-950">
                      Category Details
                    </h3>
                  </div>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto min-h-0 p-5 space-y-6">
                  {/* Category Summary */}
                  <div className="flex flex-col items-center gap-3 text-center bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <div className="w-16 h-16 rounded-full border-2 border-brand-red/20 p-1 bg-white">
                      <div className="w-full h-full rounded-full bg-brand-red/10 text-brand-red font-bold text-lg flex items-center justify-center shadow-inner">
                        <Layers className="w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-headline-md font-bold text-zinc-950 leading-tight">
                        {selectedCategory.name}
                      </h4>

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

                  {/* Description */}
                  <section className="space-y-3">
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">
                      Description
                    </h5>

                    <p className="text-body-sm text-zinc-500 leading-relaxed">
                      {selectedCategory.description}
                    </p>
                  </section>

                  {/* Performance Metrics */}
                  <section className="space-y-3">
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">
                      Growth Performance
                    </h5>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                          Members
                        </span>

                        <span className="text-headline-lg font-bold text-zinc-950 block mt-1">
                          {selectedCategory.memberCount}
                        </span>
                      </div>

                      <div className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                          Growth Rate
                        </span>

                        <span className="text-headline-lg font-bold text-brand-red block mt-1">
                          {selectedCategory.growth || '0.0%'}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Usage Analytics */}
                  <section className="space-y-3.5">
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5">
                      Usage Frequency (6mo)
                    </h5>

                    <div className="w-full h-24 bg-white flex items-end px-2 gap-1.5 pb-2 border-b border-zinc-100 mt-2.5">
                      {(selectedCategory.usage || [0, 0, 0, 0, 0, 0]).map(
                        (height, index) => (
                          <div
                            key={index}
                            style={{ height: `${height}%` }}
                            className={`flex-1 transition-smooth rounded-t-sm hover:bg-brand-red/30 cursor-pointer ${
                              index === 5 ? 'bg-brand-red' : 'bg-zinc-100'
                            }`}
                          />
                        )
                      )}
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
                  {selectedCategory.chapters?.length > 0 && (
                    <section className="space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
                        <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Top Chapters
                        </h5>

                        <span className="text-[9px] font-bold text-brand-red uppercase">
                          Region Peak
                        </span>
                      </div>

                      <div className="space-y-1">
                        {selectedCategory.chapters.map((chapter, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-zinc-50 transition-smooth group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-brand-red transition-colors" />

                              <span className="text-body-sm text-zinc-700 font-semibold">
                                {chapter.name}
                              </span>
                            </div>

                            <span className="text-body-sm font-bold font-mono text-zinc-400">
                              {chapter.members}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-zinc-100 bg-white flex flex-col gap-2 shrink-0 shadow-lg">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="w-full py-2 bg-white border border-zinc-100 text-zinc-650 hover:bg-zinc-50 text-button font-bold rounded-lg shadow-sm transition-smooth cursor-pointer"
                  >
                    Close Drawer
                  </button>
                </div>
              </>
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
