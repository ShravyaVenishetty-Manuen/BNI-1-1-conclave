import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Pagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange, 
  label = "members" 
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const handlePrev = () => {
    if (safeCurrentPage > 1) onPageChange(safeCurrentPage - 1);
  };

  const handleNext = () => {
    if (safeCurrentPage < totalPages) onPageChange(safeCurrentPage + 1);
  };

  // Generate range of page numbers around current page
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, safeCurrentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50/50">
      <span className="text-body-sm text-zinc-500 font-medium">
        Showing {totalItems > 0 ? (safeCurrentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(safeCurrentPage * itemsPerPage, totalItems)} of {totalItems} {label}
      </span>
      
      <div className="flex items-center gap-1.5">
        {/* Previous page arrow */}
        <button 
          onClick={handlePrev}
          disabled={safeCurrentPage === 1}
          className="p-1.5 border border-zinc-200 bg-white rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-600 transition-smooth cursor-pointer shadow-2xs"
          title="Previous Page"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        
        {/* Numeric page buttons */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center text-label-md font-extrabold rounded-lg transition-smooth cursor-pointer ${
              safeCurrentPage === page
                ? 'bg-brand-red text-white shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100 bg-white border border-zinc-200/60'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page arrow */}
        <button 
          onClick={handleNext}
          disabled={safeCurrentPage === totalPages}
          className="p-1.5 border border-zinc-200 bg-white rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-600 transition-smooth cursor-pointer shadow-2xs"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
