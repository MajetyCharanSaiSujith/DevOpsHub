'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function WeeklyActivityChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Loading activity metrics...
      </div>
    );
  }

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
          <p className="text-emerald-400 flex items-center justify-between gap-4">
            <span>Completed Tasks:</span>
            <span className="font-bold">{payload[0]?.value}</span>
          </p>
          <p className="text-indigo-400 flex items-center justify-between gap-4">
            <span>Created Tasks:</span>
            <span className="font-bold">{payload[1]?.value}</span>
          </p>
          <p className="text-amber-400 flex items-center justify-between gap-4">
            <span>Deployments:</span>
            <span className="font-bold">{payload[2]?.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Velocity & Deployment Trend</h3>
          <p className="text-xs text-slate-400 mt-0.5">7-day throughput of tasks and build releases</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-400">Created</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-400">Deploys</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[240px] pt-4">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDeployments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
            <Tooltip content={customTooltip} />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCompleted)"
            />
            <Area
              type="monotone"
              dataKey="created"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCreated)"
            />
            <Area
              type="monotone"
              dataKey="deployments"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDeployments)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
