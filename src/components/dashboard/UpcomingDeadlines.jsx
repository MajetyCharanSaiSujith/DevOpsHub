import React from 'react';
import Link from 'next/link';
import PriorityBadge from '@/components/ui/PriorityBadge';
import { formatDate, isOverdue } from '@/lib/utils';
import { Calendar, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function UpcomingDeadlines({ tasks = [] }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Upcoming Deadlines</h3>
          <p className="text-xs text-slate-400 mt-0.5">Critical path tasks requiring attention</p>
        </div>
        <Link
          href="/tasks"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
        >
          All tasks
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-3 space-y-2.5 flex-1">
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No upcoming deadlines! All clear.
          </div>
        ) : (
          tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);

            return (
              <div
                key={task.id}
                className={`p-3 rounded-xl border transition-all ${
                  overdue
                    ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40'
                    : 'bg-slate-800/30 border-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <PriorityBadge priority={task.priority} className="text-[10px] py-0 px-1.5" />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div
                      className={`inline-flex items-center gap-1 text-[11px] font-mono ${
                        overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {overdue ? <AlertCircle className="w-3 h-3 text-rose-400" /> : <Calendar className="w-3 h-3 text-slate-400" />}
                      {formatDate(task.dueDate)}
                    </div>
                    {overdue && (
                      <p className="text-[10px] text-rose-400 font-medium">Overdue</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
