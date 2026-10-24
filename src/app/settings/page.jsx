'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { getSupabaseConfig, saveCustomSupabaseConfig } from '@/lib/supabase';
import {
  Settings,
  User,
  Sun,
  Moon,
  RotateCcw,
  Download,
  Upload,
  Shield,
  Key,
  Check,
  AlertTriangle,
  Database,
  Trash2,
  Sparkles,
  FileCode,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    user,
    profile,
    theme,
    setTheme,
    updateProfile,
    loadStarterSampleData,
    clearWorkspace,
    exportData,
    importData,
    addToast,
  } = useApp();

  const [name, setName] = useState(profile.name || user?.name || '');
  const [email, setEmail] = useState(profile.email || user?.email || '');
  const [role, setRole] = useState(profile.role || user?.role || 'DevOps Engineer');
  const [department, setDepartment] = useState(profile.department || 'Platform Engineering');
  const [defaultTaskFilter, setDefaultTaskFilter] = useState(profile.defaultTaskFilter || 'all');
  const [githubToken, setGithubToken] = useState(profile.githubToken || '');

  // Supabase cloud config
  const currentSupaConfig = getSupabaseConfig();
  const [supaUrl, setSupaUrl] = useState(currentSupaConfig.url || '');
  const [supaKey, setSupaKey] = useState(currentSupaConfig.key || '');
  const [supaSuccess, setSupaSuccess] = useState(false);

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      department: department.trim(),
      defaultTaskFilter,
      githubToken: githubToken.trim(),
    });
  };

  const handleSaveSupaConfig = (e) => {
    e.preventDefault();
    saveCustomSupabaseConfig(supaUrl, supaKey);
    setSupaSuccess(true);
    addToast('Supabase Cloud configuration updated!', 'success');
    setTimeout(() => setSupaSuccess(false), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importData(json);
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Workspace Settings & Cloud Preferences"
        description="Manage your identity, Supabase Cloud authentication, theme, and data backups."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Settings' }]}
      />

      {/* Profile Form */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                User Identity & Profile
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    user?.isDemo
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {user?.isDemo ? 'Demo Mode' : 'Cloud Authenticated'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                This identity represents you across projects, sprint tasks, and audit logs.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Engineering Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Team / Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Supabase Cloud Connection Settings */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">Supabase Cloud Auth & Database</h3>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              currentSupaConfig.isConfigured
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {currentSupaConfig.isConfigured ? 'Live Cloud Connected' : 'Local Auth Fallback'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          DevOpsHub syncs accounts and data using Supabase PostgreSQL and Auth. Run the included schema migration script in your Supabase SQL editor: <code className="text-indigo-400 font-mono text-[11px]">supabase/schema.sql</code>.
        </p>

        <form onSubmit={handleSaveSupaConfig} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={supaUrl}
                onChange={(e) => setSupaUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Supabase Anon Public Key
              </label>
              <input
                type="password"
                value={supaKey}
                onChange={(e) => setSupaKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              SQL Schema: supabase/schema.sql
            </span>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
            >
              {supaSuccess ? 'Keys Saved!' : 'Save Supabase Keys'}
            </button>
          </div>
        </form>
      </div>

      {/* Interface Theme */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Interface & Appearance</h3>
        <p className="text-xs text-slate-400">
          Customize the dashboard theme for high-contrast dark room operations or daylight.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              theme === 'dark'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div className="text-left">
                <span className="text-xs font-bold block">Charcoal Navy (Dark)</span>
                <span className="text-[11px] text-slate-400">Standard developer theme</span>
              </div>
            </div>
            {theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              theme === 'light'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <span className="text-xs font-bold block">Daylight Slate (Light)</span>
                <span className="text-[11px] text-slate-400">Clean light contrast</span>
              </div>
            </div>
            {theme === 'light' && <Check className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* GitHub API Configuration */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">GitHub API Token</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          DevOpsHub queries GitHub&apos;s public REST API for repository inspection. Unauthenticated requests are limited to 60 req/hr. You can optionally supply a GitHub Personal Access Token stored client-side for up to 5,000 req/hr.
        </p>

        <div className="space-y-2">
          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Optional)"
            className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-400">
            Never committed or shared. Preserved locally in your browser session.
          </p>
        </div>
      </div>

      {/* Workspace Cleanliness & Data Management */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Workspace Management & Data Portability</h3>
        <p className="text-xs text-slate-400">
          Manage workspace cleanliness, load starter sample data, or export JSON backups.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => loadStarterSampleData()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-medium rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Load Sample Starter Data
          </button>

          <button
            onClick={exportData}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            Export Backup (JSON)
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            Import Backup (JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => setIsClearConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium rounded-xl transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear to Blank Workspace
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        title="Clear to Blank Workspace"
        message="This will remove all projects, sprint tasks, and deployment records from your workspace so you can start with a completely clean slate. Are you sure?"
        confirmText="Clear Workspace"
        onConfirm={() => {
          clearWorkspace();
          setIsClearConfirmOpen(false);
        }}
        onCancel={() => setIsClearConfirmOpen(false)}
      />
    </div>
  );
}
