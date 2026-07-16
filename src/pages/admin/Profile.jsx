import React, { useState } from 'react';
import {
  CheckCircle,
  Check,
  LogOut,
  Edit2,
  LayoutGrid,
  Shield,
  LogIn,
  Save,
  Globe,
  Settings
} from 'lucide-react';

export default function AdminProfile({ loggedInAdmin, role = 'admin', onLogout }) {
  const isSuperadmin = role === 'superadmin';

  // Local editable state for profile info
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: isSuperadmin ? 'Superadmin' : (loggedInAdmin?.name || 'Sanjay Wagle'),
    email: isSuperadmin ? 'superadmin@bni.com' : (loggedInAdmin?.email || 'admin@bni.com'),
    phone: isSuperadmin ? '+91 99999 99999' : (loggedInAdmin?.phone || '+91 98888 77777'),
    designation: isSuperadmin ? 'Global Administrator' : 'Regional Administrator',
    organization: isSuperadmin ? 'BNI Global LLC' : 'BNI India (Guntur Region)',
    region: isSuperadmin ? 'All Regions (Global)' : (loggedInAdmin?.region || 'Guntur Central'),
    joinedDate: isSuperadmin ? 'January 2023' : 'June 2024'
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
    // Write changes back to localStorage
    if (isSuperadmin) {
      // Superadmin profile payload (if desired)
      localStorage.setItem('bni_superadmin_profile', JSON.stringify(profileData));
    } else if (loggedInAdmin) {
      const updatedAdmin = { ...loggedInAdmin, ...profileData };
      localStorage.setItem('bni_logged_admin', JSON.stringify(updatedAdmin));
    }
  };

  const displayInitials = profileData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Role details
  const roleBadge = isSuperadmin ? 'Super Administrator' : 'Regional Administrator';
  const displayId = isSuperadmin ? 'BNI-SYS-0001' : 'BNI-ADM-0042';

  // KPIs
  const kpis = isSuperadmin
    ? [
        { label: "Active Regions", value: 4 },
        { label: "Total Conclaves", value: 24 },
        { label: "Regional Admins", value: 12 },
        { label: "System Uptime", value: "99.9%" }
      ]
    : [
        { label: "Conclaves Coordinated", value: 3 },
        { label: "Active Captains", value: 8 },
        { label: "Table Assignments", value: 40 },
        { label: "Conflicts Resolved", value: 14 }
      ];

  // Activities list
  const activities = isSuperadmin
    ? [
        { title: "Global Sync Completed", desc: "Successfully synchronized databases across Guntur chapters", time: "2 hours ago", success: true },
        { title: "Regional Admin Registered", desc: "Approved administrator Rajesh Mehta (Guntur North)", time: "Yesterday, 2:15 PM", success: false },
        { title: "Database Backup Completed", desc: "Automated incremental backup stored on cloud node", time: "2 days ago", success: false }
      ]
    : [
        { title: "Seating Layout Generated", desc: "Generated matching schedule rounds for Central Meet 2026", time: "1 hour ago", success: true },
        { title: "Table Conflict Inspected", desc: "Checked business conflict alert on Table 4", time: "Yesterday, 4:30 PM", success: false },
        { title: "Assigned Captain Credentials", desc: "Configured Amit Patel as Captain for Table 1", time: "3 days ago", success: false }
      ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in font-sans pb-16">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-955 tracking-tight">System Profile &amp; Settings</h1>
          <p className="text-xs text-zinc-500 font-semibold mt-1">
            {isSuperadmin 
              ? "View global server health status, security credentials, and administration parameters."
              : "Manage your administrative details, regional preferences, and conclave coordination logs."
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column (col-span-4) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">

          {/* Profile Hero Card */}
          <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-zinc-55 border-2 border-brand-red/20 shadow-md flex items-center justify-center font-black text-2xl text-zinc-650 select-none">
                  {displayInitials}
                </div>
                <span className="absolute bottom-0 right-0 bg-brand-red text-white p-1 rounded-full border-2 border-white flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3.5]" />
                </span>
              </div>

              <h2 className="text-lg font-black text-zinc-900 leading-tight">{profileData.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 bg-red-50 border border-red-100 text-brand-red text-[9px] font-black rounded-full uppercase tracking-wider">
                  {roleBadge}
                </span>
              </div>

              <p className="text-[12px] text-zinc-500 font-semibold mt-2.5 leading-snug">
                {profileData.designation} at <strong className="text-zinc-800 font-bold">{profileData.organization}</strong>
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mt-6 py-2">
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Admin ID</p>
                  <p className="font-black text-zinc-800 text-[12.5px] mt-0.5">{displayId}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Joined</p>
                  <p className="font-black text-zinc-800 text-[12.5px] mt-0.5">{profileData.joinedDate}</p>
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

          {/* KPI Toggles */}
          <section className="grid grid-cols-2 gap-3">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 p-4 rounded-xl shadow-2xs">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wider leading-none">{kpi.label}</p>
                <p className="text-lg font-black text-brand-red mt-2.5 leading-none">{kpi.value}</p>
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

        {/* Right Column (col-span-8) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Personal Information */}
          <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs">
            <div className="p-4 flex justify-between items-center bg-zinc-50 rounded-t-xl">
              <h2 className="text-body-md font-black text-zinc-900 leading-tight font-sans font-black">Administrative Information</h2>
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
                { label: "Admin Name", key: "name", type: "text" },
                { label: "Admin Email", key: "email", type: "email" },
                { label: "Mobile Number", key: "phone", type: "text" },
                { label: "Designation Role", key: "designation", type: "text" },
                { label: "Organization Node", key: "organization", type: "text" },
                { label: "Assigned Region / Scope", key: "region", type: "text", disabled: true }
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

          {/* Preferences & Activity Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Admin Preferences */}
            <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs flex flex-col justify-between">
              <div>
                <div className="p-4 bg-zinc-50 rounded-t-xl">
                  <h2 className="text-body-sm font-black text-zinc-900 leading-tight">System Preferences</h2>
                </div>

                <div className="p-5 space-y-4.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-black text-zinc-800 leading-none">Email Notifications</p>
                      <p className="text-[10px] text-zinc-450 font-semibold mt-1">Audit log summaries</p>
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
                      <p className="text-[10px] text-zinc-450 font-semibold mt-1">Conflict alerts &amp; logins</p>
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
                  <span className="text-[8.5px] font-black uppercase tracking-wider">Audit Security Log</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-500">
                  <span>Last Login IP</span>
                  <span className="text-zinc-700 font-bold">122.180.XX.XX</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-500">
                  <span>SSL Cipher Status</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    AES-256 Active
                  </span>
                </div>
              </div>
            </section>

            {/* Admin Audit activity timeline */}
            <section className="bg-white border border-zinc-200 rounded-xl shadow-2xs flex flex-col">
              <div className="p-4 bg-zinc-50 rounded-t-xl">
                <h2 className="text-body-sm font-black text-zinc-900 leading-tight">Admin Action Timeline</h2>
              </div>

              <div className="p-5 flex-grow relative">
                {/* Vertical timeline track line */}
                <div className="absolute left-[27px] top-6 bottom-6 w-px bg-zinc-200 z-0"></div>

                <div className="space-y-5">
                  {activities.map((act, idx) => (
                    <div key={idx} className="flex gap-3 relative z-10">
                      <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center shadow-xs shrink-0 select-none ${
                        act.success 
                          ? 'bg-red-50 border-brand-red text-brand-red'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                      }`}>
                        {act.success ? <CheckCircle className="w-3.5 h-3.5 fill-current" /> : <Settings className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-[12px] font-black text-zinc-800 leading-tight">{act.title}</p>
                        <p className="text-[10px] text-zinc-450 font-semibold mt-0.5 leading-snug">{act.desc}</p>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-5 text-[10px] font-black text-brand-red uppercase tracking-wider hover:underline text-center">
                  View Audit Logs
                </button>
              </div>
            </section>

          </div>

        </div>
      </div>

    </div>
  );
}
