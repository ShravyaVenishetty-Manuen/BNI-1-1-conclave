import React, { useState } from 'react';
import { Award, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, Server, Phone } from 'lucide-react';

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

export default function CaptainLogin({ onLogin }) {
  const [inputVal, setInputVal] = useState('amit@bni.com');
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

    setTimeout(() => {
      setIsLoading(false);
      
      // Check if matches mock captain email or mobile
      const captain = MOCK_CAPTAINS.find(
        c => (c.email.toLowerCase() === inputVal.toLowerCase() || c.mobile === inputVal) && c.password === password
      );

      if (captain) {
        onLogin && onLogin(captain);
      } else {
        setError('Invalid credentials. Try amit@bni.com / 9876543210 and "password".');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 flex items-stretch font-sans overflow-hidden">
      
      {/* Left side: Captain theme design */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 relative flex-col justify-between p-12 overflow-hidden select-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wider leading-none">BNI CAPTAINS</h1>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Table Attendance Portal</p>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Live Seating Optimizer
          </div>
          
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Captain Attendance Log & Seating Verification.
          </h2>
          
          <p className="text-zinc-400 text-body-md font-medium leading-relaxed">
            Quickly check-in members, view category pairings, clear conflicts, and lock round seats directly from your mobile or desktop device.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block">Accuracy</span>
              <span className="text-display-sm text-white font-extrabold block mt-1">99.8%</span>
              <span className="text-[9px] text-emerald-500 font-semibold mt-1 block">Real-time Sync</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block">Control</span>
              <span className="text-display-sm text-white font-extrabold block mt-1">1-Tap</span>
              <span className="text-[9px] text-zinc-400 font-semibold mt-1 block">Check-in Status</span>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-zinc-500 font-semibold border-t border-white/[0.06] pt-6">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5" />
            <span>Server cluster node: AP-SOUTH-1</span>
          </div>
          <span>&copy; 2026 BNI Global LLC.</span>
        </div>

        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-brand-red/10 blur-[100px] pointer-events-none"></div>
      </div>

      {/* Right side: Credentials login panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="w-full max-w-sm space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="lg:hidden w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center mb-6">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-black text-zinc-950 tracking-tight">Captain Login</h3>
            <p className="text-body-md text-zinc-500 font-medium">
              Enter your registered Email or Mobile Number to access your table.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-brand-red text-body-sm font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                {error}
              </div>
            )}

            {/* Email/Mobile field */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-450 font-extrabold uppercase tracking-widest" htmlFor="email-input">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  id="email-input"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={isLoading}
                  placeholder="amit@bni.com or 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-body-md font-semibold outline-none focus:border-zinc-800 transition-smooth placeholder-zinc-400 text-zinc-900"
                />
              </div>
            </div>

            {/* Password field */}
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

            {/* Keep Signed In */}
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

            {/* Sign in button */}
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
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Captain Sign In</span>
                </>
              )}
            </button>
          </form>
          
          <p className="text-[10px] text-zinc-450 text-center leading-relaxed font-semibold pt-4">
            Authorized Table Captain access only. All sessions are logged for security audit purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
