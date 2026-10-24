import React from 'react';
import { STATUS_COLORS } from '@/lib/utils';

export default function StatusBadge({ status, className = '' }) {
  const config = STATUS_COLORS[status] || {
    badge: 'bg-slate-700/40 text-slate-300 border-slate-600',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badge} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
