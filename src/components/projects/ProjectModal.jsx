'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, FolderGit2, AlertCircle } from 'lucide-react';

export default function ProjectModal({
  isOpen,
  onClose,
  projectToEdit = null,
}) {
  const { addProject, updateProject, repositories, members } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('Planning');
  const [priority, setPriority] = useState('Medium');
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repositoryId, setRepositoryId] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || '');
      setDescription(projectToEdit.description || '');
      setOwner(projectToEdit.owner || (members[0]?.name || 'Alex Rivera'));
      setStatus(projectToEdit.status || 'In Progress');
      setPriority(projectToEdit.priority || 'Medium');
      setProgress(projectToEdit.progress || 0);
      setStartDate(projectToEdit.startDate || '');
      setDueDate(projectToEdit.dueDate || '');
      setRepositoryId(projectToEdit.repositoryId || '');
      setSelectedMembers(projectToEdit.members || []);
      setTagsInput(projectToEdit.tags ? projectToEdit.tags.join(', ') : '');
    } else {
      setName('');
      setDescription('');
      setOwner(members[0]?.name || 'Alex Rivera');
      setStatus('In Progress');
      setPriority('Medium');
      setProgress(0);
      setStartDate(new Date().toISOString().slice(0, 10));
      setDueDate('');
      setRepositoryId(repositories[0]?.id || '');
      setSelectedMembers(['usr-1', 'usr-2']);
      setTagsInput('devops, platform');
    }
    setErrors({});
  }, [projectToEdit, isOpen, members, repositories]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Project name is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!dueDate) errs.dueDate = 'Due date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      owner,
      status,
      priority,
      progress: Number(progress),
      startDate,
      dueDate,
      repositoryId,
      members: selectedMembers,
      tags,
    };

    if (projectToEdit) {
      updateProject(projectToEdit.id, payload);
    } else {
      addProject(payload);
    }

    onClose();
  };

  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {projectToEdit ? 'Edit Project' : 'Create New Project'}
              </h3>
              <p className="text-xs text-slate-400">
                {projectToEdit ? 'Update project specifications and goals' : 'Configure a new platform or infrastructure project'}
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
          {/* Project Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Real-Time Telemetry Pipeline"
              className={`w-full px-3.5 py-2 bg-slate-800/60 border rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                errors.name ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of requirements, target architecture, and scope..."
              className={`w-full px-3.5 py-2 bg-slate-800/60 border rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                errors.description ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Grid row: Owner, Status, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Owner
              </label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.name} className="bg-slate-900">
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Planning" className="bg-slate-900">Planning</option>
                <option value="In Progress" className="bg-slate-900">In Progress</option>
                <option value="In Review" className="bg-slate-900">In Review</option>
                <option value="Completed" className="bg-slate-900">Completed</option>
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
          </div>

          {/* Grid row: Dates & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-800/60 border rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  errors.dueDate ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.dueDate && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Progress
                </label>
                <span className="text-xs font-mono text-indigo-400 font-bold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-700 rounded-lg mt-2"
              />
            </div>
          </div>

          {/* Repository & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Linked GitHub Repository
              </label>
              <select
                value={repositoryId}
                onChange={(e) => setRepositoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="" className="bg-slate-900">None</option>
                {repositories.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900">
                    {r.fullName} ({r.language})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tags / Labels (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="kubernetes, microservices, aws"
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Team Members Multi-select */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Assign Team Members
            </label>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <button
                    type="button"
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                        : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                      {member.avatar}
                    </span>
                    <span>{member.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
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
              {projectToEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
