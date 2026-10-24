'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

export default function TaskDistributionChart({ statusData = [], priorityData = [] }) {
  const [viewType, setViewType] = useState('status'); // 'status' | 'priority'
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Loading chart...
      </div>
    );
  }

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-slate-200">{data.name}</p>
          <p className="text-slate-400 mt-0.5">
            Count: <span className="font-bold text-white">{data.value}</span>
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
          <h3 className="text-sm font-semibold text-slate-200">Task Breakdown</h3>
          <p className="text-xs text-slate-400 mt-0.5">Distribution across states & severity</p>
        </div>

        {/* View toggle tabs */}
        <div className="flex items-center p-1 bg-slate-800/60 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewType('status')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              viewType === 'status'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            By Status
          </button>
          <button
            onClick={() => setViewType('priority')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              viewType === 'priority'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            By Priority
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[240px] pt-4 flex flex-col justify-center">
        {statusData.every((d) => (d.value || 0) === 0) ? (
          <div className="h-[220px] flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
            <p className="text-xs font-medium text-slate-300">No tasks recorded yet</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
              Create sprint tasks or platform tickets to view interactive status and priority breakdowns.
            </p>
          </div>
        ) : viewType === 'status' ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs">
                        <p className="font-semibold text-slate-200">{payload[0].payload.name} Priority</p>
                        <p className="text-slate-400 mt-0.5">
                          Tasks: <span className="font-bold text-white">{payload[0].value}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
