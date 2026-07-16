import React, { useState } from 'react';
import {
  CheckCircle,
  LogOut,
  Edit2,
  LayoutGrid,
  Shield,
  LogIn,
  Save
} from 'lucide-react';

export default function CaptainProfile({ loggedInCaptain, onTabChange, onLogout }) {
  // Local editable state for profile info
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: loggedInCaptain?.name || 'Ganesh V.',
    email: loggedInCaptain?.email || 'ganesh.v@bni-guntur.in',
    phone: loggedInCaptain?.phone || loggedInCaptain?.mobile || '+91 98765 43210',
    designation: loggedInCaptain?.designation || 'Table Captain',
    company: loggedInCaptain?.company || 'Varma & Associates',
    category: loggedInCaptain?.category || 'Financial Consulting',
    chapter: loggedInCaptain?.chapter || 'Phoenix Chapter',
    registrationDate: loggedInCaptain?.registrationDate || loggedInCaptain?.joinedDate || 'November 2023'
  });

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState('English (US)');
  const [timeFormat, setTimeFormat] = useState('12-Hour (AM/PM)');

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save to localStorage under bni_logged_captain
    if (loggedInCaptain) {
      const updatedCaptain = { ...loggedInCaptain, ...profileData };
      localStorage.setItem('bni_logged_captain', JSON.stringify(updatedCaptain));
    }
  };

  const displayInitials = profileData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-955 tracking-tight">Profile &amp; Settings</h1>
        <p className="text-xs text-zinc-500 font-semibold mt-1">Manage your account information, conclave role, and system preferences.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column (35% -> col-span-4) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">

          {/* Profile Hero Card */}
          <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-zinc-55 border-2 border-brand-red/20 shadow-md flex items-center justify-center font-black text-2xl text-zinc-650 select-none">
                  {displayInitials}
                </div>
                <span className="absolute bottom-0 right-0 bg-brand-red text-white p-1 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 fill-current text-white stroke-[2.5]" />
                </span>
              </div>

              <h2 className="text-lg font-black text-zinc-900 leading-tight">{profileData.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 bg-red-50 border border-red-100 text-brand-red text-[9px] font-black rounded-full uppercase tracking-wider">
                  Table Captain
                </span>
              </div>

              <p className="text-[12px] text-zinc-500 font-semibold mt-2.5 leading-snug">
                {profileData.category} at <strong className="text-zinc-800 font-bold">{profileData.company}</strong>
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mt-6 py-2">
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Captain ID</p>
                  <p className="font-black text-zinc-800 text-[12.5px] mt-0.5">{loggedInCaptain?.bniId || loggedInCaptain?.id || 'BNI-CAPT-01'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Table</p>
                  <p className="font-black text-zinc-800 text-[12.5px] mt-0.5">
                    {loggedInCaptain?.tableId?.toLowerCase().startsWith('table') ? loggedInCaptain?.tableId : `Table ${loggedInCaptain?.tableId || '5'}`}
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 w-full mt-5">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="flex-grow py-2 px-3 bg-brand-red hover:bg-red-750 text-white text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-brand-red/10"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-grow py-2 px-3 bg-brand-red hover:bg-red-750 text-white text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-brand-red/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Networking Summary KPIs */}
          <section className="grid grid-cols-2 gap-3">
            {[
              { label: "Verified Seating", value: "8 / 8" },
              { label: "Total Rounds", value: 6 },
              { label: "Members met", value: 48 },
              { label: "Conflicts Resolved", value: 0 }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 p-4 rounded-xl shadow-2xs">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-lg font-black text-brand-red mt-1 leading-none">{kpi.value}</p>
              </div>
            ))}
          </section>

          {/* Logout Card */}
          <button
            onClick={() => onLogout && onLogout()}
            className="w-full flex items-center gap-3 p-4 bg-white border border-zinc-200 rounded-xl hover:bg-red-50/50 transition-colors text-brand-red text-[12px] font-black uppercase tracking-wider justify-center cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </aside>

        {/* Right Column (65% -> col-span-8) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Personal Information */}
          <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs">
            <div className="p-4 flex justify-between items-center bg-zinc-50 rounded-t-xl">
              <h2 className="text-body-md font-black text-zinc-900 leading-tight">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-zinc-450 hover:text-brand-red transition-smooth cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Email Address", key: "email", type: "email" },
                { label: "Phone Number", key: "phone", type: "text" },
                { label: "Designation", key: "designation", type: "text" },
                { label: "Company", key: "company", type: "text" },
                { label: "Business Category", key: "category", type: "text" },
                { label: "BNI Chapter", key: "chapter", type: "text", disabled: true },
                { label: "Joined Date", key: "registrationDate", type: "text", disabled: true }
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-[9.5px] font-black text-zinc-400 uppercase tracking-wider mb-1.5">{field.label}</label>
                  {isEditing && !field.disabled ? (
                    <input
                      type={field.type}
                      value={profileData[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full h-10 px-3 border border-zinc-250 rounded-lg text-body-sm font-semibold text-zinc-800 placeholder-zinc-400 focus:ring-1 focus:ring-brand-red focus:border-brand-red focus:outline-hidden"
                    />
                  ) : (
                    <p className="text-body-sm font-bold text-zinc-800 leading-tight">{profileData[field.key]}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Two Column Settings & Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Account Preferences */}
            <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs flex flex-col justify-between">
              <div>
                <div className="p-4 bg-zinc-50 rounded-t-xl">
                  <h2 className="text-body-sm font-black text-zinc-900 leading-tight">Account Preferences</h2>
                </div>

                <div className="p-5 space-y-4.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-black text-zinc-800 leading-none">Email Notifications</p>
                      <p className="text-[10px] text-zinc-450 font-semibold mt-1">Summaries &amp; Updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-focus:ring-0 dark:bg-zinc-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-red"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-black text-zinc-800 leading-none">Push Notifications</p>
                      <p className="text-[10px] text-zinc-455 font-semibold mt-1">Real-time alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-focus:ring-0 dark:bg-zinc-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-red"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[9.5px] font-black text-zinc-400 uppercase tracking-wider mb-1">Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full h-9 bg-zinc-50 border border-zinc-200 rounded px-2 text-[11px] font-semibold text-zinc-750 focus:ring-1 focus:ring-brand-red focus:border-brand-red outline-hidden"
                      >
                        <option>English (US)</option>
                        <option>Hindi</option>
                        <option>Telugu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-black text-zinc-400 uppercase tracking-wider mb-1">Time Format</label>
                      <select
                        value={timeFormat}
                        onChange={(e) => setTimeFormat(e.target.value)}
                        className="w-full h-9 bg-zinc-50 border border-zinc-200 rounded px-2 text-[11px] font-semibold text-zinc-755 focus:ring-1 focus:ring-brand-red focus:border-brand-red outline-hidden"
                      >
                        <option>12-Hour (AM/PM)</option>
                        <option>24-Hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Display */}
              <div className="p-4 bg-zinc-50 rounded-b-xl space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-450">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-[8.5px] font-black uppercase tracking-wider">Security Status</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-500">
                  <span>Last Login</span>
                  <span className="text-zinc-700 font-bold">Today, 08:30 AM</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-500">
                  <span>Active Session</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Singapore
                  </span>
                </div>
              </div>
            </section>

            {/* Recent Activity Timeline */}
            <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs flex flex-col">
              <div className="p-4 bg-zinc-50 rounded-t-xl">
                <h2 className="text-body-sm font-black text-zinc-900 leading-tight">Recent Activity</h2>
              </div>

              <div className="p-5 flex-grow relative">
                {/* Vertical timeline track line */}
                <div className="absolute left-[27px] top-6 bottom-6 w-px bg-zinc-200 z-0"></div>

                <div className="space-y-5">
                  <div className="flex gap-3 relative z-10">
                    <div className="w-6.5 h-6.5 rounded-full bg-red-50 border-2 border-white text-brand-red flex items-center justify-center shadow-xs shrink-0 select-none">
                      <CheckCircle className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-zinc-800 leading-tight">Schedule Verified</p>
                      <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Table 5 seating assignments confirmed</p>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex gap-3 relative z-10">
                    <div className="w-6.5 h-6.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 flex items-center justify-center shadow-xs shrink-0 select-none">
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-zinc-800 leading-tight">Assigned as Table Captain</p>
                      <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Role: Table Captain assigned by Region Admin</p>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">Yesterday, 4:15 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-3 relative z-10">
                    <div className="w-6.5 h-6.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 flex items-center justify-center shadow-xs shrink-0 select-none">
                      <LogIn className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-zinc-800 leading-tight">New Login Session</p>
                      <p className="text-[10px] text-zinc-450 font-semibold mt-0.5">Desktop Login from Guntur IP: 157.44.XX.X</p>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">Today, 08:30 AM</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-5 text-[10px] font-black text-brand-red uppercase tracking-wider hover:underline text-center">
                  View All Activity
                </button>
              </div>
            </section>

          </div>

        </div>
      </div>

    </div>
  );
}
