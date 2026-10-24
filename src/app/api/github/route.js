import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const username = searchParams.get('username');
  const type = searchParams.get('type') || 'details'; // 'details', 'commits', 'pulls', 'user_repos'
  const clientToken = request.headers.get('x-github-token') || searchParams.get('token');

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'DevOpsHub-Platform',
  };

  // Use client-provided token or server-side env token
  const token = clientToken || process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  let endpoint = '';

  // Handle user repositories query (e.g., fetch all repos for a given GitHub username)
  if (type === 'user_repos' || username) {
    const targetUser = encodeURIComponent((username || owner || '').trim());
    if (!targetUser) {
      return NextResponse.json({
        success: false,
        error: 'A "username" query parameter is required to fetch user repositories.',
      });
    }
    endpoint = `https://api.github.com/users/${targetUser}/repos?sort=updated&per_page=30`;
  } else {
    // Single repo queries
    if (!owner || !repo) {
      return NextResponse.json({
        success: false,
        error: 'Both "owner" and "repo" query parameters are required.',
      });
    }

    const cleanOwner = encodeURIComponent(owner.trim());
    const cleanRepo = encodeURIComponent(repo.trim());

    if (type === 'commits') {
      endpoint = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/commits?per_page=5`;
    } else if (type === 'pulls') {
      endpoint = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/pulls?state=all&per_page=5`;
    } else {
      endpoint = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}`;
    }
  }

  try {
    const response = await fetch(endpoint, {
      headers,
      next: { revalidate: 60 },
    });

    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    const rateLimitReset = response.headers.get('x-ratelimit-reset');

    if (response.status === 404) {
      return NextResponse.json({
        success: false,
        notFound: true,
        error: `Resource not found on GitHub. Note: Private repositories or invalid usernames return 404 for unauthenticated requests.`,
      });
    }

    if (response.status === 403) {
      const resetTime = rateLimitReset
        ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString()
        : 'in a few minutes';
      return NextResponse.json({
        success: false,
        isRateLimited: true,
        error: `GitHub API rate limit reached. Resets at ${resetTime}. Add a GitHub Personal Access Token in Settings for 5,000 requests/hour.`,
      });
    }

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `GitHub API error (${response.status}): ${response.statusText}`,
      });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data,
      rateLimitRemaining,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Failed to connect to GitHub API: ${error.message}`,
    });
  }
}
