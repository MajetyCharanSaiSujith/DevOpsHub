'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Rocket, AlertCircle } from 'lucide-react';

export default function TriggerDeploymentModal({ isOpen, onClose }) {
  const { projects, triggerDeployment } = useApp();

  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [environment, setEnvironment] = useState('Development');
  const [branch, setBranch] = useState('main');
  const [serviceName, setServiceName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectId) {
      setError('Please select a target project');
      return;
    }

    triggerDeployment({
      projectId,
      environment,
      branch: branch.trim() || 'main',
      name: serviceName.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Trigger Deployment</h3>
              <p className="text-xs text-slate-400">Dispatch build pipeline to target cloud cluster</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Target Project */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Project *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Environment */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Environment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Development', 'Preview', 'Production'].map((env) => (
                <button
                  type="button"
                  key={env}
                  onClick={() => setEnvironment(env)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    environment === env
                      ? env === 'Production'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                        : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                      : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          {/* Branch & Service */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Git Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main or release/v1.0"
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Custom Service Name (opt)
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. auth-gateway"
                className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5" />
              Dispatch Build
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
