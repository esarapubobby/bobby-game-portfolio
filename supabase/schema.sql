-- ==============================================================================
-- BOBBY ESARAPU — PREMIUM GAME DEVELOPER PORTFOLIO
-- Comprehensive Database Schema, RLS Security Policies, and Storage Setup
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE & HELPER FUNCTION
-- ------------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

-- Function to check if the current user is an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid()
  );
$$;

-- Policy for admin_users table
create policy "Admins can view admin_users list"
  on public.admin_users for select
  using (is_admin() or auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.projects (
  id text primary key,
  title text not null,
  category text not null,
  short_description text not null,
  detailed_description text not null,
  cover_image text not null,
  screenshots text[] default '{}',
  gameplay_video_url text,
  demo_url text,
  google_play_url text,
  itch_url text,
  github_url text,
  technologies text[] default '{}',
  status text not null default 'Completed',
  featured boolean default false,
  published boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_projects_sort_order on public.projects(sort_order asc);
create index if not exists idx_projects_published on public.projects(published);

alter table public.projects enable row level security;

-- Public can view only published projects; admins can view all (including drafts)
create policy "Public can view published projects"
  on public.projects for select
  using (published = true or is_admin());

create policy "Admins can insert projects"
  on public.projects for insert
  with check (is_admin());

create policy "Admins can update projects"
  on public.projects for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete projects"
  on public.projects for delete
  using (is_admin());

-- ------------------------------------------------------------------------------
-- 3. SKILL CATEGORIES & SKILLS TABLES
-- ------------------------------------------------------------------------------
create table if not exists public.skill_categories (
  id text primary key,
  name text not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.skill_categories enable row level security;

create policy "Public can read skill categories"
  on public.skill_categories for select
  using (true);

create policy "Admins can manage skill categories"
  on public.skill_categories for all
  using (is_admin())
  with check (is_admin());

create table if not exists public.skills (
  id text primary key,
  category_id text not null references public.skill_categories(id) on delete cascade,
  name text not null,
  highlight boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_skills_category on public.skills(category_id);
create index if not exists idx_skills_sort_order on public.skills(sort_order asc);

alter table public.skills enable row level security;

create policy "Public can read skills"
  on public.skills for select
  using (true);

create policy "Admins can manage skills"
  on public.skills for all
  using (is_admin())
  with check (is_admin());

-- ------------------------------------------------------------------------------
-- 4. EXPERIENCE TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.experience (
  id text primary key,
  company text not null,
  role text not null,
  duration text not null,
  location text,
  description text not null,
  achievements text[] default '{}',
  technologies text[] default '{}',
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.experience enable row level security;

create policy "Public can read experience"
  on public.experience for select
  using (true);

create policy "Admins can manage experience"
  on public.experience for all
  using (is_admin())
  with check (is_admin());

-- ------------------------------------------------------------------------------
-- 5. EDUCATION TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.education (
  id text primary key,
  institution text not null,
  degree text not null,
  field text not null,
  duration text not null,
  location text not null,
  details text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.education enable row level security;

create policy "Public can read education"
  on public.education for select
  using (true);

create policy "Admins can manage education"
  on public.education for all
  using (is_admin())
  with check (is_admin());

-- ------------------------------------------------------------------------------
-- 6. SITE SETTINGS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.site_settings (
  id text primary key default 'current',
  hero_name text not null default 'BOBBY ESARAPU',
  hero_title text not null default 'UNITY GAME DEVELOPER',
  hero_quote text not null default 'Building immersive gameplay experiences, one system at a time.',
  hero_availability_text text default 'Open for Game Dev Roles & Indie Collaborations',
  about_bio_p1 text not null,
  about_bio_p2 text not null,
  about_location text not null default 'Tadepalligudem, Andhra Pradesh, India',
  contact_email text not null default 'esarapubobby@gmail.com',
  github_url text not null default 'https://github.com/esarapubobby',
  linkedin_url text not null default 'https://linkedin.com/in/bobby-esarapu-68543230',
  itch_url text default 'https://bobby-esarapu.itch.io',
  resume_url text not null default '/Bobby_Esarapu_Resume.pdf',
  accent_color text not null default 'lime',
  show_availability boolean default true,
  footer_text text not null default '© Bobby Esarapu. Built for high-performance gameplay systems & web experience.',
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;

create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

create policy "Admins can manage site settings"
  on public.site_settings for all
  using (is_admin())
  with check (is_admin());

-- ------------------------------------------------------------------------------
-- 7. CONTACT MESSAGES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) >= 2),
  email text not null check (length(email) >= 5),
  message text not null check (length(message) >= 5),
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

-- Anyone can submit a message (rate limits handled via client/edge), but CANNOT read others
create policy "Anyone can insert contact message"
  on public.contact_messages for insert
  with check (true);

-- Only verified admins can read, mark read, or delete contact messages
create policy "Only admins can view contact messages"
  on public.contact_messages for select
  using (is_admin());

create policy "Only admins can update contact messages"
  on public.contact_messages for update
  using (is_admin())
  with check (is_admin());

create policy "Only admins can delete contact messages"
  on public.contact_messages for delete
  using (is_admin());

-- ------------------------------------------------------------------------------
-- 8. STORAGE BUCKETS SETUP
-- (Run in Supabase SQL editor or configure via Storage dashboard)
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Storage policies: Public can read files
create policy "Public can view project media"
  on storage.objects for select
  using (bucket_id in ('project-media', 'documents'));

-- Only admins can upload files
create policy "Admins can upload project media and documents"
  on storage.objects for insert
  with check (bucket_id in ('project-media', 'documents') and public.is_admin());

-- Only admins can update files
create policy "Admins can update files"
  on storage.objects for update
  using (bucket_id in ('project-media', 'documents') and public.is_admin());

-- Only admins can delete files
create policy "Admins can delete files"
  on storage.objects for delete
  using (bucket_id in ('project-media', 'documents') and public.is_admin());
