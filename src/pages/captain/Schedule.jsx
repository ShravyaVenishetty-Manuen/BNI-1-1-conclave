import React from 'react';
import { Check, Play, ArrowRight, Award, Shield, PhoneCall, BookOpen } from 'lucide-react';

export default function CaptainSchedule({ loggedInCaptain }) {
  const scheduleItems = [
    {
      id: 'item-1',
      time: '09:00 AM - 09:30 AM',
      title: 'Breakfast & General Networking',
      desc: 'Informal morning meet-and-greet in the Main Reception Hall. Buffet breakfast served.',
      status: 'completed'
    },
    {
      id: 'item-2',
      time: '09:30 AM - 10:00 AM',
      title: 'Opening Ceremony & Keynote Address',
      desc: 'Welcoming address from BNI Regional Directors and annual progress presentation.',
      status: 'completed'
    },
    {
      id: 'item-3',
      time: '10:00 AM - 10:45 AM',
      title: 'Round 3: Business Networking (1-to-1)',
      desc: 'Active round. Captains validate station seating check-in. Presentations restricted to 2 minutes.',
      status: 'active'
    },
    {
      id: 'item-4',
      time: '10:45 AM - 11:00 AM',
      title: 'Networking Coffee Break',
      desc: 'Quick refreshment pause. Participants migrate to next tables.',
      status: 'upcoming'
    },
    {
      id: 'item-5',
      time: '11:00 AM - 11:45 AM',
      title: 'Round 4: Business Networking (1-to-1)',
      desc: 'Next structured pairing session matching synergetic categories.',
      status: 'upcoming'
    },
    {
      id: 'item-6',
      time: '11:45 AM - 12:30 PM',
      title: 'Round 5: Business Networking (1-to-1)',
      desc: 'Final structured matching before noon updates.',
      status: 'upcoming'
    },
    {
      id: 'item-7',
      time: '12:30 PM - 01:30 PM',
      title: 'Lunch & Keynote Panel',
      desc: 'Catered lunch accompanied by panel discussions on business development trends.',
      status: 'upcoming'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-zinc-955 tracking-tight">Round Schedule</h1>
          <p className="text-xs text-zinc-450 font-semibold mt-0.5">
            Full schedule and timeline of the business conclave sessions.
          </p>
        </div>
        
        <div className="flex gap-2">
          <span className="bg-red-50 text-brand-red px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border border-red-100 shadow-2xs">
            Round 3 Active
          </span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Timeline with Cards */}
        <div className="lg:col-span-8 relative py-4 px-2">
          {/* Continuous timeline vertical track line */}
          <div className="absolute top-4 bottom-4 left-[19px] w-[1.5px] bg-zinc-200 z-0"></div>

          <div className="space-y-6 relative z-10">
            {scheduleItems.map((item) => {
              const isCompleted = item.status === 'completed';
              const isActive = item.status === 'active';

              return (
                <div key={item.id} className={`flex gap-5 items-start ${!isActive && !isCompleted ? 'opacity-70' : ''}`}>
                  
                  {/* Status Indicator circle (vertically aligned with card top) */}
                  <div className="shrink-0 flex items-center justify-center w-6 h-6 relative mt-5">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center shadow-xs z-10 border border-zinc-50">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    ) : isActive ? (
                      <div className="w-5.5 h-5.5 rounded-full bg-brand-red text-white flex items-center justify-center shadow-md shadow-brand-red/15 border-2 border-white ring-4 ring-red-100 z-10 animate-pulse">
                        <Play className="w-2 h-2 fill-current ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full bg-white border border-zinc-250 flex items-center justify-center z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-350"></div>
                      </div>
                    )}
                  </div>

                  {/* Standalone card block */}
                  <div className={`flex-1 p-5 rounded-xl border bg-white shadow-2xs hover:border-zinc-300 transition-smooth ${
                    isActive 
                      ? 'border-zinc-250 shadow-xs ring-1 ring-zinc-150' 
                      : 'border-zinc-200/60'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <span className={`text-[9.5px] font-black uppercase tracking-wider ${
                        isActive ? 'text-brand-red' : 'text-zinc-400'
                      }`}>
                        {item.time}
                      </span>
                      {isActive && (
                        <span className="self-start sm:self-auto bg-brand-red text-white px-2 py-0.5 rounded-[4px] text-[7.5px] font-black uppercase tracking-wider leading-none">
                          Active Now
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`text-[12.5px] font-black leading-snug ${
                      isActive ? 'text-zinc-955' : 'text-zinc-800'
                    }`}>
                      {item.title}
                    </h3>
                    
                    <p className="text-[11px] text-zinc-450 font-semibold leading-relaxed mt-1">
                      {item.desc}
                    </p>

                    {isActive && (
                      <div className="mt-4 pt-3.5 border-t border-zinc-200 flex items-center justify-between text-[9.5px] font-extrabold text-brand-red">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>{loggedInCaptain.tableId?.toLowerCase().startsWith('table') ? loggedInCaptain.tableId : `Table ${loggedInCaptain.tableId || '5'}`} Seating Locked</span>
                        </div>
                        <span className="flex items-center gap-0.5 font-black hover:underline cursor-pointer">
                          Track Details
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sidebar Info Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Conclave Guidelines Card */}
          <div className="bg-white border border-zinc-200/60 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-body-sm font-black text-zinc-950 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <BookOpen className="w-4.5 h-4.5 text-brand-red" />
              Guidelines
            </h3>
            
            <ul className="space-y-3 text-[11px] text-zinc-500 font-semibold leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0 mt-1.5"></span>
                <span>Each participant is allocated exactly 2 minutes for introductions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0 mt-1.5"></span>
                <span>Ensure members scan the table QR code to confirm attendance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0 mt-1.5"></span>
                <span>Referral and 1-to-1 requests must be logged through the portal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0 mt-1.5"></span>
                <span>Migrate quickly when the coffee break signal rings.</span>
              </li>
            </ul>
          </div>

          {/* Captain Support Helpdesk Card */}
          <div className="bg-zinc-950 border border-zinc-800 text-white rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">Support Portal</span>
              <h3 className="text-body-sm font-black text-white mt-1.5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-red" />
                Table Captain Assistance
              </h3>
            </div>
            
            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
              Encountering attendance discrepancies or hardware login issues? Contact the coordinator desk immediately.
            </p>

            <div className="pt-2">
              <a 
                href="tel:+1234567890" 
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 transition-smooth border border-white/15 rounded-lg text-[9.5px] font-black uppercase tracking-wider text-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call Helpdesk
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
