'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastStack() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-indigo-400" />;
        let border = 'border-indigo-500/30';
        let bg = 'bg-slate-900/95';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
          border = 'border-emerald-500/30';
        } else if (toast.type === 'warning' || toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-400" />;
          border = 'border-rose-500/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${border} ${bg} backdrop-blur-md shadow-2xl text-sm transition-all transform translate-y-0`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 text-slate-200">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
