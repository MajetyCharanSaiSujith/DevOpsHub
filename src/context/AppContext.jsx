'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_REPOSITORIES,
  INITIAL_DEPLOYMENTS,
  INITIAL_ACTIVITIES,
  INITIAL_USER_PROFILE,
} from '@/data/initialData';
import { supabase } from '@/lib/supabase';
import { generateId } from '@/lib/utils';

const AppContext = createContext(null);

const DEMO_STORAGE_KEY = 'devopshub_state_v1';

export function AppProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState(null); // { id, email, name, role, isDemo }
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [profile, setProfile] = useState(INITIAL_USER_PROFILE);
  const [theme, setThemeState] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Determine active storage key based on user
  const getActiveStorageKey = useCallback((currentUser) => {
    if (!currentUser) return null;
    if (currentUser.isDemo) return DEMO_STORAGE_KEY;
    return `devopshub_user_${currentUser.id}`;
  }, []);

  // Load user data
  const loadUserData = useCallback((currentUser) => {
    if (typeof window === 'undefined') return;

    if (!currentUser) {
      setProjects([]);
      setTasks([]);
      setRepositories([]);
      setDeployments([]);
      setActivities([]);
      return;
    }

    const key = currentUser.isDemo ? DEMO_STORAGE_KEY : `devopshub_user_${currentUser.id}`;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setProjects(parsed.projects || []);
        setTasks(parsed.tasks || []);
        setRepositories(parsed.repositories || []);
        setDeployments(parsed.deployments || []);
        setActivities(parsed.activities || []);
        if (parsed.profile) setProfile(parsed.profile);
      } else {
        // If demo user and first visit, populate sample data
        if (currentUser.isDemo) {
          setProjects(INITIAL_PROJECTS);
          setTasks(INITIAL_TASKS);
          setRepositories(INITIAL_REPOSITORIES);
          setDeployments(INITIAL_DEPLOYMENTS);
          setActivities(INITIAL_ACTIVITIES);
          setProfile(INITIAL_USER_PROFILE);
        } else {
          // NEW USER: Start with 100% CLEAN WORKSPACE (no dummy data)
          setProjects([]);
          setTasks([]);
          setRepositories([]);
          setDeployments([]);
          setActivities([
            {
              id: generateId('act'),
              type: 'workspace_initialized',
              user: currentUser.name || currentUser.email,
              description: 'initialized a clean DevOpsHub workspace',
              timestamp: new Date().toISOString(),
            },
          ]);
          setProfile({
            name: currentUser.name || currentUser.email.split('@')[0],
            email: currentUser.email,
            role: currentUser.role || 'DevOps Engineer',
            department: 'Platform Engineering',
            theme: 'dark',
            defaultTaskFilter: 'all',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load user state:', err);
    }
  }, []);

  // Check auth session on startup
  useEffect(() => {
    async function initAuth() {
      // Check stored session
      if (typeof window !== 'undefined') {
        const isDemoActive = window.localStorage.getItem('devopshub_active_demo_session');
        if (isDemoActive === 'true') {
          const demoUser = {
            id: 'demo-alex-rivera',
            email: 'alex.rivera@devopshub.io',
            name: 'Alex Rivera',
            role: 'Staff SRE & Platform Lead',
            isDemo: true,
          };
          setUser(demoUser);
          loadUserData(demoUser);
          setIsLoaded(true);
          return;
        }
      }

      // Check Supabase session
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const supaUser = data.session.user;
        const mappedUser = {
          id: supaUser.id,
          email: supaUser.email,
          name: supaUser.user_metadata?.name || supaUser.email.split('@')[0],
          role: supaUser.user_metadata?.role || 'DevOps Engineer',
          isDemo: false,
        };
        setUser(mappedUser);
        loadUserData(mappedUser);
      } else {
        // No session: require authentication and start with zero dummy data
        setUser(null);
        setProjects([]);
        setTasks([]);
        setRepositories([]);
        setDeployments([]);
        setActivities([]);
      }
      setIsLoaded(true);
    }

    initAuth();
  }, [loadUserData]);

  // Persist current state to user-scoped key
  useEffect(() => {
    if (!isLoaded || !user) return;
    const key = getActiveStorageKey(user);
    if (!key || typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          projects,
          tasks,
          repositories,
          deployments,
          activities,
          profile,
        })
      );
    } catch (err) {
      console.error('Failed to save state:', err);
    }
  }, [isLoaded, user, projects, tasks, repositories, deployments, activities, profile, getActiveStorageKey]);

  // Read saved theme on startup, default to dark
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = window.localStorage.getItem('devopshub_theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setThemeState(storedTheme);
      } else {
        setThemeState('dark');
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Auth Operations
  const login = async (email, password) => {
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (res.data?.user) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('devopshub_active_demo_session');
      }
      const supaUser = res.data.user;
      const loggedUser = {
        id: supaUser.id,
        email: supaUser.email,
        name: supaUser.user_metadata?.name || supaUser.email.split('@')[0],
        role: supaUser.user_metadata?.role || 'DevOps Engineer',
        isDemo: false,
      };
      setUser(loggedUser);
      loadUserData(loggedUser);
      addToast(`Welcome back, ${loggedUser.name}!`, 'success');
      return { user: loggedUser, error: null };
    }
    return { user: null, error: res.error };
  };

  const signup = async (email, password, metadata = {}) => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (res.data?.user) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('devopshub_active_demo_session');
      }
      const supaUser = res.data.user;
      const newUser = {
        id: supaUser.id,
        email: supaUser.email,
        name: metadata.name || supaUser.email.split('@')[0],
        role: metadata.role || 'DevOps Engineer',
        isDemo: false,
      };
      setUser(newUser);
      loadUserData(newUser); // Cleans workspace completely!
      addToast(`Account created! Welcome to your clean workspace, ${newUser.name}.`, 'success');
      return { user: newUser, error: null };
    }
    return { user: null, error: res.error };
  };

  const loginAsDemo = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('devopshub_active_demo_session', 'true');
    }
    const demoUser = {
      id: 'demo-alex-rivera',
      email: 'alex.rivera@devopshub.io',
      name: 'Alex Rivera',
      role: 'Staff SRE & Platform Lead',
      isDemo: true,
    };
    setUser(demoUser);
    loadUserData(demoUser);
    addToast('Logged in as Demo User with sample data.', 'info');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('devopshub_active_demo_session');
    }
    setUser(null);
    setProjects([]);
    setTasks([]);
    setRepositories([]);
    setDeployments([]);
    setActivities([]);
    addToast('Signed out.', 'info');
  };

  // Option for clean users to load starter data if desired
  const loadStarterSampleData = () => {
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setRepositories(INITIAL_REPOSITORIES);
    setDeployments(INITIAL_DEPLOYMENTS);
    setActivities(INITIAL_ACTIVITIES);
    addToast('Starter sample data loaded into your workspace.', 'info');
  };

  // Activity logger
  const logActivity = useCallback((type, description, relatedEntityId = null) => {
    const newActivity = {
      id: generateId('act'),
      type,
      user: profile.name || user?.name || 'Current User',
      description,
      timestamp: new Date().toISOString(),
      relatedEntityId,
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 49)]);
  }, [profile.name, user?.name]);

  // Project Actions
  const addProject = useCallback((projectData) => {
    const newProj = {
      ...projectData,
      id: generateId('proj'),
      progress: Number(projectData.progress) || 0,
      members: projectData.members && projectData.members.length ? projectData.members : ['usr-1'],
      tags: projectData.tags || [],
    };
    setProjects((prev) => [newProj, ...prev]);
    logActivity('project_created', `created project "${newProj.name}"`, newProj.id);
    addToast(`Project "${newProj.name}" created successfully.`, 'success');
    return newProj;
  }, [logActivity, addToast]);

  const updateProject = useCallback((id, updates) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          logActivity('project_updated', `updated project "${updated.name}"`, id);
          return updated;
        }
        return p;
      })
    );
    addToast('Project updated successfully.', 'info');
  }, [logActivity, addToast]);

  const deleteProject = useCallback((id) => {
    const proj = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    logActivity('project_deleted', `deleted project "${proj ? proj.name : id}"`, id);
    addToast('Project deleted.', 'warning');
  }, [projects, logActivity, addToast]);

  // Task Actions
  const addTask = useCallback((taskData) => {
    const newTask = {
      ...taskData,
      id: generateId('task'),
      labels: Array.isArray(taskData.labels)
        ? taskData.labels
        : taskData.labels
        ? taskData.labels.split(',').map((s) => s.trim())
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    logActivity('task_created', `created task "${newTask.title}"`, newTask.id);
    addToast(`Task "${newTask.title}" added.`, 'success');
    return newTask;
  }, [logActivity, addToast]);

  const updateTask = useCallback((id, updates) => {
    let taskName = '';
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          taskName = updates.title || t.title;
          return {
            ...t,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
    logActivity('task_updated', `updated task "${taskName || id}"`, id);
    addToast('Task updated.', 'info');
  }, [logActivity, addToast]);

  const moveTaskStatus = useCallback((taskId, newStatus) => {
    let movedTaskTitle = '';
    let oldStatus = '';
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          movedTaskTitle = t.title;
          oldStatus = t.status;
          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    if (movedTaskTitle && oldStatus !== newStatus) {
      if (newStatus === 'Done') {
        logActivity('task_completed', `completed task "${movedTaskTitle}"`, taskId);
        addToast(`Task completed! 🎉`, 'success');
      } else {
        logActivity('task_status', `moved task "${movedTaskTitle}" to ${newStatus}`, taskId);
      }
    }
  }, [logActivity, addToast]);

  const deleteTask = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    logActivity('task_deleted', `deleted task "${task ? task.title : id}"`, id);
    addToast('Task deleted.', 'warning');
  }, [tasks, logActivity, addToast]);

  // Repository Actions
  const addRepository = useCallback((repoData) => {
    const existing = repositories.find(
      (r) => r.fullName.toLowerCase() === repoData.fullName.toLowerCase()
    );
    if (existing) {
      addToast(`Repository ${repoData.fullName} is already tracked.`, 'warning');
      return existing;
    }

    const newRepo = {
      ...repoData,
      id: generateId('repo'),
      updatedAt: new Date().toISOString(),
    };
    setRepositories((prev) => [newRepo, ...prev]);
    logActivity('repository_added', `connected repository "${newRepo.fullName}"`, newRepo.id);
    addToast(`Repository "${newRepo.fullName}" added.`, 'success');
    return newRepo;
  }, [repositories, logActivity, addToast]);

  const updateRepository = useCallback((id, updates) => {
    setRepositories((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
  }, []);

  const removeRepository = useCallback((id) => {
    const repo = repositories.find((r) => r.id === id);
    setRepositories((prev) => prev.filter((r) => r.id !== id));
    logActivity('repository_removed', `removed repository "${repo ? repo.fullName : id}"`, id);
    addToast('Repository removed.', 'info');
  }, [repositories, logActivity, addToast]);

  // Deployment Actions
  const triggerDeployment = useCallback((params) => {
    const project = projects.find((p) => p.id === params.projectId);
    const newDep = {
      id: generateId('dep'),
      name: params.name || `${project ? project.name.toLowerCase().replace(/\s+/g, '-') : 'service'}-deploy`,
      projectName: project ? project.name : 'Platform Core',
      projectId: params.projectId,
      environment: params.environment || 'Development',
      status: 'Queued',
      branch: params.branch || 'main',
      commit: Math.random().toString(16).substring(2, 9),
      author: profile.name || user?.name || 'Alex Rivera',
      startedAt: new Date().toISOString(),
      duration: 'In progress',
    };

    setDeployments((prev) => [newDep, ...prev]);
    logActivity('deployment_triggered', `triggered ${newDep.environment} deployment for "${newDep.name}"`, newDep.id);
    addToast(`Deployment queued for ${newDep.environment}.`, 'info');

    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) => (d.id === newDep.id ? { ...d, status: 'Running', duration: '35s' } : d))
      );
    }, 2500);

    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) => (d.id === newDep.id ? { ...d, status: 'Success', duration: '1m 18s' } : d))
      );
      logActivity('deployment_success', `deployment "${newDep.name}" succeeded on ${newDep.environment}`, newDep.id);
      addToast(`Deployment "${newDep.name}" succeeded!`, 'success');
    }, 6000);

    return newDep;
  }, [projects, profile.name, user?.name, logActivity, addToast]);

  // Profile and Settings
  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    if (updates.theme) {
      setThemeState(updates.theme);
    }
    addToast('Settings saved successfully.', 'success');
  }, [addToast]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    setProfile((prev) => ({ ...prev, theme: newTheme }));
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('devopshub_theme', newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  // Clear workspace
  const clearWorkspace = useCallback(() => {
    setProjects([]);
    setTasks([]);
    setRepositories([]);
    setDeployments([]);
    setActivities([]);
    addToast('Workspace cleared. All records removed.', 'warning');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        isLoaded,
        user,
        isAuthenticated: !!user,
        login,
        signup,
        loginAsDemo,
        logout,
        loadStarterSampleData,
        clearWorkspace,
        projects,
        tasks,
        repositories,
        deployments,
        activities,
        members,
        profile,
        theme,
        searchQuery,
        setSearchQuery,
        notifications,
        toasts,
        addToast,
        removeToast,
        setTheme,
        toggleTheme,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        moveTaskStatus,
        deleteTask,
        addRepository,
        updateRepository,
        removeRepository,
        triggerDeployment,
        logActivity,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
