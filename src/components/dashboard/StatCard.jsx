import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  description,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral'
  icon: Icon,
  href,
  color = 'indigo',
}) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:border-indigo-500/40',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20 group-hover:border-violet-500/40',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:border-amber-500/40',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:border-rose-500/40',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/40',
  };

  const cardContent = (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 tracking-wide">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border transition-colors ${colorMap[color] || colorMap.indigo}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trendType === 'positive'
                ? 'text-emerald-400'
                : trendType === 'negative'
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-xs text-slate-400 truncate">{description}</p>
      )}

      {href && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-indigo-400 transition-colors">
          <span>View details</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
