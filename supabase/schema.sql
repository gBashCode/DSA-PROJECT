-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar text,
  bio text,
  created_at timestamptz default now()
);

-- User progress (solved, bookmarked, notes)
create table public.user_progress (
  user_id uuid references auth.users(id) on delete cascade,
  problem_id text not null,
  solved boolean default false,
  bookmarked boolean default false,
  notes text default '',
  updated_at timestamptz default now(),
  primary key (user_id, problem_id)
);

-- Session history (daily stats)
create table public.session_history (
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  problems_solved int default 0,
  time_spent_seconds int default 0,
  streak int default 0,
  primary key (user_id, date)
);

-- Mock interview sessions
create table public.interview_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date timestamptz default now(),
  difficulty text not null,
  total_problems int not null,
  solved_problems int default 0,
  score int default 0,
  duration int default 0
);

-- Spaced repetition data
create table public.srs_data (
  user_id uuid references auth.users(id) on delete cascade,
  problem_id text not null,
  interval int default 1,
  ease_factor float default 2.5,
  repetitions int default 0,
  next_review timestamptz,
  last_review timestamptz,
  primary key (user_id, problem_id)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.session_history enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.srs_data enable row level security;

-- Policies: Users can only access their own data
create policy "Users can view own profile" on profiles for select using (auth.uid() = user_id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = user_id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = user_id);

create policy "Users can view own progress" on user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on user_progress for update using (auth.uid() = user_id);
create policy "Users can delete own progress" on user_progress for delete using (auth.uid() = user_id);

create policy "Users can view own sessions" on session_history for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on session_history for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on session_history for update using (auth.uid() = user_id);

create policy "Users can view own interviews" on interview_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own interviews" on interview_sessions for insert with check (auth.uid() = user_id);

create policy "Users can view own srs" on srs_data for select using (auth.uid() = user_id);
create policy "Users can insert own srs" on srs_data for insert with check (auth.uid() = user_id);
create policy "Users can update own srs" on srs_data for update using (auth.uid() = user_id);
create policy "Users can delete own srs" on srs_data for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, username, display_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();