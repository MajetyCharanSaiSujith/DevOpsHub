'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectListItem from '@/components/projects/ProjectListItem';
import ProjectModal from '@/components/projects/ProjectModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  ArrowUpDown,
  FolderGit2,
} from 'lucide-react';

export default function ProjectsPage() {
  const {
    projects,
    members,
    repositories,
    deleteProject,
    searchQuery: globalSearch,
  } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'progress' | 'name'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const query = (localSearch || globalSearch || '').toLowerCase();

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.owner.toLowerCase().includes(query) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)));

        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || p.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        }
        if (sortBy === 'progress') {
          return (b.progress || 0) - (a.progress || 0);
        }
        if (sortBy === 'priority') {
          const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return (rank[b.priority] || 0) - (rank[a.priority] || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [projects, query, statusFilter, priorityFilter, sortBy]);

  const handleEdit = (project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects & Platform Initiatives"
        description="Track roadmaps, sprint goals, and cross-functional infrastructure epics."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Projects' }]}
        action={
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter projects..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="all" className="bg-slate-900">All Statuses</option>
            <option value="Planning" className="bg-slate-900">Planning</option>
            <option value="In Progress" className="bg-slate-900">In Progress</option>
            <option value="In Review" className="bg-slate-900">In Review</option>
            <option value="Completed" className="bg-slate-900">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="all" className="bg-slate-900">All Priorities</option>
            <option value="Critical" className="bg-slate-900">Critical</option>
            <option value="High" className="bg-slate-900">High</option>
            <option value="Medium" className="bg-slate-900">Medium</option>
            <option value="Low" className="bg-slate-900">Low</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none"
            >
              <option value="dueDate" className="bg-slate-900">Sort: Due Date</option>
              <option value="priority" className="bg-slate-900">Sort: Priority</option>
              <option value="progress" className="bg-slate-900">Sort: Progress</option>
              <option value="name" className="bg-slate-900">Sort: Name</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-800/60 rounded-xl border border-slate-700/80 self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title={projects.length === 0 ? "No projects in your workspace yet" : "No projects match your filter"}
          description={
            projects.length === 0
              ? "Create your first platform initiative or sprint project to begin managing tasks, deliverables, and tracking velocity."
              : "Try clearing your search query or status filter to see other initiatives."
          }
          actionLabel="Create Project"
          onAction={handleCreate}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              members={members}
              repositories={repositories}
              onEdit={handleEdit}
              onDelete={(p) => setProjectToDelete(p)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              members={members}
              repositories={repositories}
              onEdit={handleEdit}
              onDelete={(p) => setProjectToDelete(p)}
            />
          ))}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!projectToDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? All related tasks and milestones will be removed.`}
        confirmText="Delete Project"
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }
        }}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
}
