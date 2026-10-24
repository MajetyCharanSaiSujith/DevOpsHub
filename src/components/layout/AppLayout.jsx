'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import ToastStack from '@/components/ui/Toast';
import { Terminal, Lock } from 'lucide-react';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useApp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAuthPage = pathname === '/login';

  // Client-side authentication route guard
  useEffect(() => {
    if (!isLoaded) return;

    if (!user && !isAuthPage) {
      router.replace('/login');
    } else if (user && isAuthPage) {
      router.replace('/dashboard');
    }
  }, [user, isLoaded, isAuthPage, router]);

  // Initial authentication resolution screen
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 animate-pulse mb-4">
          <Terminal className="w-6 h-6" />
        </div>
        <div className="text-sm font-semibold tracking-wide text-slate-200">DevOpsHub</div>
        <div className="text-xs text-slate-400 mt-1">Verifying authentication session...</div>
      </div>
    );
  }

  // Login page layout: clean full-screen view without dashboard sidebar/header
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100">
        {children}
        <ToastStack />
      </div>
    );
  }

  // Protected route guard: if user is not authenticated, show secure redirect screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 animate-pulse">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-sm font-semibold text-slate-200">Authentication Required</div>
        <div className="text-xs text-slate-400 mt-1">Redirecting to secure login...</div>
      </div>
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Sidebar with Suspense boundary */}
      <Suspense fallback={<div className="hidden md:block w-64 h-screen bg-[#090d16] border-r border-slate-800" />}>
        <AppSidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<div className="h-16 border-b border-slate-800 bg-[#0b0f19]" />}>
          <AppHeader onToggleMobile={() => setIsMobileOpen(!isMobileOpen)} />
        </Suspense>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<div className="py-12 text-center text-xs text-slate-400">Loading view...</div>}>
            {children}
          </Suspense>
        </main>
      </div>

      {/* Toast Notification Stack */}
      <ToastStack />
    </div>
  );
}
