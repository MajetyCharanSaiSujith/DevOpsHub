'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import TaskModal from '@/components/tasks/TaskModal';
import { formatDate, formatDateTime, isOverdue } from '@/lib/utils';
import {
  X,
  Calendar,
  User,
  FolderGit2,
  Tag,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function TaskDetailModal({ isOpen, onClose, taskId }) {
  const { tasks, projects, members, moveTaskStatus, deleteTask } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!isOpen || !taskId) return null;

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const assigneeMember = members.find((m) => m.id === task.assignee);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {overdue && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    <AlertCircle className="w-3 h-3" />
                    Overdue
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-100 leading-snug">{task.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-5 space-y-5">
            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Description
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">
                  Project
                </span>
                {project ? (
                  <Link
                    href={`/projects/${project.id}`}
                    onClick={onClose}
                    className="font-medium text-indigo-400 hover:underline flex items-center gap-1.5"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ) : (
                  <span className="text-slate-400">Unassigned</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">
                  Assignee
                </span>
                {assigneeMember ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {assigneeMember.avatar}
                    </div>
                    <span className="font-medium text-slate-200">{assigneeMember.name}</span>
                  </div>
                ) : (
                  <span className="text-slate-400">Unassigned</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">
                  Due Date
                </span>
                <div
                  className={`flex items-center gap-1.5 font-mono ${
                    overdue ? 'text-rose-400 font-semibold' : 'text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">
                  Change Status
                </span>
                <select
                  value={task.status}
                  onChange={(e) => moveTaskStatus(task.id, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Labels
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {task.labels.map((l, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Created: {formatDateTime(task.createdAt)}</span>
              <span>Updated: {formatDateTime(task.updatedAt)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Task
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Task
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <TaskModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        taskToEdit={task}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?`}
        confirmText="Delete"
        onConfirm={() => {
          deleteTask(task.id);
          setIsDeleteOpen(false);
          onClose();
        }}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </>
  );
}
