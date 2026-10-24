'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, CheckSquare, AlertCircle } from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  taskToEdit = null,
  defaultProjectId = '',
  defaultStatus = 'Todo',
}) {
  const { addTask, updateTask, projects, members } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [labelsInput, setLabelsInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setProjectId(taskToEdit.projectId || (projects[0]?.id || ''));
      setStatus(taskToEdit.status || 'Todo');
      setPriority(taskToEdit.priority || 'Medium');
      setAssignee(taskToEdit.assignee || (members[0]?.id || ''));
      setDueDate(taskToEdit.dueDate || '');
      setLabelsInput(taskToEdit.labels ? taskToEdit.labels.join(', ') : '');
    } else {
      setTitle('');
      setDescription('');
      setProjectId(defaultProjectId || (projects[0]?.id || ''));
      setStatus(defaultStatus || 'Todo');
      setPriority('Medium');
      setAssignee(members[0]?.id || 'usr-1');
      setDueDate('');
      setLabelsInput('devops, backend');
    }
    setErrors({});
  }, [taskToEdit, defaultProjectId, defaultStatus, isOpen, projects, members]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Task title is required';
    if (!projectId) errs.projectId = 'Please select a project';
    if (!dueDate) errs.dueDate = 'Due date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const labels = labelsInput
      .split(',')
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      projectId,
      status,
      priority,
      assignee,
      dueDate,
      labels,
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, payload);
    } else {
      addTask(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {taskToEdit ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-xs text-slate-400">
                {taskToEdit ? 'Update task attributes and ownership' : 'Add a task to the engineering backlog or sprint'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Audit AWS IAM role boundaries"
              className={`w-full px-3.5 py-2 bg-slate-800/60 border rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                errors.title ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Implementation details, acceptance criteria, or relevant links..."
              className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Project & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Associated Project *
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-800/60 border rounded-xl text-xs text-slate-200 focus:outline-none ${
                  errors.projectId ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900">
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.projectId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900">
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status, Priority, Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Todo" className="bg-slate-900">Todo</option>
                <option value="In Progress" className="bg-slate-900">In Progress</option>
                <option value="In Review" className="bg-slate-900">In Review</option>
                <option value="Done" className="bg-slate-900">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Low" className="bg-slate-900">Low</option>
                <option value="Medium" className="bg-slate-900">Medium</option>
                <option value="High" className="bg-slate-900">High</option>
                <option value="Critical" className="bg-slate-900">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-800/60 border rounded-xl text-xs text-slate-200 focus:outline-none ${
                  errors.dueDate ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.dueDate && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Labels (comma-separated)
            </label>
            <input
              type="text"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              placeholder="kubernetes, security, ingress"
              className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
