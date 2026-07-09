import React, { useState } from 'react';
import { Award, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, Server } from 'lucide-react';

const MOCK_CAPTAINS = [
  {
    id: "BNI-CAPT-01",
    name: "Amit Patel",
    email: "amit@bni.com",
    mobile: "9876543210",
    password: "password",
    tableId: "Table 01",
    chapter: "Peak Performance",
    category: "Financial Services"
  },
  {
    id: "BNI-CAPT-02",
    name: "Shreya Acharya",
    email: "shreya@bni.com",
    mobile: "9876543211",
    password: "password",
    tableId: "Table 02",
    chapter: "Apex Chapter",
    category: "Marketing"
  },
  {
    id: "BNI-CAPT-03",
    name: "Manish Trivedi",
    email: "m.trivedi@alliance.com",
    mobile: "9876543212",
    password: "password",
    tableId: "Table 03",
    chapter: "Peak Performance",
    category: "Financial Consultancy"
  },
  {
    id: "BNI-CAPT-04",
    name: "Esha Rao",
    email: "esha.rao@metrorealty.com",
    mobile: "9876543213",
    password: "password",
    tableId: "Table 04",
    chapter: "Apex Chapter",
    category: "Real Estate"
  }
];

export default function Login({ onLogin }) {
  const [role, setRole] = useState('admin'); // 'admin' or 'captain'
  const [inputVal, setInputVal] = useState('admin@bni.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!inputVal || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Mock API request delay
    setTimeout(() => {
      setIsLoading(false);
      
      if (role === 'admin') {
        if (inputVal.toLowerCase() === 'admin@bni.com' && password === 'password') {
          onLogin && onLogin('admin', null);
        } else {
          setError('Invalid administrator credentials.');
        }
      } else {
        // Captain Login: email or mobile check
        const captain = MOCK_CAPTAINS.find(
          c => (c.email.toLowerCase() === inputVal.toLowerCase() || c.mobile === inputVal) && c.password === password
        );
        if (captain) {
          onLogin && onLogin('captain', captain);
        } else {
          setError('Invalid Captain credentials. Use amit@bni.com / 9876543210 and "password".');
        }
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 flex items-stretch font-sans overflow-hidden">
      
      {/* Left side: Premium branding & stats panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 relative flex-col justify-between p-12 overflow-hidden select-none">
        {/* Decorative background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Top brand logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wider leading-none">
              {role === 'admin' ? 'BNI ADMIN' : 'BNI CAPTAIN'}
            </h1>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
              {role === 'admin' ? 'Conclave Seating Seeding Portal' : 'Table Attendance Check-in Portal'}
            </p>
          </div>
        </div>

        {/* Center decorative content: Seating Algorithm highlights */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Seating Optimizer V2.1
          </div>
          
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            {role === 'admin' 
              ? 'High-Performance Networking Seating Assignments.' 
              : 'Effortless Attendance Log & Collision Management.'}
          </h2>
          
          <p className="text-zinc-400 text-body-md font-medium leading-relaxed">
            {role === 'admin'
              ? 'Validate constraints, manage chapter captains, and seed networking pairings using our multi-round optimization engine.'
              : 'Captains can quickly check-in table attendees, verify business category conflicts, and synchronize round status directly with the admin dashboard.'}
          </p>

          {/* Micro stat overlays */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block">Accuracy</span>
              <span className="text-display-sm text-white font-extrabold block mt-1">99.8%</span>
              <span className="text-[9px] text-emerald-500 font-semibold mt-1 block">Collision Free</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block">Capacity</span>
              <span className="text-display-sm text-white font-extrabold block mt-1">40k+</span>
              <span className="text-[9px] text-zinc-400 font-semibold mt-1 block">Members Managed</span>
            </div>
          </div>
        </div>

        {/* Bottom footer note */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-zinc-500 font-semibold border-t border-white/[0.06] pt-6">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5" />
            <span>Server cluster node: AP-SOUTH-1</span>
          </div>
          <span>&copy; 2026 BNI Global LLC.</span>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-brand-red/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-red-900/10 blur-[120px] pointer-events-none"></div>
      </div>

      {/* Right side: Modern Form login wrapper */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-white relative">
        {/* Floating circles on right (ambient visual flair) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="w-full max-w-sm space-y-6 relative z-10">
          {/* Form Header */}
          <div className="space-y-2">
            {/* Show logo icon on mobile instead */}
            <div className="lg:hidden w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center mb-6">
              <Award className="w-5 h-5 text-white" />
            </div>
            
            <h3 className="text-2xl font-black text-zinc-950 tracking-tight">Portal Login</h3>
            <p className="text-body-md text-zinc-500 font-medium">
              Select your role below and enter credentials.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex border-b border-zinc-150">
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setInputVal('admin@bni.com');
                setError('');
              }}
              className={`flex-1 pb-3 text-[11px] font-black uppercase tracking-wider transition-smooth cursor-pointer ${
                role === 'admin'
                  ? 'border-b-2 border-brand-red text-brand-red font-black'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Admin Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('captain');
                setInputVal('amit@bni.com');
                setError('');
              }}
              className={`flex-1 pb-3 text-[11px] font-black uppercase tracking-wider transition-smooth cursor-pointer ${
                role === 'captain'
                  ? 'border-b-2 border-brand-red text-brand-red font-black'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Captain Portal
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-brand-red text-body-sm font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                {error}
              </div>
            )}

            {/* Email/Mobile Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-450 font-extrabold uppercase tracking-widest" htmlFor="email-input">
                {role === 'admin' ? 'Email Address' : 'Email or Mobile Number'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  id="email-input"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={isLoading}
                  placeholder={role === 'admin' ? 'admin@bni.com' : '9876543210 or amit@bni.com'}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-body-md font-semibold outline-none focus:border-zinc-800 transition-smooth placeholder-zinc-400 text-zinc-900"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-450 font-extrabold uppercase tracking-widest" htmlFor="password-input">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[10px] text-zinc-450 hover:text-zinc-900 font-extrabold uppercase tracking-wider cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-zinc-200 rounded-lg text-body-md font-semibold outline-none focus:border-zinc-800 transition-smooth placeholder-zinc-400 text-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-zinc-300 text-brand-red focus:ring-brand-red outline-none"
                />
                <span className="text-body-sm font-semibold text-zinc-600">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Sign-in Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-red hover:bg-red-700 text-white py-2.5 rounded-lg text-button font-bold transition-smooth shadow-md shadow-brand-red/10 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Terms Footer */}
          <p className="text-[10px] text-zinc-450 text-center leading-relaxed font-semibold pt-4">
            This workspace is monitored for administrative compliance. Unauthorized connection attempts are logged.
          </p>
        </div>
      </div>

    </div>
  );
}
