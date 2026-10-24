'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import TaskModal from '@/components/tasks/TaskModal';
import TaskDetailModal from '@/components/tasks/TaskDetailModal';
import { Plus, Search, Filter, Kanban, Sparkles } from 'lucide-react';

export default function KanbanPage() {
  const {
    tasks,
    projects,
    members,
    moveTaskStatus,
    searchQuery: globalSearch,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [targetColumnStatus, setTargetColumnStatus] = useState('Todo');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const query = (localSearch || globalSearch || '').toLowerCase();

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        !query ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        (t.labels && t.labels.some((l) => l.toLowerCase().includes(query)));

      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesProject = projectFilter === 'all' || t.projectId === projectFilter;

      return matchesSearch && matchesPriority && matchesProject;
    });
  }, [tasks, query, priorityFilter, projectFilter]);

  const handleOpenAddForColumn = (columnStatus) => {
    setTargetColumnStatus(columnStatus);
    setIsNewTaskOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive Kanban Board"
        description="Drag tasks across sprint stages to update state, trigger notifications, and log team velocity."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Kanban Board' }]}
        action={
          <button
            onClick={() => handleOpenAddForColumn('Todo')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        }
      />

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search board cards..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none"
          >
            <option value="all" className="bg-slate-900">All Priorities</option>
            <option value="Critical" className="bg-slate-900">Critical</option>
            <option value="High" className="bg-slate-900">High</option>
            <option value="Medium" className="bg-slate-900">Medium</option>
            <option value="Low" className="bg-slate-900">Low</option>
          </select>

          {/* Project */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none max-w-[180px] truncate"
          >
            <option value="all" className="bg-slate-900">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Drag cards between columns to transition status</span>
        </div>
      </div>

      {/* Drag-and-Drop Board */}
      <KanbanBoard
        tasks={filteredTasks}
        projects={projects}
        members={members}
        onMoveTask={moveTaskStatus}
        onAddTask={handleOpenAddForColumn}
        onTaskClick={(task) => setSelectedTaskId(task.id)}
      />

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        defaultStatus={targetColumnStatus}
      />

      {/* Task Detail Modal */}
      {selectedTaskId && (
        <TaskDetailModal
          isOpen={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          taskId={selectedTaskId}
        />
      )}
    </div>
  );
}
