'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { parseRepoInput, fetchGitHubRepo, fetchUserRepos } from '@/lib/github';
import { formatNumber } from '@/lib/utils';
import {
  X,
  GitFork,
  AlertCircle,
  Loader2,
  Star,
  Check,
  Key,
  User,
  Search,
  Plus,
} from 'lucide-react';

export default function AddRepoModal({ isOpen, onClose }) {
  const { addRepository, repositories } = useApp();

  const [tab, setTab] = useState('single'); // 'single' | 'user'

  // Single repo state
  const [repoInput, setRepoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  // User repos state
  const [usernameInput, setUsernameInput] = useState('MajetyCharanSaiSujith');
  const [userRepos, setUserRepos] = useState([]);
  const [loadingUserRepos, setLoadingUserRepos] = useState(false);
  const [userReposError, setUserReposError] = useState(null);

  if (!isOpen) return null;

  const handleFetchPreview = async (e) => {
    e.preventDefault();
    setError(null);
    setPreviewData(null);

    const parsed = parseRepoInput(repoInput);
    if (!parsed) {
      setError('Please provide a valid repository in format "owner/repo" or full GitHub URL (e.g. vercel/next.js).');
      return;
    }

    setLoading(true);
    const result = await fetchGitHubRepo(parsed.owner, parsed.repo);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setPreviewData(result.data);
    }
  };

  const handleFetchUserRepos = async (e) => {
    e?.preventDefault();
    setUserReposError(null);
    setUserRepos([]);

    if (!usernameInput.trim()) {
      setUserReposError('Please enter a GitHub username.');
      return;
    }

    setLoadingUserRepos(true);
    const result = await fetchUserRepos(usernameInput.trim());
    setLoadingUserRepos(false);

    if (result.error) {
      setUserReposError(result.error);
    } else {
      setUserRepos(result.data || []);
    }
  };

  const handleConfirmAddSingle = () => {
    if (!previewData) return;

    addRepository({
      owner: previewData.owner.login,
      name: previewData.name,
      fullName: previewData.full_name,
      description: previewData.description || 'No description provided.',
      language: previewData.language || 'Unknown',
      stars: previewData.stargazers_count,
      forks: previewData.forks_count,
      openIssues: previewData.open_issues_count,
      defaultBranch: previewData.default_branch,
      url: previewData.html_url,
    });

    onClose();
    setRepoInput('');
    setPreviewData(null);
  };

  const handleAddFromUserList = (repoItem) => {
    addRepository({
      owner: repoItem.owner.login,
      name: repoItem.name,
      fullName: repoItem.full_name,
      description: repoItem.description || 'No description provided.',
      language: repoItem.language || 'Unknown',
      stars: repoItem.stargazers_count,
      forks: repoItem.forks_count,
      openIssues: repoItem.open_issues_count,
      defaultBranch: repoItem.default_branch,
      url: repoItem.html_url,
    });
  };

  const popularSuggestions = [
    'MajetyCharanSaiSujith/DOCKER-AWS-FULLSTACK',
    'MajetyCharanSaiSujith/Devops-Ansible-2300033128',
    'vercel/next.js',
    'kubernetes/kubernetes',
    'prometheus/prometheus',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Connect GitHub Repositories</h3>
              <p className="text-xs text-slate-400">Live integration with the official GitHub REST API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-800/60 rounded-xl border border-slate-800 mt-4">
          <button
            type="button"
            onClick={() => setTab('single')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === 'single'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Specific Repository
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('user');
              if (userRepos.length === 0) handleFetchUserRepos();
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'user'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Browse by GitHub User
          </button>
        </div>

        {tab === 'single' ? (
          /* Single Repo Form */
          <form onSubmit={handleFetchPreview} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                GitHub Repository (owner/repo or URL) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="e.g. MajetyCharanSaiSujith/DOCKER-AWS-FULLSTACK"
                  className="flex-1 px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={loading || !repoInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Inspect'}
                </button>
              </div>
            </div>

            {/* Quick suggestions */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Quick suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {popularSuggestions.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRepoInput(s)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="space-y-1">
                  <p className="font-semibold text-rose-200">Repository Notice</p>
                  <p className="leading-relaxed text-[11px] text-rose-300">{error}</p>
                  <Link
                    href="/settings"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline pt-1"
                  >
                    <Key className="w-3 h-3" />
                    Add GitHub Token in Settings for private repos
                  </Link>
                </div>
              </div>
            )}

            {/* Fetched Preview */}
            {previewData && (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                      {previewData.full_name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {previewData.description || 'No description provided.'}
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {previewData.language || 'Code'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-2 border-t border-slate-700/60">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5" />
                    {formatNumber(previewData.stargazers_count)}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <GitFork className="w-3.5 h-3.5" />
                    {formatNumber(previewData.forks_count)} forks
                  </span>
                  <span className="text-slate-400">
                    Branch: {previewData.default_branch}
                  </span>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleConfirmAddSingle}
                disabled={!previewData}
                className="px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Add Repository
              </button>
            </div>
          </form>
        ) : (
          /* User Repos Browser */
          <div className="mt-4 space-y-4">
            <form onSubmit={handleFetchUserRepos} className="flex gap-2">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter GitHub username..."
                className="flex-1 px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loadingUserRepos || !usernameInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
              >
                {loadingUserRepos ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                Fetch Repos
              </button>
            </form>

            {userReposError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {userReposError}
              </div>
            )}

            {/* Repos list */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 pr-1">
              {loadingUserRepos ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  Loading public repositories for @{usernameInput}...
                </div>
              ) : userRepos.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No public repositories found. Check username or enter above.
                </div>
              ) : (
                userRepos.map((repo) => {
                  const alreadyAdded = repositories.some(
                    (r) => r.fullName.toLowerCase() === repo.full_name.toLowerCase()
                  );

                  return (
                    <div
                      key={repo.id}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-200 font-mono truncate">
                          {repo.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {repo.description || 'No description.'}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-mono">
                          <span>★ {repo.stargazers_count}</span>
                          <span>{repo.language || 'Code'}</span>
                          <span>branch: {repo.default_branch}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddFromUserList(repo)}
                        disabled={alreadyAdded}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-colors ${
                          alreadyAdded
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40'
                        }`}
                      >
                        {alreadyAdded ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            Track
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
