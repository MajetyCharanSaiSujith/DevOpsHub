'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Check,
  RotateCcw,
  User,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  Sparkles,
  Database,
  Trash2,
} from 'lucide-react';

export default function AppHeader({ onToggleMobile = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    logout,
    profile,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    clearNotifications,
    loadStarterSampleData,
    clearWorkspace,
    projects,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPageTitle = () => {
    if (pathname === '/dashboard' || pathname === '/') return 'Overview Dashboard';
    if (pathname.startsWith('/projects/')) return 'Project Details';
    if (pathname.startsWith('/projects')) return 'Projects';
    if (pathname.startsWith('/tasks')) return 'Task Management';
    if (pathname.startsWith('/kanban')) return 'Interactive Kanban Board';
    if (pathname.startsWith('/repositories')) return 'GitHub Repositories';
    if (pathname.startsWith('/deployments')) return 'Deployment Monitoring';
    if (pathname.startsWith('/activity')) return 'Activity Feed';
    if (pathname.startsWith('/settings')) return 'Workspace Settings';
    if (pathname === '/login') return 'Authentication';
    return 'DevOpsHub';
  };

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    await logout();
    router.push('/login');
  };

  const displayName = user?.name || profile.name || 'Developer';
  const displayRole = user?.role || profile.role || 'DevOps Engineer';
  const avatarInitials = displayName ? displayName.slice(0, 2).toUpperCase() : 'DH';

  return (
    <header className="h-16 px-4 md:px-8 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-200">{getPageTitle()}</h2>
            {user?.isDemo && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Demo Sandbox
              </span>
            )}
            {user && !user.isDemo && projects.length === 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Clean Workspace
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">DevOpsHub / {pathname.replace('/', '') || 'dashboard'}</p>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, or repos... (Ctrl+K)"
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-400 text-xs rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/60 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0b0f19] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-200">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-medium px-2 py-0.5 rounded-full border border-indigo-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 py-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        notif.read ? 'opacity-60 hover:bg-slate-800/30' : 'bg-slate-800/40 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-200">{notif.title}</span>
                        <span className="text-[10px] text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {avatarInitials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                <p className="text-xs font-semibold text-slate-200">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || profile.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded border ${
                      user?.isDemo
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    }`}
                  >
                    {user?.isDemo ? 'Demo Mode' : 'Cloud Authenticated'}
                  </span>
                </div>
              </div>

              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-slate-400" />
                Settings & Cloud Keys
              </Link>

              {/* Sample Data Loader (if workspace is empty or wanted) */}
              {projects.length === 0 && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    loadStarterSampleData();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Load Sample Starter Data
                </button>
              )}

              {/* Clear Workspace button */}
              {projects.length > 0 && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.confirm('Clear all projects, tasks, and deployments to start with a blank slate?')) {
                      clearWorkspace();
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear to Blank Workspace
                </button>
              )}

              {/* Sign In or Sign Out */}
              <div className="pt-1 mt-1 border-t border-slate-800/80">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
