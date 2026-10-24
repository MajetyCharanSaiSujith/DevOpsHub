import React from 'react';
import { formatDate, formatDateTime, formatRelativeTime, DEPLOYMENT_STATUS_COLORS } from '@/lib/utils';
import {
  Rocket,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  GitBranch,
  ExternalLink,
} from 'lucide-react';

export default function DeploymentTable({ deployments = [] }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Failed':
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'Running':
        return <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />;
      case 'Queued':
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getEnvBadge = (env) => {
    switch (env) {
      case 'Production':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Preview':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Development':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800/80 text-slate-400 font-medium">
            <th className="py-3 px-3">Service / Release</th>
            <th className="py-3 px-3">Environment</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3">Branch & Commit</th>
            <th className="py-3 px-3">Triggered By</th>
            <th className="py-3 px-3">Duration</th>
            <th className="py-3 px-3 text-right">Started</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40">
          {deployments.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-slate-400">
                <Rocket className="w-6 h-6 mx-auto mb-2 text-slate-400 opacity-60" />
                <p className="text-xs font-medium text-slate-300">No deployment records yet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Trigger an automated CI/CD release build to start monitoring deployments.
                </p>
              </td>
            </tr>
          ) : (
            deployments.map((dep) => {
              const statusCfg = DEPLOYMENT_STATUS_COLORS[dep.status] || {};

              return (
                <tr key={dep.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        <Rocket className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span>{dep.name}</span>
                        <p className="text-[10px] text-slate-400 font-normal">
                          {dep.projectName}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${getEnvBadge(
                        dep.environment
                      )}`}
                    >
                      {dep.environment}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                        statusCfg.badge || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {getStatusIcon(dep.status)}
                      {dep.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-slate-400">
                        <GitBranch className="w-3 h-3 text-slate-400" />
                        {dep.branch}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-800/80 rounded border border-slate-700 text-slate-400">
                        {dep.commit}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-300">{dep.author}</td>

                  <td className="py-3 px-3 font-mono text-slate-400">{dep.duration}</td>

                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    {formatRelativeTime(dep.startedAt)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
