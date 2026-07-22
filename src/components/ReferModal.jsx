import React, { useState } from 'react';
import { Send, X, AlertCircle } from 'lucide-react';
import { addNotification } from '../utils/notifications';
import { api } from '../services/api';

export default function ReferModal({ recipient, loggedInUser, activeConclaveId, onClose, onSuccess }) {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please enter referral lead details.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const fromUid = loggedInUser?.uid || loggedInUser?.id;
    const toUid = recipient?.uid || recipient?.id || recipient?._originalUid;
    const refId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newReferral = {
      id: refId,
      fromUserId: fromUid,
      fromMemberId: fromUid,
      fromName: loggedInUser?.name,
      toUserId: toUid,
      toMemberId: toUid,
      toName: recipient?.name,
      notes: description,
      description: description,
      roundNumber: recipient?.roundNumber || 1,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };

    // 1. Save to local storage backup
    const stored = localStorage.getItem('bni_referrals');
    const referrals = stored ? JSON.parse(stored) : [];
    const updatedList = [newReferral, ...referrals];
    localStorage.setItem('bni_referrals', JSON.stringify(updatedList));

    // 2. Submit to backend API if active conclave ID is present
    if (activeConclaveId) {
      try {
        await api.post(`/conclaves/${activeConclaveId}/sync`, {
          referrals: [{
            id: refId,
            fromUserId: fromUid,
            toUserId: toUid,
            roundNumber: recipient?.roundNumber || 1,
            notes: description,
            timestamp: new Date().toISOString()
          }]
        });
      } catch (err) {
        console.warn("Backend sync failed for referral (stored locally):", err.message);
      }
    }

    // Push local notification & trigger storage event
    addNotification('Referral Sent', `Submitted referral lead slip for ${recipient.name}.`, 'success');
    window.dispatchEvent(new Event('storage'));

    setIsSubmitting(false);
    if (onSuccess) {
      onSuccess(`Referral slip submitted for ${recipient.name}!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/45 z-[100] flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white border border-zinc-250 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-scale-up text-left">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-150 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-brand-red" />
            <h3 className="text-[12px] font-black text-zinc-955 uppercase tracking-wide">Send Referral Slip</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-700 transition-smooth cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-sans">
          
          {/* Recipient card summary (pre-filled & locked) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">BNI Recipient (Locked)</label>
            <div className="p-3 border border-zinc-200 bg-zinc-50/50 rounded-lg flex items-center gap-2.5">
              <div className="w-8 h-8 bg-brand-red/10 text-brand-red rounded-lg flex items-center justify-center text-xs font-black select-none">
                {recipient.initials || recipient.avatar || recipient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="text-[11.5px] font-extrabold text-zinc-900 leading-none">{recipient.name}</p>
                <p className="text-[9.5px] text-zinc-500 font-bold mt-1 truncate">
                  {recipient.category} • {recipient.company}
                </p>
              </div>
            </div>
          </div>

          {/* Details / Lead Info */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Lead Opportunity Details</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError('');
              }}
              placeholder="E.g., I have a client looking to redesign their office space, please contact their admin at contact@email.com."
              rows="3"
              className="w-full p-3 border border-zinc-200 rounded-lg text-[11.5px] font-semibold text-zinc-750 focus:outline-none focus:border-brand-red/50 focus:ring-2 focus:ring-brand-red/10 transition-smooth placeholder-zinc-450 bg-zinc-50/30 resize-none leading-relaxed"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-brand-red text-[10.5px] font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-lg text-[11.5px] font-black uppercase tracking-wider transition-smooth cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Referral
          </button>

        </form>
      </div>
    </div>
  );
}
