import React from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityBadge from '@/components/ui/PriorityBadge';
import { formatDate } from '@/lib/utils';
import { ArrowRight, FolderGit2 } from 'lucide-react';

export default function RecentProjectsTable({ projects = [] }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Active Projects</h3>
          <p className="text-xs text-slate-400 mt-0.5">Key initiatives and completion progress</p>
        </div>
        <Link
          href="/projects"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/60 text-slate-400 font-medium">
              <th className="py-3 px-3">Project</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Progress</th>
              <th className="py-3 px-3">Due Date</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No projects available.
                </td>
              </tr>
            ) : (
              projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                        <FolderGit2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1"
                        >
                          {project.name}
                        </Link>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{project.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="py-3 px-3">
                    <PriorityBadge priority={project.priority} />
                  </td>
                  <td className="py-3 px-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 w-8 text-right">
                        {project.progress || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {formatDate(project.dueDate)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/projects/${project.id}`}
                      className="p-1.5 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="View Project"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
