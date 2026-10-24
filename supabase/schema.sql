-- DevOpsHub Supabase Schema & Row Level Security (RLS)
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'DevOps Engineer',
  department TEXT DEFAULT 'Platform Engineering',
  avatar TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, avatar)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'DevOps Engineer'),
    UPPER(SUBSTRING(COALESCE(new.raw_user_meta_data->>'name', new.email) FROM 1 FOR 2))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  owner TEXT,
  status TEXT DEFAULT 'Planning',
  priority TEXT DEFAULT 'Medium',
  progress INTEGER DEFAULT 0,
  start_date DATE,
  due_date DATE,
  repository_id TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
  ON public.projects FOR ALL
  USING (auth.uid() = user_id);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  project_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Todo',
  priority TEXT DEFAULT 'Medium',
  assignee TEXT,
  due_date DATE,
  labels TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks"
  ON public.tasks FOR ALL
  USING (auth.uid() = user_id);

-- 4. Repositories Table
CREATE TABLE IF NOT EXISTS public.repositories (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  default_branch TEXT DEFAULT 'main',
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own repositories"
  ON public.repositories FOR ALL
  USING (auth.uid() = user_id);

-- 5. Deployments Table
CREATE TABLE IF NOT EXISTS public.deployments (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  project_id TEXT,
  name TEXT NOT NULL,
  project_name TEXT,
  environment TEXT NOT NULL,
  status TEXT DEFAULT 'Queued',
  branch TEXT DEFAULT 'main',
  commit TEXT,
  author TEXT,
  duration TEXT DEFAULT 'Pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own deployments"
  ON public.deployments FOR ALL
  USING (auth.uid() = user_id);

-- 6. Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  user_name TEXT,
  description TEXT NOT NULL,
  related_entity_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own activities"
  ON public.activities FOR ALL
  USING (auth.uid() = user_id);
