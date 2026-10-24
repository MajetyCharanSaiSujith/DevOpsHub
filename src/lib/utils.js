// Common utility functions for formatting, styling, and ID generation

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US');
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '—';
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'Done') return false;
  try {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  } catch {
    return false;
  }
}

export const STATUS_COLORS = {
  'Todo': {
    badge: 'bg-slate-700/50 text-slate-300 border-slate-600',
    dot: 'bg-slate-400',
  },
  'In Progress': {
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    dot: 'bg-indigo-400',
  },
  'In Review': {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  'Done': {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  'Planning': {
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    dot: 'bg-sky-400',
  },
  'Completed': {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
};

export const PRIORITY_COLORS = {
  'Low': {
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    text: 'text-slate-400',
  },
  'Medium': {
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    text: 'text-blue-400',
  },
  'High': {
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    text: 'text-orange-400',
  },
  'Critical': {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
    text: 'text-rose-400',
  },
};

export const DEPLOYMENT_STATUS_COLORS = {
  'Success': {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: 'text-emerald-400',
  },
  'Failed': {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    icon: 'text-rose-400',
  },
  'Running': {
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    icon: 'text-indigo-400 animate-spin',
  },
  'Queued': {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: 'text-amber-400',
  },
};
