import React from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import { formatDate } from '@/lib/utils';
import { FolderGit2, Calendar, GitFork, Edit2, Trash2, ArrowRight } from 'lucide-react';

export default function ProjectListItem({
  project,
  members = [],
  repositories = [],
  onEdit,
  onDelete,
}) {
  const repo = repositories.find((r) => r.id === project.repositoryId);
  const projectMembers = members.filter((m) => project.members?.includes(m.id));

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
      <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5 md:mt-0">
          <FolderGit2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/projects/${project.id}`}
              className="text-sm font-bold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1"
            >
              {project.name}
            </Link>
            <StatusBadge status={project.status} className="text-[10px] py-0 px-2" />
            <PriorityBadge priority={project.priority} className="text-[10px] py-0 px-2" />
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{project.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/60">
        {/* Progress bar */}
        <div className="w-32 hidden sm:block">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400">Progress</span>
            <span className="font-mono text-indigo-400 font-bold">{project.progress || 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Due date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(project.dueDate)}</span>
        </div>

        {/* Members */}
        <div className="flex -space-x-1.5 overflow-hidden">
          {projectMembers.map((m) => (
            <div
              key={m.id}
              title={`${m.name} (${m.role})`}
              className="inline-block w-6 h-6 rounded-full ring-2 ring-[#0b0f19] bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0"
            >
              {m.avatar}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <Link
            href={`/projects/${project.id}`}
            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="View Details"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
