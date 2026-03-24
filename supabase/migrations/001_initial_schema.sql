-- UpGrade: Initial Schema Migration
-- Run this in Supabase Dashboard → SQL Editor


-- ============================================================
-- USERS
-- ============================================================
create table if not exists "USERS" (
  id        uuid primary key references auth.users(id) on delete cascade,
  firstname text not null,
  lastname  text not null,
  school    text,
  aboutme   text,
  photourl  text,
  rating    numeric(3, 2) default 0,
  reviews   int default 0,
  created_at timestamptz default now()
);

alter table "USERS" enable row level security;

-- Anyone can read profiles
create policy "Public read USERS"
  on "USERS" for select
  using (true);

-- Users can only insert their own profile
create policy "Authenticated insert USERS"
  on "USERS" for insert
  to authenticated
  with check (auth.uid() = id);

-- Users can only update their own profile
create policy "Authenticated update USERS"
  on "USERS" for update
  to authenticated
  using (auth.uid() = id);


-- ============================================================
-- TUTOR_LISTING
-- ============================================================
create table if not exists "TUTOR_LISTING" (
  id          uuid primary key default gen_random_uuid(),
  tutorid     uuid not null references "USERS"(id) on delete cascade,
  title       text not null,
  course_code text not null,
  rate        text not null,
  description text,
  location    text,
  photourl    text,
  created_at  timestamptz default now()
);

alter table "TUTOR_LISTING" enable row level security;

-- Anyone can read tutor listings
create policy "Public read TUTOR_LISTING"
  on "TUTOR_LISTING" for select
  using (true);

-- Authenticated users can create tutor listings
create policy "Authenticated insert TUTOR_LISTING"
  on "TUTOR_LISTING" for insert
  to authenticated
  with check (auth.uid() = tutorid);


-- ============================================================
-- TUTEE_LISTING
-- ============================================================
create table if not exists "TUTEE_LISTING" (
  id          uuid primary key default gen_random_uuid(),
  tuteeid     uuid not null references "USERS"(id) on delete cascade,
  title       text not null,
  course_code text not null,
  rate        text not null,
  description text,
  location    text,
  photourl    text,
  created_at  timestamptz default now()
);

alter table "TUTEE_LISTING" enable row level security;

-- Anyone can read tutee listings
create policy "Public read TUTEE_LISTING"
  on "TUTEE_LISTING" for select
  using (true);

-- Authenticated users can create tutee listings
create policy "Authenticated insert TUTEE_LISTING"
  on "TUTEE_LISTING" for insert
  to authenticated
  with check (auth.uid() = tuteeid);


-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists "REVIEWS" (
  id         uuid primary key default gen_random_uuid(),
  tutor_id   uuid not null references "USERS"(id) on delete cascade,
  student_id uuid not null references "USERS"(id) on delete cascade,
  rating     int not null check (rating >= 1 and rating <= 5),
  comment    text,
  subject    text,
  created_at timestamptz default now()
);

alter table "REVIEWS" enable row level security;

-- Anyone can read reviews
create policy "Public read REVIEWS"
  on "REVIEWS" for select
  using (true);

-- Authenticated users can submit reviews
create policy "Authenticated insert REVIEWS"
  on "REVIEWS" for insert
  to authenticated
  with check (auth.uid() = student_id);
