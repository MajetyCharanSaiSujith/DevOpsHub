'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getSupabaseConfig, saveCustomSupabaseConfig } from '@/lib/supabase';
import {
  Terminal,
  Lock,
  Mail,
  User,
  Shield,
  ArrowRight,
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const { login, signup, loginAsDemo } = useApp();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('DevOps Engineer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cloud credentials drawer toggle
  const [showConfig, setShowConfig] = useState(false);
  const config = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(config.url || '');
  const [supabaseKey, setSupabaseKey] = useState(config.key || '');
  const [configSuccess, setConfigSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await login(email.trim(), password);
        if (res.error) throw res.error;
      } else {
        const res = await signup(email.trim(), password, { name: name.trim(), role });
        if (res.error) throw res.error;
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    saveCustomSupabaseConfig(supabaseUrl, supabaseKey);
    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#090d16] text-slate-100">
      {/* Background radial gradient glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-600/25 mb-3">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            DevOps<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Developer Collaboration & Release Platform
          </p>
        </div>

        {/* Cloud Status Pill */}
        <div className="mb-4 flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                config.isConfigured ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-300 font-medium">
              {config.isConfigured ? 'Connected to Supabase Cloud' : 'Local Auth Mode'}
            </span>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
          >
            {showConfig ? 'Hide Config' : 'Configure Cloud Keys'}
          </button>
        </div>

        {/* Cloud Keys Config Drawer */}
        {showConfig && (
          <form
            onSubmit={handleSaveConfig}
            className="mb-4 p-4 rounded-xl bg-slate-900/95 border border-indigo-500/30 text-xs space-y-3"
          >
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Database className="w-4 h-4" />
              <span>Connect Supabase Project</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Input your Supabase project credentials. Find them under Supabase Settings ➔ API.
            </p>
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400">Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 mt-1 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400">Anon Public Key</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 mt-1 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              {configSuccess && (
                <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
              >
                Save Supabase Keys
              </button>
            </div>
          </form>
        )}

        {/* Main Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-800/60 rounded-xl border border-slate-800 mb-5">
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Charan Sai"
                      className="w-full pl-9 pr-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Role / Job Title
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Staff SRE">Staff SRE</option>
                    <option value="Platform Architect">Platform Architect</option>
                    <option value="FullStack Developer">FullStack Developer</option>
                    <option value="Cloud Security Engineer">Cloud Security Engineer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                'Authenticating...'
              ) : mode === 'signin' ? (
                <>
                  Sign In to Workspace <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Create Clean Workspace <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 text-center mb-2">
              Evaluating DevOpsHub or demonstrating in an interview?
            </p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Explore Demo Sandbox with Sample Data
            </button>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          Newly registered accounts start with a clean workspace (no sample records).
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090d16] flex items-center justify-center text-xs text-slate-400">Loading auth...</div>}>
      <LoginContent />
    </Suspense>
  );
}
