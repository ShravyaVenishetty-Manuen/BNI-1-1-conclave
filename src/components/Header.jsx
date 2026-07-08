import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, Check, AlertTriangle, AlertCircle, Sparkles, Menu } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery, activeTab, setActiveTab, onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Validation Conflict Detected',
      desc: 'Table 04 has a business classification conflict (Real Estate).',
      time: '5 mins ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 2,
      title: 'Schedule Generated Successfully',
      desc: 'Optimized seating arrangements generated for 1,240 members.',
      time: '1 hour ago',
      type: 'success',
      unread: true,
    },
    {
      id: 3,
      title: 'West Chapter Underfilled',
      desc: 'West Chapter requires 2 more captains to manage table assignments.',
      time: '2 hours ago',
      type: 'error',
      unread: false,
    },
  ]);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleReadStatus = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white border-b border-brand-red/15 flex justify-between items-center px-4 sm:px-8 h-14 shrink-0 font-sans">

      {/* Left side: Logo & Navigation */}
      <div className="flex items-center gap-3 sm:gap-8">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-555 hover:text-zinc-800 transition-smooth cursor-pointer flex items-center justify-center"
          title="Open Menu"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>
        <span
          onClick={() => setActiveTab && setActiveTab('dashboard')}
          className="text-body-md sm:text-body-lg font-extrabold text-brand-red cursor-pointer tracking-tight whitespace-nowrap"
        >
          BNI 1-1-Conclave
        </span>
      </div>

      {/* Right side: Search & User Utilities */}
      <div className="flex items-center gap-2.5 sm:gap-4 relative">
        {/* Search Input */}
        <div className="relative w-full max-w-[130px] sm:max-w-none sm:w-64">
          <Search className="w-4 h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded text-body-sm sm:text-body-md placeholder-zinc-400 focus:outline-none focus:border-zinc-800 transition-smooth font-semibold"
            placeholder="Search..."
            type="text"
          />
        </div>

        {/* Notifications Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-zinc-500 hover:text-brand-red transition-colors cursor-pointer rounded-lg hover:bg-zinc-50 relative flex items-center justify-center"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-red text-[7.5px] font-extrabold text-white leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Modal */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden text-zinc-800 flex flex-col max-h-[420px]">
              {/* Dropdown Header */}
              <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-body-sm font-extrabold text-zinc-950">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-brand-red/5 text-brand-red text-[9px] font-extrabold border border-brand-red/10">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-brand-red hover:underline font-bold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="overflow-y-auto divide-y divide-zinc-100 flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400 space-y-2 flex flex-col items-center">
                    <Bell className="w-8 h-8 text-zinc-300" />
                    <p className="text-label-md font-semibold">No notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 flex gap-3 transition-colors duration-200 group relative hover:bg-zinc-50/60 ${n.unread ? 'bg-brand-red/5/10' : ''
                        }`}
                    >
                      {/* Unread dot indicator */}
                      {n.unread && (
                        <div className="absolute left-2 top-4.5 w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                      )}

                      {/* Icon type indicator */}
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'warning' ? (
                          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        ) : n.type === 'error' ? (
                          <div className="p-1.5 rounded-lg bg-red-50 text-brand-red border border-red-100">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      {/* Text content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-body-sm font-extrabold text-zinc-950 leading-snug">{n.title}</p>
                        <p className="text-[11px] text-zinc-500 leading-normal mt-0.5 font-medium">{n.desc}</p>
                        <p className="text-[9px] text-zinc-400 mt-1 font-bold">{n.time}</p>
                      </div>

                      {/* Hover action menu buttons */}
                      <div className="absolute right-2 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white group-hover:bg-zinc-50 shadow-xs border border-zinc-150 rounded px-1 py-0.5">
                        <button
                          onClick={() => toggleReadStatus(n.id)}
                          title={n.unread ? "Mark as read" : "Mark as unread"}
                          className="p-1 hover:text-zinc-900 text-zinc-400 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeNotification(n.id)}
                          title="Dismiss notification"
                          className="p-1 hover:text-brand-red text-zinc-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full border border-zinc-200 overflow-hidden cursor-pointer shadow-sm">
          <img
            className="w-full h-full object-cover"
            alt="Profile Avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv-yW3IPbTrSyCD5ymyfzT6t7bql2APlu3hSHHHDVCE7Y4r_YiLmtFMlFIms-Gxo_j1pqDt6HQ9oRxcf-lFNsyt6_-2sghoE9LwLs6_-UP1GJku_ulQ9RLsW4vo6oqSQ4N8B1dbpHl61Zxv9EUgV3iQzQ3XBB3Dae2kGS748eshMj-PkgE7dt8zdeD3B31jLQUF31a4nPao9ZbMPjRIPITWaZjeVaB5VU7S7yBZ9lRWdsrmBZQJVswdKV39drFn-7EvbvaZuwO2_o"
          />
        </div>
      </div>

    </header>
  );
}
