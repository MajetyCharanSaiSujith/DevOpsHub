import React from 'react';
import { FolderGit2, Plus } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FolderGit2,
  title = 'No items found',
  description = 'Get started by creating your first item or adjusting your filters.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mt-1.5 mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
