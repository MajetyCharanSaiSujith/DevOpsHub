import React from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import { formatDate, isOverdue } from '@/lib/utils';
import { Calendar, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TaskCard({
  task,
  projectName = '',
  assignee = null,
  onClick,
  onToggleStatus,
}) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer group select-none ${
        overdue
          ? 'bg-slate-900/80 border-rose-500/30 hover:border-rose-500/60'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:shadow-lg hover:shadow-indigo-500/5'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <PriorityBadge priority={task.priority} className="text-[10px] py-0 px-2" />
          <StatusBadge status={task.status} className="text-[10px] py-0 px-2" />
        </div>
        {overdue && (
          <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1 font-mono">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>
        )}
      </div>

      <div className="flex items-start gap-2.5">
        {onToggleStatus && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(task);
            }}
            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
              task.status === 'Done'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'border-slate-700 hover:border-indigo-400 text-transparent'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h4
            className={`text-xs font-semibold leading-snug group-hover:text-indigo-400 transition-colors line-clamp-2 ${
              task.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-200'
            }`}
          >
            {task.title}
          </h4>
        </div>
      </div>

      {projectName && (
        <p className="text-[11px] text-slate-400 font-mono mt-2 truncate">
          📁 {projectName}
        </p>
      )}

      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {task.labels.slice(0, 3).map((l, idx) => (
            <span
              key={idx}
              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono"
            >
              #{l}
            </span>
          ))}
          {task.labels.length > 3 && (
            <span className="text-[9px] text-slate-400">+{task.labels.length - 3}</span>
          )}
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
        <div
          className={`flex items-center gap-1 font-mono ${
            overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-3 h-3" />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {assignee && (
          <div
            title={`${assignee.name} (${assignee.role})`}
            className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {assignee.avatar}
          </div>
        )}
      </div>
    </div>
  );
}
