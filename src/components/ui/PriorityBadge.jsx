import React from 'react';
import { AlertCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { PRIORITY_COLORS } from '@/lib/utils';

export default function PriorityBadge({ priority, className = '' }) {
  const config = PRIORITY_COLORS[priority] || {
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    text: 'text-slate-400',
  };

  const renderIcon = () => {
    switch (priority) {
      case 'Critical':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'High':
        return <ArrowUp className="w-3.5 h-3.5 text-orange-400" />;
      case 'Medium':
        return <Minus className="w-3.5 h-3.5 text-blue-400" />;
      case 'Low':
        return <ArrowDown className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badge} ${className}`}
    >
      {renderIcon()}
      {priority}
    </span>
  );
}
