# DevOpsHub — Developer Collaboration Platform

> A modern, production-grade engineering operations and developer collaboration dashboard built with **Next.js (App Router)**, **JavaScript (JSX)**, and **Tailwind CSS**.

---

## 🚀 Overview

**DevOpsHub** is a unified developer collaboration platform that bridges platform engineering, project tracking, real-time release pipelines, and GitHub codebases into a single intuitive pane of glass. Designed with a dark navy & charcoal SaaS design language, indigo-violet accents, and micro-interactions, DevOpsHub is ready for enterprise demonstrations and portfolio interviews.

---

## ✨ Features

### 1. 📊 Executive & Engineering Operations Dashboard (`/dashboard`)
- **Live Aggregated Metrics**: Dynamically calculated KPIs (Total Projects, In-Flight Tasks, Tasks Awaiting Review, CI/CD Success Rate %).
- **Interactive Velocity Trends**: 7-day throughput chart displaying created tasks, completed tasks, and deployment releases using Recharts.
- **Task Distribution Analytics**: Toggleable breakdown by sprint status and priority levels (Critical, High, Medium, Low).
- **Active Projects & Upcoming Deadlines**: Quick-action tables with progress bars and overdue date alerts.
- **Real-Time Audit Trail**: Live snapshot of platform events and deployment triggers.

### 2. 📁 Projects & Initiatives (`/projects` & `/projects/[id]`)
- **Dual View Modes**: Seamless toggle between responsive Card Grid view and detailed List view.
- **Full Project CRUD**: Create, edit, and delete initiatives with instant form validation and confirmation dialogs.
- **Dynamic Filters & Sorting**: Filter by lifecycle status (`Planning`, `In Progress`, `In Review`, `Completed`), priority, or sort by due date, progress, and title.
- **Deep-Dive Project Page (`/projects/[id]`)**:
  - Overall progress slider with real-time recalculation.
  - Sprint deliverables breakdown with one-click completion toggles.
  - Assigned team member roster with roles and avatars.
  - Linked GitHub repository cards and deployment history.

### 3. ✅ Sprint & Task Management (`/tasks`)
- **Comprehensive Task Board**: Table and card layouts featuring priority badges, overdue indicators, labels, and assignees.
- **Multi-Dimensional Filters**: Filter tasks simultaneously by status, priority, project, assignee, and overdue state.
- **Task Detail Dialog**: Inspect metadata, modify status in-place, and track creation/update timestamps.
- **Safe Persistence**: Edits and status changes sync immediately with browser LocalStorage.

### 4. 📋 Interactive Drag-and-Drop Kanban Board (`/kanban`)
- **4-Stage Workflow**: `Todo` ➔ `In Progress` ➔ `In Review` ➔ `Done`.
- **Drag-and-Drop Powered by `@dnd-kit`**:
  - Smooth card dragging with custom `DragOverlay` feedback.
  - Pointer sensor distance constraints preventing accidental drags on click.
  - Dropping directly onto columns or other cards updates the underlying task status.
- **Column-Specific Quick Add**: `+` button on every column header pre-populates task creation for that specific stage.
- **Board Search & Priority Filtering**: Quickly locate sprint tickets during standups.

### 5. 🐙 GitHub Repositories Integration (`/repositories`)
- **GitHub REST API Route Handler (`/api/github`)**: Next.js server-side route handler that queries public GitHub repositories (`facebook/react`, `vercel/next.js`, `kubernetes/kubernetes`, etc.).
- **Live Repository Metrics**: Real stars, forks, open issues count, default branch, primary language, and repository description.
- **Interactive Inspection Drawers**: On-demand fetching of the 5 most recent commits and pull requests.
- **Rate-Limit & Error Handling**: Graceful fallback and user-friendly error banners when rate limits are approached.
- **Add / Remove Tracked Repositories**: Validate inputs (`owner/repo` or full GitHub URL) with instant pre-fetch previews.

