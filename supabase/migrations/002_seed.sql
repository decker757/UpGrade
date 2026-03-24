-- UpGrade: Seed Data
-- Run this in Supabase Dashboard → SQL Editor AFTER 001_initial_schema.sql
-- NOTE: These users are inserted directly into USERS without auth.users entries.
-- They are for display purposes only (browsing listings, reviews).
-- To test auth flows (login, create listing), register a real account via the app.


-- ============================================================
-- USERS (sample tutor + tutee profiles)
-- ============================================================
insert into "USERS" (id, firstname, lastname, school, aboutme, photourl, rating, reviews) values
  (
    '00000000-0000-0000-0000-000000000001',
    'Alice', 'Tan',
    'Bachelor of Science in Computer Science',
    'Year 3 CS student at SMU. Strong in algorithms, data structures, and Python. Happy to help with IS-coded modules.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    4.8, 12
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Ben', 'Lim',
    'Bachelor of Business Management',
    'SMU BBM Year 2. Can tutor accounting, finance, and business statistics. Former JC H2 Math student.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    4.5, 8
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Clara', 'Wong',
    'Bachelor of Accountancy',
    'SMU Accountancy Year 4. Specialise in financial accounting and audit. Have helped 20+ students pass their exams.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    4.9, 20
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'David', 'Ng',
    'Bachelor of Science in Information Systems',
    'Looking for a tutor for IS modules. Struggling with databases and web development concepts.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    0, 0
  );


-- ============================================================
-- TUTOR_LISTING
-- ============================================================
insert into "TUTOR_LISTING" (id, tutorid, title, course_code, rate, description, location, photourl) values
  (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Python & Algorithms Tutoring',
    'CS101',
    '35',
    'Covering Python fundamentals, sorting algorithms, recursion, and time complexity. Great for students preparing for coding assessments.',
    'SMU / Online',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Business Statistics & Finance',
    'STAT101',
    '30',
    'Help with hypothesis testing, regression, and financial statement analysis. Exam-focused sessions available.',
    'Zoom / City Campus',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop'
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Financial Accounting & Audit',
    'ACCT201',
    '40',
    'In-depth coverage of IFRS standards, consolidation, and audit procedures. Past year paper walkthroughs included.',
    'SMU Li Ka Shing Library',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop'
  );


-- ============================================================
-- TUTEE_LISTING
-- ============================================================
insert into "TUTEE_LISTING" (id, tuteeid, title, course_code, rate, description, location, photourl) values
  (
    'b0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    'Looking for IS Database Tutor',
    'IS112',
    '25',
    'Need help with SQL queries, ER diagrams, and normalisation. Prefer someone who has taken IS112 before.',
    'SMU / Online',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=200&fit=crop'
  );


-- ============================================================
-- REVIEWS
-- ============================================================
insert into "REVIEWS" (id, tutor_id, student_id, rating, comment, subject) values
  (
    'c0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    5,
    'Alice explained recursion in a way that finally clicked for me. Would highly recommend.',
    'CS101'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    5,
    'Clara is incredibly patient and thorough. She helped me understand consolidation accounts in one session.',
    'ACCT201'
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004',
    4,
    'Ben was helpful with stats. Could go a bit slower at times but overall great session.',
    'STAT101'
  );
