'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanItem from '@/components/kanban/KanbanItem';
import { Plus } from 'lucide-react';

export default function KanbanColumn({
  id,
  title,
  tasks = [],
  projects = [],
  members = [],
  color = 'indigo',
  onAddTask,
  onTaskClick,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  const headerColors = {
    'Todo': 'bg-slate-500/10 text-slate-300 border-slate-700/60',
    'In Progress': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    'In Review': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Done': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const dotColors = {
    'Todo': 'bg-slate-400',
    'In Progress': 'bg-indigo-400',
    'In Review': 'bg-amber-400',
    'Done': 'bg-emerald-400',
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 min-w-[270px] max-w-sm rounded-2xl bg-slate-900/50 border transition-all ${
        isOver
          ? 'border-indigo-500/60 bg-indigo-500/5 ring-2 ring-indigo-500/20'
          : 'border-slate-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColors[id] || 'bg-slate-400'}`} />
          <h3 className="text-xs font-bold text-slate-200 tracking-wide">{title}</h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700/60">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(id)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Area */}
      <div className="p-3 flex-1 overflow-y-auto space-y-2.5 min-h-[350px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-800/80 rounded-xl text-center p-4">
              <p className="text-xs text-slate-400">No tasks in {title}</p>
              <button
                onClick={() => onAddTask(id)}
                className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                + Add a card
              </button>
            </div>
          ) : (
            tasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const assignee = members.find((m) => m.id === task.assignee);

              return (
                <KanbanItem
                  key={task.id}
                  task={task}
                  projectName={project?.name}
                  assignee={assignee}
                  onClick={() => onTaskClick(task)}
                />
              );
            })
          )}
        </SortableContext>
      </div>
    </div>
  );
}
