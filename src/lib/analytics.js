// Dynamic analytics and calculation functions from live application state

export function calculateDashboardStats(projects = [], tasks = [], deployments = []) {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const planningProjects = projects.filter(p => p.status === 'Planning').length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const inReviewTasks = tasks.filter(t => t.status === 'In Review').length;
  const todoTasks = tasks.filter(t => t.status === 'Todo').length;
  const openTasks = totalTasks - completedTasks;

  const totalDeployments = deployments.length;
  const successfulDeployments = deployments.filter(d => d.status === 'Success').length;
  const failedDeployments = deployments.filter(d => d.status === 'Failed').length;
  const runningDeployments = deployments.filter(d => d.status === 'Running').length;
  const queuedDeployments = deployments.filter(d => d.status === 'Queued').length;

  const finishedDeployments = successfulDeployments + failedDeployments;
  const deploymentSuccessRate = finishedDeployments > 0
    ? Math.round((successfulDeployments / finishedDeployments) * 100)
    : 100;

  const averageProjectProgress = totalProjects > 0
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects)
    : 0;

  // Task Distribution by Status
  const taskStatusDistribution = [
    { name: 'Todo', value: todoTasks, color: '#64748b' },
    { name: 'In Progress', value: inProgressTasks, color: '#6366f1' },
    { name: 'In Review', value: inReviewTasks, color: '#f59e0b' },
    { name: 'Done', value: completedTasks, color: '#10b981' },
  ];

  // Task Distribution by Priority
  const taskPriorityDistribution = [
    { name: 'Low', count: tasks.filter(t => t.priority === 'Low').length, fill: '#64748b' },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'Medium').length, fill: '#3b82f6' },
    { name: 'High', count: tasks.filter(t => t.priority === 'High').length, fill: '#f97316' },
    { name: 'Critical', count: tasks.filter(t => t.priority === 'Critical').length, fill: '#ef4444' },
  ];

  // Weekly Activity Trend (Simulated based on actual counts)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyActivity = days.map((day, idx) => {
    // Distribute actual task and deployment metrics across days with deterministic variation
    const baseCompleted = Math.max(1, Math.round((completedTasks / 7) * (0.8 + (idx * 0.1))));
    const baseCreated = Math.max(1, Math.round((totalTasks / 7) * (0.7 + ((6 - idx) * 0.1))));
    const baseDeployments = Math.max(0, Math.round((successfulDeployments / 7) * (0.5 + (idx % 3) * 0.4)));

    return {
      day,
      completed: baseCompleted,
      created: baseCreated,
      deployments: baseDeployments,
    };
  });

  // Upcoming Deadlines (not Done, sorted by dueDate)
  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'Done' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return {
    totalProjects,
    completedProjects,
    inProgressProjects,
    planningProjects,
    averageProjectProgress,
    totalTasks,
    openTasks,
    todoTasks,
    inProgressTasks,
    inReviewTasks,
    completedTasks,
    totalDeployments,
    successfulDeployments,
    failedDeployments,
    runningDeployments,
    queuedDeployments,
    deploymentSuccessRate,
    taskStatusDistribution,
    taskPriorityDistribution,
    weeklyActivity,
    upcomingDeadlines,
  };
}
