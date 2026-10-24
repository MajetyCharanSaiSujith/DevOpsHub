'use client';

import React, { useState } from 'react';
import { fetchGitHubCommits, fetchGitHubPulls } from '@/lib/github';
import { formatDate, formatRelativeTime, formatNumber } from '@/lib/utils';
import {
  GitFork,
  Star,
  AlertCircle,
  ExternalLink,
  Trash2,
  GitCommit,
  GitPullRequest,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';

export default function RepositoryCard({ repo, onRemove }) {
  const [expandedTab, setExpandedTab] = useState(null); // 'commits' | 'pulls' | null
  const [commits, setCommits] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const toggleTab = async (tab) => {
    if (expandedTab === tab) {
      setExpandedTab(null);
      return;
    }

    setExpandedTab(tab);
    setDetailsError(null);

    if (tab === 'commits' && commits.length === 0) {
      setLoadingDetails(true);
      const res = await fetchGitHubCommits(repo.owner, repo.name);
      setLoadingDetails(false);
      if (res.error) {
        setDetailsError(res.error);
      } else {
        setCommits(res.data || []);
      }
    } else if (tab === 'pulls' && pulls.length === 0) {
      setLoadingDetails(true);
      const res = await fetchGitHubPulls(repo.owner, repo.name);
      setLoadingDetails(false);
      if (res.error) {
        setDetailsError(res.error);
      } else {
        setPulls(res.data || []);
      }
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between group">
      <div>
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GitFork className="w-4 h-4" />
            </span>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-slate-100 hover:text-indigo-400 font-mono inline-flex items-center gap-1 transition-colors"
            >
              {repo.fullName}
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          <button
            onClick={() => onRemove(repo)}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
            title="Remove repository"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
          {repo.description || 'No description provided.'}
        </p>

        {/* Stats strip */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-300 mt-4 pt-3 border-t border-slate-800/60 flex-wrap">
          <span className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5" />
            {formatNumber(repo.stars)}
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <GitFork className="w-3.5 h-3.5 text-slate-400" />
            {formatNumber(repo.forks)}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 text-[11px]">
            {repo.language || 'Code'}
          </span>
          <span className="text-slate-400 text-[11px]">
            Branch: <strong className="text-slate-200">{repo.defaultBranch || 'main'}</strong>
          </span>
        </div>
      </div>

      {/* Expandable Tabs for Commits & PRs */}
      <div className="mt-4 pt-3 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleTab('commits')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
              expandedTab === 'commits'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 border-slate-700/60'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            Commits
            {expandedTab === 'commits' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => toggleTab('pulls')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
              expandedTab === 'pulls'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 border-slate-700/60'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            Pull Requests
            {expandedTab === 'pulls' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Drawer Content */}
        {expandedTab && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            {loadingDetails ? (
              <div className="flex items-center justify-center py-4 text-slate-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Fetching live GitHub data...</span>
              </div>
            ) : detailsError ? (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px]">
                <p className="font-semibold">GitHub API Notice:</p>
                <p className="mt-0.5">{detailsError}</p>
              </div>
            ) : expandedTab === 'commits' ? (
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Latest 5 Commits
                </span>
                {commits.length === 0 ? (
                  <p className="text-slate-400 py-2">No commit records available.</p>
                ) : (
                  commits.map((c) => (
                    <div key={c.sha} className="flex items-start justify-between gap-2 border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 truncate">{c.commit.message}</p>
                        <p className="text-[10px] text-slate-400">
                          {c.commit.author?.name} • {formatRelativeTime(c.commit.author?.date)}
                        </p>
                      </div>
                      <a
                        href={c.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] text-indigo-400 hover:underline shrink-0"
                      >
                        {c.sha.slice(0, 7)}
                      </a>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Recent Pull Requests
                </span>
                {pulls.length === 0 ? (
                  <p className="text-slate-400 py-2">No active PRs found.</p>
                ) : (
                  pulls.map((pr) => (
                    <div key={pr.id} className="flex items-start justify-between gap-2 border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 truncate">
                          #{pr.number} {pr.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          by {pr.user?.login} • state: <span className={pr.state === 'open' ? 'text-emerald-400' : 'text-purple-400'}>{pr.state}</span>
                        </p>
                      </div>
                      <a
                        href={pr.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
