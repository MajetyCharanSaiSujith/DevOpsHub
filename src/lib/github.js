// Client-side helper for interacting with the GitHub API route
import { getStoredData } from '@/lib/storage';

function getAuthHeaders() {
  const headers = {};
  if (typeof window !== 'undefined') {
    try {
      const state = getStoredData({});
      if (state?.profile?.githubToken) {
        headers['x-github-token'] = state.profile.githubToken;
      }
    } catch {
      // ignore
    }
  }
  return headers;
}

export async function fetchGitHubRepo(owner, repo) {
  try {
    const res = await fetch(
      `/api/github?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&type=details`,
      { headers: getAuthHeaders() }
    );
    const json = await res.json();
    if (json.success === false || json.error) {
      return { data: null, error: json.error, notFound: json.notFound };
    }
    return { data: json.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function fetchGitHubCommits(owner, repo) {
  try {
    const res = await fetch(
      `/api/github?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&type=commits`,
      { headers: getAuthHeaders() }
    );
    const json = await res.json();
    if (json.success === false || json.error) {
      return { data: null, error: json.error };
    }
    return { data: json.data || [], error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function fetchGitHubPulls(owner, repo) {
  try {
    const res = await fetch(
      `/api/github?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&type=pulls`,
      { headers: getAuthHeaders() }
    );
    const json = await res.json();
    if (json.success === false || json.error) {
      return { data: null, error: json.error };
    }
    return { data: json.data || [], error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function fetchUserRepos(username) {
  try {
    const res = await fetch(
      `/api/github?username=${encodeURIComponent(username)}&type=user_repos`,
      { headers: getAuthHeaders() }
    );
    const json = await res.json();
    if (json.success === false || json.error) {
      return { data: null, error: json.error };
    }
    return { data: json.data || [], error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export function parseRepoInput(input) {
  if (!input) return null;
  const trimmed = input
    .trim()
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/\/$/, '');
  const parts = trimmed.split('/');
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { owner: parts[0], repo: parts[1] };
  }
  return null;
}
