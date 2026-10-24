import React from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import { formatDate } from '@/lib/utils';
import { FolderGit2, Calendar, GitFork, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function ProjectCard({
  project,
  members = [],
  repositories = [],
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const repo = repositories.find((r) => r.id === project.repositoryId);
  const projectMembers = members.filter((m) => project.members?.includes(m.id));

  return (
    <div className="relative p-5 rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] hover:border-indigo-400 dark:hover:border-slate-700 transition-all hover:shadow-md flex flex-col justify-between group">
      <div>
        {/* Top bar with tags & menu */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-1 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-20 text-xs"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(project);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  Edit Project
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(project);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-base font-bold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1">
            {project.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 font-mono border border-slate-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Progress</span>
            <span className="font-mono font-bold text-indigo-400">{project.progress || 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Footer: Due date + members + repo link */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(project.dueDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            {repo && (
              <span className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white transition-colors" title={`Linked to ${repo.fullName}`}>
                <GitFork className="w-3.5 h-3.5" />
              </span>
            )}

            {/* Member Avatars */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
