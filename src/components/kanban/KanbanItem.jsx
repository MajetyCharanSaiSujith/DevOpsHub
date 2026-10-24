'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PriorityBadge from '@/components/ui/PriorityBadge';
import { formatDate, isOverdue } from '@/lib/utils';
import { Calendar, GripVertical, AlertCircle, FolderGit2 } from 'lucide-react';

export default function KanbanItem({
  task,
  projectName = '',
  assignee = null,
  onClick = () => {},
  isOverlay = false,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = isOverdue(task.dueDate, task.status);

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-28 rounded-xl border-2 border-dashed border-indigo-500/50 bg-indigo-500/5 opacity-60"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative select-none ${
        isOverlay
          ? 'bg-white dark:bg-[#161b22] border-indigo-500 shadow-lg scale-105 rotate-1 z-50'
          : overdue
          ? 'bg-white dark:bg-[#161b22] border-rose-300 dark:border-rose-500/30 hover:border-rose-500 shadow-sm'
          : 'bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d] hover:border-indigo-400 dark:hover:border-slate-600 shadow-sm'
      }`}
      onClick={onClick}
    >
      {/* Drag handle & priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <PriorityBadge priority={task.priority} className="text-[10px] py-0 px-1.5" />
        <div
          {...attributes}
          {...listeners}
          className="p-1 -mr-1 text-slate-400 hover:text-slate-300 rounded cursor-grab active:cursor-grabbing hover:bg-slate-800/80 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Project name */}
      {projectName && (
        <p className="text-[10px] text-slate-400 font-mono mt-1.5 flex items-center gap-1 truncate">
          <FolderGit2 className="w-3 h-3 shrink-0" />
          <span className="truncate">{projectName}</span>
        </p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.slice(0, 2).map((l, idx) => (
            <span
              key={idx}
              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700/60"
            >
              #{l}
            </span>
          ))}
          {task.labels.length > 2 && (
            <span className="text-[9px] text-slate-400">+{task.labels.length - 2}</span>
          )}
        </div>
      )}

      {/* Footer: Date & Assignee */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
        <div
          className={`flex items-center gap-1 font-mono text-[10px] ${
            overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
          }`}
        >
          {overdue ? <AlertCircle className="w-3 h-3 text-rose-400" /> : <Calendar className="w-3 h-3 text-slate-400" />}
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {assignee && (
          <div
            title={`${assignee.name} (${assignee.role})`}
            className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0"
          >
            {assignee.avatar}
          </div>
        )}
      </div>
    </div>
  );
}
