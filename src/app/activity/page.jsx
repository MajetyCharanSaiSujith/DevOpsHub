'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import { formatRelativeTime, formatDateTime } from '@/lib/utils';
import {
  Activity,
  CheckCircle2,
  FolderGit2,
  Rocket,
  GitFork,
  Search,
  Filter,
  Trash2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function ActivityPage() {
  const { activities, searchQuery: globalSearch } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const query = (localSearch || globalSearch || '').toLowerCase();

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesSearch =
        !query ||
        act.description.toLowerCase().includes(query) ||
        act.user.toLowerCase().includes(query);

      let matchesType = true;
      if (typeFilter === 'tasks') {
        matchesType = act.type.startsWith('task');
      } else if (typeFilter === 'projects') {
        matchesType = act.type.startsWith('project');
      } else if (typeFilter === 'deployments') {
        matchesType = act.type.startsWith('deployment');
      } else if (typeFilter === 'repositories') {
        matchesType = act.type.startsWith('repository');
      }

      return matchesSearch && matchesType;
    });
  }, [activities, query, typeFilter]);

  const getActivityIcon = (type) => {
    if (type === 'task_completed') {
      return (
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      );
    }
    if (type.startsWith('workspace')) {
      return (
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
      );
    }
    if (type.startsWith('task')) {
      return (
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
          <Layers className="w-4 h-4" />
        </div>
      );
    }
    if (type.startsWith('project')) {
      return (
        <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">
          <FolderGit2 className="w-4 h-4" />
        </div>
      );
    }
    if (type.startsWith('deployment')) {
      return (
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
          <Rocket className="w-4 h-4" />
        </div>
      );
    }
    if (type.startsWith('repository')) {
      return (
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
          <GitFork className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
        <Activity className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit & Team Activity Stream"
        description="Chronological record of automated and manual developer collaboration events across the platform."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Activity' }]}
      />

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
              placeholder="Search activity by user or event..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none"
          >
            <option value="all" className="bg-slate-900">All Event Types</option>
            <option value="tasks" className="bg-slate-900">Tasks</option>
            <option value="projects" className="bg-slate-900">Projects</option>
            <option value="deployments" className="bg-slate-900">Deployments</option>
            <option value="repositories" className="bg-slate-900">Repositories</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredActivities.length} logs
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No activity events recorded matching the criteria.
          </div>
        ) : (
          <div className="relative pl-4 border-l border-slate-800 space-y-6">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-3.5 group">
                {/* Timeline node */}
                <span className="absolute -left-[21px] top-3 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0b0f19]" />

                {getActivityIcon(act.type)}

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-xs text-slate-200 leading-snug">
                      <span className="font-semibold text-white">{act.user}</span>{' '}
                      <span className="text-slate-300">{act.description}</span>
                    </p>
                    <span
                      title={formatDateTime(act.timestamp)}
                      className="text-[11px] font-mono text-slate-400 shrink-0"
                    >
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>

                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    {act.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
