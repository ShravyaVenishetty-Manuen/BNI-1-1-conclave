import React, { useState, useEffect } from 'react';
import {
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  PlusCircle,
  Search,
  X,
  FileText,
  CheckCircle2
} from 'lucide-react';
import membersData from '../data/members.json';
import captainsData from '../data/captains.json';

export default function Referrals({ loggedInUser, userType }) {
  const [referrals, setReferrals] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('received'); // 'received' or 'sent'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form states
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [referralType, setReferralType] = useState('Inside');
  const [description, setDescription] = useState('');

  // Load referrals on mount
  useEffect(() => {
    const stored = localStorage.getItem('bni_referrals');
    if (stored) {
      setReferrals(JSON.parse(stored));
    }
  }, []);

  if (!loggedInUser) {
    return (
      <div className="p-8 text-center text-zinc-500 font-semibold bg-white rounded-xl border border-zinc-200">
        Loading user session...
      </div>
    );
  }

  // Filter members and captains as potential recipients
  const allPartners = [
    ...membersData.map(m => ({ ...m, isCaptain: false })),
    ...captainsData.map(c => ({ ...c, isCaptain: true }))
  ].filter(p => p.id !== loggedInUser?.id);

  const filteredPartners = allPartners.filter(p =>
    p.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(recipientSearch.toLowerCase()))
  );

  // Calculate statistics
  const givenReferrals = referrals.filter(r => r.fromMemberId === loggedInUser?.id);
  const receivedReferrals = referrals.filter(r => r.toMemberId === loggedInUser?.id);
  const connectedCount = referrals.filter(
    r => (r.fromMemberId === loggedInUser?.id || r.toMemberId === loggedInUser?.id) &&
      (r.status === 'Connected' || r.status === 'Closed')
  ).length;

  const currentList = activeSubTab === 'received' ? receivedReferrals : givenReferrals;

  const handleSendReferral = (e) => {
    e.preventDefault();
    if (!selectedRecipient) {
      setToast({ type: 'error', message: 'Please select a recipient' });
      return;
    }
    if (!description.trim()) {
      setToast({ type: 'error', message: 'Please enter a description' });
      return;
    }

    const newReferral = {
      id: `REF-${Date.now()}`,
      fromMemberId: loggedInUser?.id,
      fromName: loggedInUser?.name,
      toMemberId: selectedRecipient.id,
      toName: selectedRecipient.name,
      referralType: referralType,
      description: description,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedList = [newReferral, ...referrals];
    setReferrals(updatedList);
    localStorage.setItem('bni_referrals', JSON.stringify(updatedList));

    // Show toast and reset form
    setToast({ type: 'success', message: `Referral sent successfully to ${selectedRecipient.name}!` });
    setIsModalOpen(false);
    setSelectedRecipient(null);
    setRecipientSearch('');
    setDescription('');
    setReferralType('Inside');

    // Trigger local storage storage event for page updates
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans pb-10">

      {/* Header section with Send Referral button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[20px] font-black text-zinc-955 leading-tight">Referral Exchange</h2>
          <p className="text-[11.5px] text-zinc-500 font-semibold mt-0.5">Track your business referrals inside the conclave network. Send referrals directly from table member cards.</p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
          <p className="text-[11px] font-bold text-zinc-450 uppercase tracking-wide">Referrals Given</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-zinc-900 leading-none">
              {givenReferrals.length} <span className="text-zinc-400 text-xs font-semibold">Sent</span>
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
          <p className="text-[11px] font-bold text-zinc-450 uppercase tracking-wide">Referrals Received</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-zinc-900 leading-none">
              {receivedReferrals.length} <span className="text-zinc-400 text-xs font-semibold">Taken</span>
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col justify-between h-24">
          <p className="text-[11px] font-bold text-zinc-450 uppercase tracking-wide">Connected / Closed</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-zinc-900 leading-none">
              {connectedCount} <span className="text-zinc-400 text-xs font-semibold">Successful</span>
            </span>
            <span className="p-2 bg-zinc-50 text-zinc-650 rounded-lg border border-zinc-200">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sub-Tabs */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-3xs overflow-hidden">

        {/* Sub-tab selection bar */}
        <div className="flex border-b border-zinc-200 px-5">
          <button
            onClick={() => setActiveSubTab('received')}
            className={`py-3.5 text-[12px] font-black uppercase tracking-wider relative cursor-pointer mr-6 transition-smooth ${activeSubTab === 'received' ? 'text-brand-red border-b-2 border-brand-red' : 'text-zinc-450 hover:text-zinc-800'
              }`}
          >
            Received Referrals ({receivedReferrals.length})
          </button>
          <button
            onClick={() => setActiveSubTab('sent')}
            className={`py-3.5 text-[12px] font-black uppercase tracking-wider relative cursor-pointer transition-smooth ${activeSubTab === 'sent' ? 'text-brand-red border-b-2 border-brand-red' : 'text-zinc-450 hover:text-zinc-800'
              }`}
          >
            Sent Referrals ({givenReferrals.length})
          </button>
        </div>

        {/* Referrals list */}
        <div className="p-5">
          {currentList.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[12.5px] font-black text-zinc-800">No referral slips found</p>
                <p className="text-[10.5px] text-zinc-450 font-semibold mt-1">
                  {activeSubTab === 'received'
                    ? "You haven't received any referral slips yet."
                    : "You haven't sent any referral slips yet."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentList.map(ref => (
                <div
                  key={ref.id}
                  className="p-4 border border-zinc-200 bg-zinc-50/20 hover:bg-zinc-50/60 rounded-xl transition-all shadow-3xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Sender/Recipient and Type */}
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-zinc-100 text-zinc-700 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-3xs">
                          {activeSubTab === 'received' ? ref.fromName.split(' ').map(n => n[0]).join('') : ref.toName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-zinc-850">
                            {activeSubTab === 'received' ? `From: ${ref.fromName}` : `To: ${ref.toName}`}
                          </p>
                          <span className="text-[8.5px] text-zinc-400 font-extrabold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                            <Calendar className="w-2.5 h-2.5" /> {ref.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Message */}
                    <p className="text-[11.5px] font-semibold text-zinc-650 leading-relaxed italic">
                      "{ref.description}"
                    </p>
                  </div>

                  {/* Bottom: Status Action / Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100/50">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                      SLIP ID: {ref.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider border ${ref.status === 'Connected'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                        : ref.status === 'Closed'
                          ? 'bg-zinc-100 text-zinc-600 border-zinc-200'
                          : 'bg-amber-50 text-amber-700 border-amber-150'
                      }`}>
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send Referral Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-250 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-scale-up">

            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-150 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <Send className="w-4.5 h-4.5 text-brand-red" />
                <h3 className="text-body-md font-black text-zinc-950 uppercase tracking-wide">Send Referral Slip</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-700 transition-smooth cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendReferral} className="p-5 space-y-4">

              {/* Recipient Selection */}
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">BNI Recipient</label>

                {selectedRecipient ? (
                  <div className="p-2.5 border border-brand-red bg-red-50/5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-brand-red text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                        {selectedRecipient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[11.5px] font-extrabold text-zinc-900 leading-none">{selectedRecipient.name}</p>
                        <p className="text-[9px] text-zinc-450 font-bold mt-0.5">{selectedRecipient.category} ({selectedRecipient.chapter})</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRecipient(null)}
                      className="text-[9px] font-extrabold text-brand-red hover:underline uppercase tracking-wider cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        value={recipientSearch}
                        onChange={(e) => {
                          setRecipientSearch(e.target.value);
                          setShowRecipientDropdown(true);
                        }}
                        onFocus={() => setShowRecipientDropdown(true)}
                        placeholder="Search BNI member or category..."
                        className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-750 focus:outline-none focus:border-brand-red/50 focus:ring-2 focus:ring-brand-red/10 transition-smooth placeholder-zinc-400 bg-zinc-50/30"
                      />
                    </div>

                    {showRecipientDropdown && recipientSearch.trim() && (
                      <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto border border-zinc-200 bg-white rounded-lg shadow-xl z-20 divide-y divide-zinc-50">
                        {filteredPartners.length === 0 ? (
                          <p className="p-3 text-center text-[10.5px] text-zinc-400 font-semibold">No members found.</p>
                        ) : (
                          filteredPartners.map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setSelectedRecipient(p);
                                setShowRecipientDropdown(false);
                              }}
                              className="w-full text-left p-2.5 hover:bg-zinc-50 flex items-center gap-2 transition-smooth cursor-pointer"
                            >
                              <div className="w-6 h-6 bg-zinc-100 text-zinc-650 rounded-full flex items-center justify-center text-[8.5px] font-bold">
                                {p.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-[11.5px] font-bold text-zinc-800 leading-none">{p.name}</p>
                                <p className="text-[9px] text-zinc-450 mt-0.5">{p.category} • {p.chapter} ({p.isCaptain ? 'Captain' : 'Member'})</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Referral Type Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Referral Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReferralType('Inside')}
                    className={`py-2 px-3 text-[11px] font-bold rounded-lg border transition-smooth cursor-pointer ${referralType === 'Inside'
                        ? 'border-brand-red bg-red-50/5 text-brand-red'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-500'
                      }`}
                  >
                    Inside (Direct business)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReferralType('Outside')}
                    className={`py-2 px-3 text-[11px] font-bold rounded-lg border transition-smooth cursor-pointer ${referralType === 'Outside'
                        ? 'border-brand-red bg-red-50/5 text-brand-red'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-500'
                      }`}
                  >
                    Outside (External client)
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Details & Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the referral. What does the client need? How should the member follow up?"
                  rows="3"
                  className="w-full p-3 border border-zinc-200 rounded-lg text-[11.5px] font-semibold text-zinc-750 focus:outline-none focus:border-brand-red/50 focus:ring-2 focus:ring-brand-red/10 transition-smooth placeholder-zinc-450 bg-zinc-50/30 resize-none leading-relaxed"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-lg text-[11.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Referral Slip
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[70] bg-zinc-900 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-xl flex items-center gap-2 border border-zinc-800 animate-slide-up">
          {toast.type === 'success' ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
          )}
          <div>
            <p className="font-bold text-white">{toast.type === 'success' ? 'Success!' : 'Alert'}</p>
            <p className="text-zinc-400 mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-zinc-500 hover:text-white font-extrabold shrink-0 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}
