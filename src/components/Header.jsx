import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 flex justify-between items-center px-6 h-[64px] shrink-0">
      <div className="flex items-center gap-8 flex-1">
        {/* Title - Manrope 20px 600 */}
        <span className="text-headline-md text-zinc-950 font-bold tracking-tight">
          BNI 1-to-1 Conclave
        </span>
        
        {/* Search Bar - Inter 14px 400 */}
        <div className="relative w-full max-w-md">
          <Search className="w-[18px] h-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-white border border-zinc-200 rounded-lg text-body-text placeholder-zinc-400 focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-smooth"
            placeholder="Search members, conclaves or reports..."
            type="text"
          />
        </div>
      </div>

      {/* Header Utilities */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-brand-red hover:bg-zinc-50 transition-smooth cursor-pointer">
          <Bell className="w-[18px] h-[18px]" />
        </button>
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-brand-red hover:bg-zinc-50 transition-smooth cursor-pointer">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>
        <div className="h-6 w-[1px] bg-zinc-200 mx-2"></div>
        <img
          className="w-8 h-8 rounded-full border border-zinc-200 object-cover shadow-sm"
          alt="Executive Profile Avatar"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv-yW3IPbTrSyCD5ymyfzT6t7bql2APlu3hSHHHDVCE7Y4r_YiLmtFMlFIms-Gxo_j1pqDt6HQ9oRxcf-lFNsyt6_-2sghoE9LwLs6_-UP1GJku_ulQ9RLsW4vo6oqSQ4N8B1dbpHl61Zxv9EUgV3iQzQ3XBB3Dae2kGS748eshMj-PkgE7dt8zdeD3B31jLQUF31a4nPao9ZbMPjRIPITWaZjeVaB5VU7S7yBZ9lRWdsrmBZQJVswdKV39drFn-7EvbvaZuwO2_o"
        />
      </div>
    </header>
  );
}