### 6. 🚀 CI/CD Release Pipelines & Deployments (`/deployments`)
- **Deployment Monitoring**: Live overview of builds across `Production`, `Preview`, and `Development` environments.
- **Status Lifecycle**: `Queued` ➔ `Running` ➔ `Success` / `Failed`.
- **Trigger Deployment Modal**: Interactive modal to dispatch builds for selected projects and branches.
- **Extensible Architecture**: Structured data models (Commit SHA, duration, trigger author, branch) ready to connect to GitHub Actions or ArgoCD webhooks.

### 7. 📜 Chronological Activity Feed (`/activity`)
- **Audit Logging**: Every project creation, task transition, deployment release, and repository connection generates an activity log entry.
- **Category Filtering**: Filter audit events by Tasks, Projects, Deployments, or Repositories.
- **Relative Timestamps**: Human-readable relative time markers (`just now`, `5m ago`, `2d ago`).

### 8. 🔐 Authentication & Clean Workspace Architecture (`/login`)
- **Route Guard Protection**: All inner application views (`/dashboard`, `/projects`, `/tasks`, `/kanban`, `/repositories`, `/deployments`, `/activity`, `/settings`) require authentication. Unauthenticated visitors are automatically redirected to `/login`.
- **Zero Dummy Data for Deployed Users**: When deployed, real users who register or sign in receive a 100% clean, pristine workspace (0 projects, 0 tasks, 0 repositories, 0 deployments) with empty-state guidance and quick actions.
- **Per-User Workspace Isolation**: Workspace state is scoped per authenticated user (`devopshub_user_${userId}`), ensuring multi-tenant data safety.
- **Supabase Cloud Auth & Database Sync**: Ready for plug-and-play cloud synchronization with Supabase. Supply project credentials via UI or `.env.local`, and run `supabase/schema.sql`.
- **Demo Sandbox Option**: Reviewers and interviewers can preview a populated demo sandbox in 1-click via the "Explore Demo Sandbox" option without creating an account.

### 9. ⚙️ Workspace Settings & Preferences (`/settings`)
- **Identity & Profile Manager**: Customize user name, email, role, and department.
- **Supabase Cloud Keys Configuration**: Configure Supabase project URL and Anon key in-browser.
- **Theme Preferences**: Toggle between Charcoal Navy (Dark) and Daylight Slate (Light) mode with root HTML styling.
- **GitHub Token Storage**: Option to supply a personal access token stored client-side for up to 5,000 requests/hour.
- **Data Portability**: Full JSON Export and JSON Import utilities for workspace state backups.
- **Clean Workspace Reset**: One-click restore to a blank workspace or sample data template.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | JavaScript (JSX) — Pure ECMAScript, NO TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Charts & Analytics** | Recharts (AreaChart, PieChart, BarChart) |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Authentication & DB** | Supabase Auth & PostgreSQL (`supabase/schema.sql`) + Local Auth Fallback |
| **State & Persistence** | React Context (`AppContext`), User-Scoped LocalStorage (`devopshub_user_${userId}`) |
| **Server-Side API** | Next.js Route Handlers (`/api/github/route.js`) |

---

## 🏗️ Architecture Overview

