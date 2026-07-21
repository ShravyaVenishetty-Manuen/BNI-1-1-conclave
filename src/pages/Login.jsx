import React, { useState } from 'react';
import { Award, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('admin'); // 'admin', 'captain', or 'member'
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

    const emailLower = inputVal.toLowerCase();

    // Enforce real Firebase Auth login only
    signInWithEmailAndPassword(auth, emailLower, password)
      .then(async (userCredential) => {
        const firebaseUser = userCredential.user;
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('bni_auth_token', token);
        
        let payload = { uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || firebaseUser.email.split('@')[0] };
        if (role === 'admin') {
          payload.region = "Guntur Central";
        } else if (role === 'captain') {
          payload.tableId = "Table 01";
          payload.chapter = "Peak Performance";
          payload.category = "Financial Services";
        }

        setIsLoading(false);
        onLogin && onLogin(role, payload);
      })
      .catch((firebaseErr) => {
        setIsLoading(false);
        console.error("Firebase Auth failed:", firebaseErr.message);
        
        if (firebaseErr.code === 'auth/invalid-credential' || firebaseErr.code === 'auth/user-not-found' || firebaseErr.code === 'auth/wrong-password') {
          setError('Invalid email or password.');
        } else if (firebaseErr.code === 'auth/api-key-not-valid') {
          setError('Firebase API Key is invalid or unconfigured. Please check your .env configuration.');
        } else {
          setError(firebaseErr.message);
        }
      });
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
              {role === 'admin' ? 'BNI ADMIN' : role === 'captain' ? 'BNI CAPTAIN' : 'BNI MEMBER'}
            </h1>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
              {role === 'admin' ? 'Conclave Seating Seeding Portal' : role === 'captain' ? 'Table Attendance Check-in Portal' : 'Conclave Member Portal'}
            </p>
          </div>
        </div>

        {/* Ambient content highlights */}
        <div className="relative z-10 space-y-6 max-w-md my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-brand-red tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            BNI Guntur Chapter
          </div>
          
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            {role === 'admin' 
              ? 'High-Performance Networking Seating Assignments.' 
              : role === 'captain'
              ? 'Effortless Attendance Log & Collision Management.'
              : 'Track Your Seating & Connect with Table Members.'}
          </h2>
          
          <p className="text-zinc-400 text-body-md font-medium leading-relaxed">
            {role === 'admin'
              ? 'Validate constraints, manage chapter captains, and seed networking pairings using our multi-round optimization engine.'
              : role === 'captain'
              ? 'Captains can quickly check-in table attendees, verify business category conflicts, and synchronize round status directly with the admin dashboard.'
              : 'View co-attendees category tags, browse all 6 seating round locations, and track discussion focus timers in real-time.'}
          </p>
        </div>

        {/* Brand footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-550 font-bold tracking-tight border-t border-zinc-800 pt-5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
            
            <h3 className="text-2xl font-black text-zinc-955 tracking-tight">Portal Login</h3>
            <p className="text-body-md text-zinc-500 font-medium">
              Select your role below and enter credentials.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex border-b border-zinc-200">
            <button
              type="button"
              onClick={() => {
                setRole('superadmin');
                setInputVal('superadmin@bni.com');
                setError('');
              }}
              className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-wider transition-smooth cursor-pointer ${
                role === 'superadmin'
                  ? 'border-b-2 border-brand-red text-brand-red font-black'
                  : 'text-zinc-400 hover:text-zinc-755'
              }`}
            >
              Superadmin
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setInputVal('admin@bni.com');
                setError('');
              }}
              className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-wider transition-smooth cursor-pointer ${
                role === 'admin'
                  ? 'border-b-2 border-brand-red text-brand-red font-black'
                  : 'text-zinc-400 hover:text-zinc-755'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('captain');
                setInputVal('amit@bni.com');
                setError('');
              }}
              className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-wider transition-smooth cursor-pointer ${
                role === 'captain'
                  ? 'border-b-2 border-brand-red text-brand-red font-black'
                  : 'text-zinc-400 hover:text-zinc-755'
              }`}
            >
              Captain
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('member');
                setInputVal('anjali.s@sharmaads.in');
                setError('');
              }}
              className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-wider transition-smooth cursor-pointer ${
                role === 'member'
                  ? 'border-b-2 border-brand-red text-brand-red font-black'
                  : 'text-zinc-400 hover:text-zinc-755'
              }`}
            >
              Member
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
                  placeholder={role === 'admin' ? 'admin@bni.com' : 'amit@bni.com or anjali.s@sharmaads.in'}
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
