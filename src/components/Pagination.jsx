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

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
      <span className="text-body-sm text-zinc-500">
        Showing {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} {label}
      </span>
      <div className="flex items-center gap-1.5">
        {/* Previous page arrow */}
        <button 
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="p-1.5 border border-zinc-200 bg-white rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-400 transition-smooth cursor-pointer shadow-sm"
          title="Previous Page"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        
        {/* Numeric page buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center text-label-md font-bold rounded-lg transition-smooth cursor-pointer ${
              currentPage === page
                ? 'bg-brand-red text-white shadow-sm'
                : 'text-zinc-500 hover:bg-zinc-100'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page arrow */}
        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-1.5 border border-zinc-200 bg-white rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-400 transition-smooth cursor-pointer shadow-sm"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
