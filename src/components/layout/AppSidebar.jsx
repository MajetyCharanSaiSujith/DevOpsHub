'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Kanban,
  GitFork,
  Rocket,
  Activity,
  Settings,
  Terminal,
  X,
} from 'lucide-react';

export default function AppSidebar({ isMobileOpen = false, onCloseMobile = () => {} }) {
  const pathname = usePathname();
  const { tasks, deployments, profile } = useApp();

  const openTasksCount = tasks.filter((t) => t.status !== 'Done').length;
  const runningDeploymentsCount = deployments.filter((d) => d.status === 'Running').length;

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderGit2 },
    {
      label: 'My Tasks',
      href: '/tasks',
      icon: CheckSquare,
      badge: openTasksCount > 0 ? openTasksCount : null,
    },
    { label: 'Kanban Board', href: '/kanban', icon: Kanban },
    { label: 'Repositories', href: '/repositories', icon: GitFork },
    {
      label: 'Deployments',
      href: '/deployments',
      icon: Rocket,
      badge: runningDeploymentsCount > 0 ? `${runningDeploymentsCount} live` : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse',
    },
    { label: 'Activity', href: '/activity', icon: Activity },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#090d16] border-r border-slate-800/80 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-tight">DevOps</span>
              <span className="font-extrabold text-base text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Hub</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">COLLAB PLATFORM</p>
          </div>
        </Link>
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    item.badgeColor || (isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Preview */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'AR'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">{profile.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