```text
devopshub/
├── public/
├── supabase/
│   └── schema.sql                 # Complete PostgreSQL schema, triggers & RLS policies
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout with AppProvider, SEO metadata, and Suspense
│   │   ├── page.js                # Root redirect
│   │   ├── globals.css            # Dark/Light theme tokens, glassmorphism, scrollbars
│   │   ├── login/page.jsx         # Full-screen Authentication (Sign In, Sign Up, Demo Sandbox)
│   │   ├── dashboard/page.jsx     # Overview metrics & charts with Clean Slate Onboarding
│   │   ├── projects/
│   │   │   ├── page.jsx           # Projects listing (grid & list view)
│   │   │   └── [id]/page.jsx      # Project detail & sprint view
│   │   ├── tasks/page.jsx         # Backlog & tasks management
│   │   ├── kanban/page.jsx        # Drag-and-drop Kanban board
│   │   ├── repositories/page.jsx  # GitHub repository monitor & user repo browser
│   │   ├── deployments/page.jsx   # Deployment pipelines dashboard
│   │   ├── activity/page.jsx      # Audit activity feed
│   │   ├── settings/page.jsx      # Cloud keys, profile, theme, and data backups
│   │   └── api/
│   │       └── github/route.js    # Server-side GitHub REST API proxy
│   ├── components/
│   │   ├── layout/                # AppLayout (Route Guard), AppSidebar, AppHeader
│   │   ├── dashboard/             # StatCard, Charts, RecentProjects, UpcomingDeadlines
│   │   ├── projects/              # ProjectCard, ProjectListItem, ProjectModal
│   │   ├── tasks/                 # TaskCard, TaskModal, TaskDetailModal
│   │   ├── kanban/                # KanbanBoard, KanbanColumn, KanbanItem
│   │   ├── repositories/          # RepositoryCard, AddRepoModal
│   │   ├── deployments/           # DeploymentTable, TriggerDeploymentModal
│   │   └── ui/                    # ConfirmDialog, EmptyState, StatusBadge, PriorityBadge, Toast
│   ├── context/
│   │   └── AppContext.jsx         # Centralized state provider, auth session & persistence
│   ├── lib/
│   │   ├── supabase.js            # Universal Supabase client (Auth + PostgREST DB)
│   │   ├── storage.js             # LocalStorage wrapper with error handling
│   │   ├── utils.js               # Formatting dates, relative times, and color maps
│   │   ├── analytics.js           # Dynamic metric calculations from live state
│   │   └── github.js              # Client-side GitHub API client
│   └── data/
│       └── initialData.js         # Realistic initial seed scenario for Demo Sandbox
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: `v18.17.0+` or `v20+` (tested on Node v23.10.0)
- **npm**: `v9+` or `v10+`

### 2. Installation
```bash
git clone <repository-url>
cd devopshub
npm install
```

### 3. Environment Setup (Optional)
Copy `.env.example` to `.env.local` if you wish to configure a server-side GitHub Personal Access Token:
```bash
cp .env.example .env.local
```
Add your GitHub token to raise rate limits from 60 req/hr to 5,000 req/hr:
```env
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🔌 GitHub REST API Integration

The application interfaces with GitHub's REST API through the route handler at `src/app/api/github/route.js`:
- `GET /api/github?owner=:owner&repo=:repo&type=details` — Fetches core repository statistics (stars, forks, open issues, language, description).
- `GET /api/github?owner=:owner&repo=:repo&type=commits` — Retrieves the 5 latest commits on default branch.
- `GET /api/github?owner=:owner&repo=:repo&type=pulls` — Retrieves the 5 most recent pull requests.

If rate-limits are reached, the system returns status `429` with the reset timestamp and actionable advice.

---

## 💾 LocalStorage Persistence & Data Safety

- All modifications to projects, tasks, repositories, deployments, and settings are automatically stored under the versioned key `devopshub_state_v1`.
- Safe hydration checks ensure no mismatch between Next.js server prerendering and browser rendering.
- State can be reset anytime using the **Reset to Demo Scenario** option in Settings or the Header profile menu.
- State can be exported and imported as JSON backups.

---

## 📱 Responsive Design & Accessibility

- **Desktop (1024px+)**: Full persistent sidebar, multi-column dashboard, and side-by-side Kanban columns.
- **Tablet (768px - 1024px)**: Grid collapsing, scrollable Kanban board, and responsive tables.
- **Mobile (< 768px)**: Collapsible sidebar into a drawer with overlay, touch-friendly drag handles, and adaptive card views.

---

## 🛡️ License

MIT License. Built for developer collaboration and engineering operations management.
