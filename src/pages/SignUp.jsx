import React, { useState } from 'react';
import { Award, User, Mail, Lock, Phone, Building2, Layers, MapPin, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp({ onSwitchToLogin, onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    category: '',
    chapter: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.company || !formData.category || !formData.chapter) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const emailLower = formData.email.trim().toLowerCase();

      // 1. Create Firebase Auth Account
      const userCredential = await createUserWithEmailAndPassword(auth, emailLower, formData.password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      // Store auth token
      localStorage.setItem('bni_auth_token', token);
      localStorage.removeItem('bni_logged_captain');
      localStorage.removeItem('bni_logged_member');
      localStorage.removeItem('bni_logged_admin');

      // 2. Call backend API /api/me to store member profile in Firestore
      const defaultBackendUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000/api'
        : 'https://bni-1-2-1-backend.onrender.com/api';
      const apiBase = import.meta.env.VITE_API_URL || defaultBackendUrl;

      const profilePayload = {
        name: formData.name.trim(),
        email: emailLower,
        phone: formData.phone.trim(),
        mobile: formData.phone.trim(),
        company: formData.company.trim(),
        businessName: formData.company.trim(),
        category: formData.category.trim(),
        businessCategory: formData.category.trim(),
        chapter: formData.chapter.trim(),
        role: 'member'
      };

      try {
        await fetch(`${apiBase}/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(profilePayload)
        });
      } catch (backendErr) {
        console.warn("Backend profile save warning:", backendErr);
      }

      const payload = {
        uid: firebaseUser.uid,
        id: firebaseUser.uid,
        ...profilePayload
      };

      setIsLoading(false);
      if (onLogin) {
        onLogin('member', payload);
      }
    } catch (firebaseErr) {
      console.error("Signup error:", firebaseErr);
      setIsLoading(false);
      let userMsg = 'Failed to create account. Please try again.';
      if (firebaseErr.code === 'auth/email-already-in-use') {
        userMsg = 'An account with this email already exists. Please login instead.';
      } else if (firebaseErr.code === 'auth/invalid-email') {
        userMsg = 'Please enter a valid email address.';
      } else if (firebaseErr.code === 'auth/weak-password') {
        userMsg = 'Password should be at least 6 characters.';
      }
      setError(userMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red to-red-800 text-white shadow-xl shadow-red-950/50 mb-1 border border-red-500/20">
          <Award className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          BNI Member Registration
        </h1>
        <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto">
          Create your account to register for conclaves, access 1-on-1 networking schedules, and track referrals.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4 sm:px-0">
        <div className="bg-zinc-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-zinc-800/80">
          
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-xs font-semibold flex items-center gap-2.5 animate-shake">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-ping"></div>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="h-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="block w-full pl-10 pr-4 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="h-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="member@bni.com"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Phone / Mobile <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="h-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Company & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Building2 className="h-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Tech Ltd"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Business Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Layers className="h-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="IT / Real Estate / Legal"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>
              </div>
            </div>

            {/* BNI Chapter */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                BNI Chapter Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <MapPin className="h-4 h-4" />
                </div>
                <input
                  type="text"
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleChange}
                  placeholder="e.g. BNI Guntur Titans"
                  required
                  className="block w-full pl-10 pr-4 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="h-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                  className="block w-full pl-10 pr-10 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 h-4" /> : <Eye className="h-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-brand-red to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950/40 hover:shadow-red-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Member Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login Link */}
          <div className="mt-6 pt-5 border-t border-zinc-800/60 text-center">
            <p className="text-xs text-zinc-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-brand-red hover:text-red-400 font-bold hover:underline ml-1 cursor-pointer transition-colors"
              >
                Sign In Here
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
