'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { calculateDashboardStats } from '@/lib/analytics';
import StatCard from '@/components/dashboard/StatCard';
import TaskDistributionChart from '@/components/dashboard/TaskDistributionChart';
import WeeklyActivityChart from '@/components/dashboard/WeeklyActivityChart';
import RecentProjectsTable from '@/components/dashboard/RecentProjectsTable';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import PageHeader from '@/components/ui/PageHeader';
import ProjectModal from '@/components/projects/ProjectModal';
import TaskModal from '@/components/tasks/TaskModal';
import TriggerDeploymentModal from '@/components/deployments/TriggerDeploymentModal';
import { formatRelativeTime } from '@/lib/utils';
import {
  FolderGit2,
  CheckSquare,
  Clock,
  Rocket,
  Plus,
  Activity,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, projects, tasks, deployments, activities, loadStarterSampleData } = useApp();
  const stats = calculateDashboardStats(projects, tasks, deployments);

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header with Quick Actions */}
      <PageHeader
        title="Engineering Operations Overview"
        description="Unified status of platform projects, sprint tasks, CI/CD deployment pipelines, and developer activity."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDeployOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium rounded-xl transition-colors shadow-sm"
            >
              <Rocket className="w-3.5 h-3.5 text-indigo-400" />
              Trigger Deploy
            </button>
            <button
              onClick={() => setIsNewTaskOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Task
            </button>
            <button
              onClick={() => setIsNewProjectOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              New Project
            </button>
          </div>
        }
      />

      {/* Clean Slate Onboarding Banner */}
      {projects.length === 0 && tasks.length === 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-violet-950/40 border border-indigo-500/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Active Clean Workspace • Zero Dummy Data
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                Welcome to DevOpsHub, {user?.name || 'Developer'}!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your engineering workspace has been created with a clean slate. Track projects, organize sprint tasks on the Kanban board, sync GitHub repositories, and record releases.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsNewProjectOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Create First Project
              </button>
              <Link
                href="/repositories"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-xl transition-colors"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                Connect Repo
              </Link>
              <button
                onClick={loadStarterSampleData}
                title="Populate sample projects & tasks if you want to test drive"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                Load Sample Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          description={`${stats.inProgressProjects} in flight, ${stats.completedProjects} done`}
          trend={`${stats.averageProjectProgress}% avg progress`}
          trendType="positive"
          icon={FolderGit2}
          href="/projects"
          color="indigo"
        />
        <StatCard
          title="Open Tasks"
          value={stats.openTasks}
          description={`${stats.inProgressTasks} actively being built`}
          trend={`${stats.completedTasks} completed`}
          trendType="neutral"
          icon={CheckSquare}
          href="/tasks"
          color="cyan"
        />
        <StatCard
          title="Awaiting Review"
          value={stats.inReviewTasks}
          description="Tasks pending PR approval & verification"
          trend={stats.inReviewTasks > 0 ? 'Requires attention' : 'All clear'}
          trendType={stats.inReviewTasks > 2 ? 'negative' : 'positive'}
          icon={Clock}
          href="/kanban"
          color="amber"
        />
        <StatCard
          title="Deployment Health"
          value={`${stats.deploymentSuccessRate}%`}
          description={`${stats.successfulDeployments} successful, ${stats.failedDeployments} failed`}
          trend={stats.runningDeployments > 0 ? `${stats.runningDeployments} deploying` : 'Stable'}
          trendType={stats.deploymentSuccessRate >= 80 ? 'positive' : 'negative'}
          icon={Rocket}
          href="/deployments"
          color="emerald"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityChart data={stats.weeklyActivity} />
        <TaskDistributionChart
          statusData={stats.taskStatusDistribution}
          priorityData={stats.taskPriorityDistribution}
        />
      </div>

      {/* Tables & Side-panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentProjectsTable projects={projects} />
        </div>
        <div>
          <UpcomingDeadlines tasks={stats.upcomingDeadlines} />
        </div>
      </div>

      {/* Live Activity Feed Snapshot */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Recent Platform Activity</h3>
              <p className="text-xs text-slate-400">Real-time team logs and automated deployment events</p>
            </div>
          </div>
          <Link
            href="/activity"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
          >
            Full Audit Log
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/40 mt-2">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-white">{act.user}</span>{' '}
                    <span className="text-slate-400">{act.description}</span>
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {formatRelativeTime(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals for Quick Creation from Dashboard */}
      <ProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />
      <TaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />
      <TriggerDeploymentModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
      />
    </div>
  );
}
