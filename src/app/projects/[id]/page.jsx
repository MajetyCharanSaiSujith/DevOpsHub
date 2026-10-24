'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ProjectModal from '@/components/projects/ProjectModal';
import TaskModal from '@/components/tasks/TaskModal';
import TaskDetailModal from '@/components/tasks/TaskDetailModal';
import { formatDate, isOverdue } from '@/lib/utils';
import {
  FolderGit2,
  Calendar,
  CheckCircle2,
  Clock,
  GitFork,
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  Rocket,
  ExternalLink,
  Users,
  AlertCircle,
} from 'lucide-react';

function ProjectDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const {
    projects,
    tasks,
    deployments,
    members,
    repositories,
    updateProject,
    deleteProject,
    moveTaskStatus,
  } = useApp();

  const project = projects.find((p) => p.id === id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  if (!project) {
    return (
      <div className="py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <FolderGit2 className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-200">Project Not Found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">The project you are looking for does not exist or was removed.</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectDeployments = deployments.filter((d) => d.projectId === project.id);
  const repo = repositories.find((r) => r.id === project.repositoryId);
  const projectMembers = members.filter((m) => project.members?.includes(m.id));

  const completedTasksCount = projectTasks.filter((t) => t.status === 'Done').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Projects', href: '/projects' },
          { label: project.name },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/projects"
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
              title="Back to list"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium rounded-xl transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        }
      />

      {/* Main Metadata Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
              {project.tags?.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono border border-slate-700"
                >
                  #{t}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed pt-1">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-800/80 text-xs shrink-0 min-w-[200px]">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Owner</span>
              <span className="font-semibold text-slate-200">{project.owner}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Timeline</span>
              <span className="font-mono text-slate-300">
                {formatDate(project.startDate)} → {formatDate(project.dueDate)}
              </span>
            </div>
            {repo && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Linked Repo</span>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  {repo.fullName}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Progress Slider */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Overall Progress</span>
            <span className="font-mono font-bold text-indigo-400 text-sm">{project.progress || 0}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Tasks & Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Related Tasks (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Project Tasks ({completedTasksCount}/{projectTasks.length} completed)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Sprint deliverables mapped to this initiative</p>
            </div>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-800/60 flex-1">
            {projectTasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No tasks assigned to this project yet. Click &quot;Add Task&quot; above to create one.
              </div>
            ) : (
              projectTasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.status);

                return (
                  <div
                    key={task.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() =>
                          moveTaskStatus(task.id, task.status === 'Done' ? 'Todo' : 'Done')
                        }
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          task.status === 'Done'
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-700 hover:border-indigo-500 text-transparent hover:text-slate-400'
                        }`}
                        title={task.status === 'Done' ? 'Mark incomplete' : 'Mark done'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="min-w-0">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className={`text-xs font-medium text-left truncate block hover:text-indigo-400 transition-colors ${
                            task.status === 'Done'
                              ? 'line-through text-slate-400'
                              : 'text-slate-200'
                          }`}
                        >
                          {task.title}
                        </button>
                        <div className="flex items-center gap-2 mt-1">
                          <PriorityBadge priority={task.priority} className="text-[9px] py-0 px-1.5" />
                          <StatusBadge status={task.status} className="text-[9px] py-0 px-1.5" />
                          {task.dueDate && (
                            <span
                              className={`text-[10px] font-mono ${
                                overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
                              }`}
                            >
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-xs text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800"
                    >
                      Details
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Team Members & Deployments (1 col) */}
        <div className="space-y-6">
          {/* Members */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Team Members ({projectMembers.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {projectMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/30">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {member.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{member.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployments for this project */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-emerald-400" />
                Recent Deployments
              </h3>
            </div>

            <div className="space-y-2">
              {projectDeployments.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">No deployments recorded yet.</p>
              ) : (
                projectDeployments.map((d) => (
                  <div key={d.id} className="p-2.5 rounded-xl bg-slate-800/30 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{d.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {d.environment}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                      <span>{d.status} • {d.duration}</span>
                      <span className="font-mono">{d.commit}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ProjectModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        projectToEdit={project}
      />

      {/* Add Task Modal pre-assigned to this project */}
      <TaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        defaultProjectId={project.id}
      />

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          taskId={selectedTask.id}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${project.name}"?`}
        confirmText="Delete Project"
        onConfirm={() => {
          deleteProject(project.id);
          router.push('/projects');
        }}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs text-slate-400">Loading project details...</div>}>
      <ProjectDetailContent />
    </Suspense>
  );
}
