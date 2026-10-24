'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import TaskCard from '@/components/tasks/TaskCard';
import TaskModal from '@/components/tasks/TaskModal';
import TaskDetailModal from '@/components/tasks/TaskDetailModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import { formatDate, isOverdue } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CheckSquare,
  LayoutGrid,
  List,
  CheckCircle2,
  Calendar,
  AlertCircle,
  MoreVertical,
  Trash2,
  Edit2,
} from 'lucide-react';

export default function TasksPage() {
  const {
    tasks,
    projects,
    members,
    moveTaskStatus,
    deleteTask,
    searchQuery: globalSearch,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'title' | 'status'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const query = (localSearch || globalSearch || '').toLowerCase();

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchesSearch =
          !query ||
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          (t.labels && t.labels.some((l) => l.toLowerCase().includes(query)));

        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
        const matchesProject = projectFilter === 'all' || t.projectId === projectFilter;
        const matchesAssignee = assigneeFilter === 'all' || t.assignee === assigneeFilter;
        const matchesOverdue = !onlyOverdue || isOverdue(t.dueDate, t.status);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesProject &&
          matchesAssignee &&
          matchesOverdue
        );
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        }
        if (sortBy === 'priority') {
          const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return (rank[b.priority] || 0) - (rank[a.priority] || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'status') {
          const order = { Todo: 1, 'In Progress': 2, 'In Review': 3, Done: 4 };
          return (order[a.status] || 0) - (order[b.status] || 0);
        }
        return 0;
      });
  }, [
    tasks,
    query,
    statusFilter,
    priorityFilter,
    projectFilter,
    assigneeFilter,
    onlyOverdue,
    sortBy,
  ]);

  const stats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status !== 'Done').length,
    done: tasks.filter((t) => t.status === 'Done').length,
    overdue: tasks.filter((t) => isOverdue(t.dueDate, t.status)).length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Management & Sprints"
        description="Comprehensive backlog and sprint tickets with priorities, assignees, and real-time completion status."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Tasks' }]}
        action={
          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        }
      />

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400">Total Tasks</span>
          <p className="text-xl font-bold text-white mt-0.5">{stats.total}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-indigo-400">In Flight</span>
          <p className="text-xl font-bold text-indigo-400 mt-0.5">{stats.open}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-emerald-400">Completed</span>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">{stats.done}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-rose-400">Overdue</span>
          <p className="text-xl font-bold text-rose-400 mt-0.5">{stats.overdue}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search tasks or labels..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All Statuses</option>
              <option value="Todo" className="bg-slate-900">Todo</option>
              <option value="In Progress" className="bg-slate-900">In Progress</option>
              <option value="In Review" className="bg-slate-900">In Review</option>
              <option value="Done" className="bg-slate-900">Done</option>
            </select>

            {/* Priority Filter */}
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

            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none max-w-[160px] truncate"
            >
              <option value="all" className="bg-slate-900">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.name}
                </option>
              ))}
            </select>

            {/* Overdue Checkbox Toggle */}
            <button
              type="button"
              onClick={() => setOnlyOverdue(!onlyOverdue)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                onlyOverdue
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Overdue only
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none"
              >
                <option value="dueDate" className="bg-slate-900">Sort: Due Date</option>
                <option value="priority" className="bg-slate-900">Sort: Priority</option>
                <option value="title" className="bg-slate-900">Sort: Title</option>
                <option value="status" className="bg-slate-900">Sort: Status</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task List/Grid */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={tasks.length === 0 ? "No tasks in your workspace yet" : "No tasks match your filter"}
          description={
            tasks.length === 0
              ? "Create your first task to plan work, set priorities, assign teammates, and track sprint deadlines."
              : "Try broadening your search query or reset the filters."
          }
          actionLabel="Add New Task"
          onAction={() => setIsNewTaskOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const assignee = members.find((m) => m.id === task.assignee);

            return (
              <TaskCard
                key={task.id}
                task={task}
                projectName={project?.name}
                assignee={assignee}
                onClick={() => setSelectedTaskId(task.id)}
                onToggleStatus={(t) =>
                  moveTaskStatus(t.id, t.status === 'Done' ? 'Todo' : 'Done')
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="p-2 rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-medium">
                <th className="py-3 px-3 w-8"></th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Assignee</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                const assignee = members.find((m) => m.id === task.assignee);
                const overdue = isOverdue(task.dueDate, task.status);

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <td
                      className="py-3 px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          moveTaskStatus(task.id, task.status === 'Done' ? 'Todo' : 'Done')
                        }
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          task.status === 'Done'
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-700 hover:border-indigo-500 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </button>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      <p
                        className={`font-semibold group-hover:text-indigo-400 transition-colors truncate ${
                          task.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex gap-1 mt-0.5">
                          {task.labels.slice(0, 2).map((l, idx) => (
                            <span key={idx} className="text-[9px] text-slate-400 font-mono">
                              #{l}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-300 max-w-[140px] truncate">
                      {project ? project.name : '—'}
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={task.status} className="text-[10px] py-0 px-2" />
                    </td>

                    <td className="py-3 px-3">
                      <PriorityBadge priority={task.priority} className="text-[10px] py-0 px-2" />
                    </td>

                    <td className="py-3 px-3">
                      {assignee ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                            {assignee.avatar}
                          </div>
                          <span className="text-slate-300 truncate max-w-[100px]">
                            {assignee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`${
                          overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {formatDate(task.dueDate)}
                      </span>
                    </td>

                    <td
                      className="py-3 px-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setTaskToEdit(task)}
                          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setTaskToDelete(task)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New Task Modal */}
      <TaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />

      {/* Edit Task Modal */}
      {taskToEdit && (
        <TaskModal
          isOpen={!!taskToEdit}
          onClose={() => setTaskToEdit(null)}
          taskToEdit={taskToEdit}
        />
      )}

      {/* Task Details Dialog */}
      {selectedTaskId && (
        <TaskDetailModal
          isOpen={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          taskId={selectedTaskId}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        confirmText="Delete Task"
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}
