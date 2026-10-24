'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import RepositoryCard from '@/components/repositories/RepositoryCard';
import AddRepoModal from '@/components/repositories/AddRepoModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { fetchGitHubRepo } from '@/lib/github';
import {
  Plus,
  Search,
  ArrowUpDown,
  GitFork,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export default function RepositoriesPage() {
  const {
    repositories,
    updateRepository,
    removeRepository,
    addToast,
    searchQuery: globalSearch,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [sortBy, setSortBy] = useState('stars'); // 'stars' | 'forks' | 'name'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [repoToRemove, setRepoToRemove] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const query = (localSearch || globalSearch || '').toLowerCase();

  const filteredRepos = useMemo(() => {
    return repositories
      .filter((r) => {
        return (
          !query ||
          r.fullName.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.language?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
        if (sortBy === 'forks') return (b.forks || 0) - (a.forks || 0);
        if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
        return 0;
      });
  }, [repositories, query, sortBy]);

  const handleSyncAll = async () => {
    if (repositories.length === 0) return;
    setIsSyncing(true);
    addToast('Syncing repositories with live GitHub API...', 'info');

    let updatedCount = 0;
    for (const repo of repositories) {
      const res = await fetchGitHubRepo(repo.owner, repo.name);
      if (res.data) {
        updateRepository(repo.id, {
          stars: res.data.stargazers_count,
          forks: res.data.forks_count,
          openIssues: res.data.open_issues_count,
          description: res.data.description || repo.description,
          defaultBranch: res.data.default_branch || repo.defaultBranch,
          language: res.data.language || repo.language,
        });
        updatedCount++;
      }
    }

    setIsSyncing(false);
    addToast(`Successfully synchronized ${updatedCount} repositories from GitHub!`, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="GitHub Repositories"
        description="Monitor multi-repo cloud codebases, release branches, stars, commits, and pull requests via GitHub REST API."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Repositories' }]}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncAll}
              disabled={isSyncing || repositories.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium rounded-xl transition-colors shadow-sm"
              title="Refresh live GitHub stars, forks, and issues"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Live Data'}
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Connect Repository
            </button>
          </div>
        }
      />

      {/* Info notice banner */}
      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-slate-300">
            Connected via public Next.js Route Handler <code className="text-indigo-400 font-mono text-[11px]">/api/github</code>. Click <strong>Sync Live Data</strong> to refresh real stars and forks from GitHub.
          </p>
        </div>
        <span className="text-[11px] text-slate-400 font-mono shrink-0">
          {repositories.length} repos connected
        </span>
      </div>

      {/* Search and Sort */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search tracked repos..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 rounded-xl focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none"
            >
              <option value="stars" className="bg-slate-900">Sort: Most Stars</option>
              <option value="forks" className="bg-slate-900">Sort: Most Forks</option>
              <option value="name" className="bg-slate-900">Sort: Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length === 0 ? (
        <EmptyState
          icon={GitFork}
          title="No repositories connected"
          description="Connect an open source or personal GitHub repository to monitor code health and activity."
          actionLabel="Connect Repository"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRepos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              onRemove={(r) => setRepoToRemove(r)}
            />
          ))}
        </div>
      )}

      {/* Add Repo Modal */}
      <AddRepoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Delete / Remove Confirmation */}
      <ConfirmDialog
        isOpen={!!repoToRemove}
        title="Remove Repository"
        message={`Are you sure you want to stop tracking "${repoToRemove?.fullName}"? This will not delete any code on GitHub.`}
        confirmText="Remove"
        onConfirm={() => {
          if (repoToRemove) {
            removeRepository(repoToRemove.id);
            setRepoToRemove(null);
          }
        }}
        onCancel={() => setRepoToRemove(null)}
      />
    </div>
  );
}
