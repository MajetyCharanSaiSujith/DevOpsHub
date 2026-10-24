'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import DeploymentTable from '@/components/deployments/DeploymentTable';
import TriggerDeploymentModal from '@/components/deployments/TriggerDeploymentModal';
import {
  Rocket,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Radio,
  Layers,
} from 'lucide-react';

export default function DeploymentsPage() {
  const { deployments, projects, searchQuery: globalSearch } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);

  const query = (localSearch || globalSearch || '').toLowerCase();

  const filteredDeployments = useMemo(() => {
    return deployments.filter((d) => {
      const matchesSearch =
        !query ||
        d.name.toLowerCase().includes(query) ||
        d.projectName.toLowerCase().includes(query) ||
        d.branch.toLowerCase().includes(query) ||
        d.commit.toLowerCase().includes(query);

      const matchesEnv = environmentFilter === 'all' || d.environment === environmentFilter;
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchesProject = projectFilter === 'all' || d.projectId === projectFilter;

      return matchesSearch && matchesEnv && matchesStatus && matchesProject;
    });
  }, [deployments, query, environmentFilter, statusFilter, projectFilter]);

  const stats = {
    total: deployments.length,
    success: deployments.filter((d) => d.status === 'Success').length,
    failed: deployments.filter((d) => d.status === 'Failed').length,
    running: deployments.filter((d) => d.status === 'Running').length,
  };

  const successRate =
    stats.total > 0
      ? Math.round((stats.success / (stats.success + stats.failed || 1)) * 100)
      : 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="CI/CD Deployments & Release Pipelines"
        description="Monitor multi-cluster cloud releases, container builds, and deployment rollouts across environments."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Deployments' }]}
        action={
          <button
            onClick={() => setIsTriggerModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <Rocket className="w-4 h-4" />
            Trigger Deployment
          </button>
        }
      />

      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Deployments</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-1">{stats.total}</p>
          <span className="text-[11px] text-slate-400 font-mono">All environments</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400">Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{successRate}%</p>
          <span className="text-[11px] text-slate-400 font-mono">{stats.success} successful builds</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-400">Active Pipelines</span>
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-400 mt-1">{stats.running}</p>
          <span className="text-[11px] text-slate-400 font-mono">Rolling out now</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-400">Build Failures</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-rose-400 mt-1">{stats.failed}</p>
          <span className="text-[11px] text-slate-400 font-mono">Requires investigation</span>
        </div>
      </div>

      {/* Integration Notice Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs">
        <Radio className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          <strong>Architecture Note:</strong> Sample deployment records are structured with production schemas (Environment, Commit SHA, Duration, Status) ready to plug into GitHub Actions webhooks, ArgoCD sync APIs, or Kubernetes release webhooks.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by service or commit..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Environment */}
          <select
            value={environmentFilter}
            onChange={(e) => setEnvironmentFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none"
          >
            <option value="all" className="bg-slate-900">All Environments</option>
            <option value="Production" className="bg-slate-900">Production</option>
            <option value="Preview" className="bg-slate-900">Preview</option>
            <option value="Development" className="bg-slate-900">Development</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none"
          >
            <option value="all" className="bg-slate-900">All Statuses</option>
            <option value="Success" className="bg-slate-900">Success</option>
            <option value="Failed" className="bg-slate-900">Failed</option>
            <option value="Running" className="bg-slate-900">Running</option>
            <option value="Queued" className="bg-slate-900">Queued</option>
          </select>

          {/* Project */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none max-w-[180px] truncate"
          >
            <option value="all" className="bg-slate-900">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Deployment Table Container */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <DeploymentTable deployments={filteredDeployments} />
      </div>

      {/* Trigger Modal */}
      <TriggerDeploymentModal
        isOpen={isTriggerModalOpen}
        onClose={() => setIsTriggerModalOpen(false)}
      />
    </div>
  );
}
