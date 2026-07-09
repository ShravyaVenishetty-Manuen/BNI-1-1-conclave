import React from 'react';
import { User, Award, Shield, Mail, Phone, Building, Briefcase, BookOpen, Star, History } from 'lucide-react';

export default function CaptainProfile({ loggedInCaptain }) {
  // Fallback mocks if fields are missing in loggedInCaptain payload
  const captainDetails = {
    name: loggedInCaptain?.name || 'Ganesh V.',
    email: loggedInCaptain?.email || 'ganesh.v@bni-guntur.in',
    phone: loggedInCaptain?.phone || '+91 98765 43210',
    company: loggedInCaptain?.company || 'Varma & Associates',
    category: loggedInCaptain?.category || 'Financial Consulting',
    chapter: loggedInCaptain?.chapter || 'Phoenix Chapter',
    bniId: loggedInCaptain?.bniId || '#BNI-8842',
    tableId: loggedInCaptain?.tableId || '5',
    joinedDate: 'November 2023',
    rating: '4.95'
  };


  const previousConclaves = [
    {
      name: 'Western Region Connect 2025',
      date: 'September 15, 2025',
      table: 'Table 14',
      role: 'Table Captain',
      stats: '8/8 Seating Verified',
      location: 'Grand Ballroom B'
    },
    {
      name: 'Leadership Meet Q2 2025',
      date: 'May 10, 2025',
      table: 'Table 04',
      role: 'Table Captain',
      stats: '6/6 Seating Verified',
      location: 'Convention Center Room C'
    },
    {
      name: 'Annual Global Summit 2024',
      date: 'November 12-14, 2024',
      table: 'Table 08',
      role: 'Co-Captain',
      stats: '12/12 Seating Verified',
      location: 'V Convention, Guntur'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-zinc-955 tracking-tight">Table Captain Profile</h1>
          <p className="text-xs text-zinc-450 font-semibold mt-0.5">
            View your official BNI Table Captain credentials and conclave activity.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column - Profile Card */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/60 rounded-xl p-6 shadow-2xs text-center flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full border-4 border-red-50 bg-white flex items-center justify-center p-1 shadow-sm">
            <div className="w-full h-full rounded-full bg-brand-red text-white flex items-center justify-center font-black text-2xl select-none">
              {captainDetails.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-zinc-955 leading-tight">{captainDetails.name}</h2>
          </div>

          <div className="w-full border-t border-zinc-100 pt-4 flex flex-col gap-3 text-left">
            <div className="flex items-center gap-3">
              <Building className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Company</p>
                <p className="text-[11.5px] font-extrabold text-zinc-800 mt-1">{captainDetails.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Industry Category</p>
                <p className="text-[11.5px] font-extrabold text-zinc-800 mt-1">{captainDetails.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">BNI Chapter</p>
                <p className="text-[11.5px] font-extrabold text-zinc-800 mt-1">{captainDetails.chapter}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - credentials & details */}
        <div className="lg:col-span-8 space-y-6">

          {/* Contact Details Card */}
          <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-2xs">
            <h3 className="text-body-sm font-black text-zinc-955 border-b border-zinc-100 pb-2.5 mb-4">
              Registered Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-3 p-3 bg-zinc-50/50 border border-zinc-150 rounded-xl">
                <Mail className="w-4.5 h-4.5 text-brand-red shrink-0" />
                <div>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Primary Email</p>
                  <p className="text-[11.5px] font-extrabold text-zinc-800 mt-1.5 select-text">{captainDetails.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-zinc-50/50 border border-zinc-150 rounded-xl">
                <Phone className="w-4.5 h-4.5 text-brand-red shrink-0" />
                <div>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Phone Number</p>
                  <p className="text-[11.5px] font-extrabold text-zinc-800 mt-1.5 select-text">{captainDetails.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Conclaves Card */}
          <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-body-sm font-black text-zinc-955 border-b border-zinc-100 pb-2.5 flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-brand-red" />
              Previous Conclaves History
            </h3>

            <div className="divide-y divide-zinc-150">
              {previousConclaves.map((conclave, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-[12.5px] font-extrabold text-zinc-900 leading-tight">
                      {conclave.name}
                    </h4>
                    <p className="text-[10.5px] text-zinc-450 font-semibold">
                      {conclave.date} • {conclave.location}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-extrabold">
                    <span className="bg-zinc-50 text-zinc-650 px-2 py-0.5 border border-zinc-200 rounded">
                      {conclave.table}
                    </span>
                    <span className="bg-red-50 text-brand-red px-2 py-0.5 border border-red-100 rounded">
                      {conclave.role}
                    </span>
                    <span className="text-emerald-600">
                      {conclave.stats}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="bg-zinc-900 border border-zinc-800 text-white rounded-xl p-5 shadow-sm flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-brand-red">
                <Award className="w-4.5 h-4.5" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Verified Credentials</span>
              </div>
              <h4 className="text-body-sm font-extrabold text-white">BNI Conclave Captain Authority</h4>
              <p className="text-[10px] text-zinc-400 leading-normal max-w-md">
                This account holds official Table Captain administrative status for table management, attendee validation, and schedule reporting at Guntur Conclave 2026.
              </p>
            </div>

            <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-white/10 rounded-full border border-white/10">
              <Star className="w-6 h-6 text-brand-red fill-current" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
