# UpGrade

A peer-to-peer tutoring marketplace for university students. Tutors post their availability and tutees post what they're looking for — both sides can browse, connect, and share study notes.

Built for the HackInTheClouds Hackathon (August 1–2).

---

## What It Does

- **Listings** — Tutors and tutees post listings with course code, rate, location, and description. Each user sees listings from the other side of the marketplace.
- **Tutor Profiles** — Browse verified tutor profiles with ratings, reviews, school, and subjects offered.
- **Reviews** — Students leave star ratings and comments on tutors after sessions.
- **Study Notes** — Users upload PDF notes to AWS S3, browseable by module code and school.
- **Auth** — Email/password sign-up and login via Supabase Auth, with role selection (Tutor / Tutee) on registration.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Flask (Python), port 5001 |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| File Storage | AWS S3 (presigned URL upload pattern) |
| Deployment | AWS EC2, PM2, Gunicorn |

---

## Project Structure

```
HackInTheClouds/
├── frontend/               # Next.js app
│   └── src/
│       ├── app/
│       │   ├── page.tsx               # Home — listings + study notes tabs
│       │   ├── tutors/                # Browse tutor profiles
│       │   │   └── [id]/              # Individual tutor profile + reviews
│       │   ├── createList/            # Create a tutor or tutee listing
│       │   ├── uploadNotes/           # Upload a PDF to S3
│       │   └── auth/
│       │       ├── login/
│       │       └── register/
│       ├── components/
│       │   ├── Header.tsx             # Navbar with role-aware links + login/logout
│       │   ├── Hero.tsx               # Landing banner with tab switcher
│       │   ├── ModuleBlocks.tsx       # Listings grid with Tutor/Tutee filter
│       │   ├── TutorProfiles.tsx      # Tutor cards grid with filters
│       │   ├── TutorSearch.tsx        # Filter bar (school, price, rating, location)
│       │   └── NotesSection.tsx       # Study notes grid from DB
│       └── lib/
│           └── supabaseClient.ts
├── backend/
│   └── app.py              # Flask API — all DB access goes through here
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql    # USERS, TUTOR_LISTING, TUTEE_LISTING, REVIEWS
│   │   ├── 002_seed.sql              # Manual seed data
│   │   ├── 003_add_usertype.sql      # Adds usertype column to USERS
│   │   └── 004_add_notes.sql         # NOTES table
│   ├── seed.py                       # Creates 50 seeded auth users with listings + reviews
│   └── seed_tutee_listings.py        # Backfill tutee listings for existing users
├── ecosystem.config.js     # PM2 config for EC2 deployment
└── deploy.sh               # EC2 deployment script
```

---

## Flask API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/listings` | All tutor + tutee listings, excludes viewer's own |
| GET | `/tutors` | All tutor profiles (deduplicated) |
| GET | `/tutor/<id>` | Single tutor profile + listings + reviews |
| POST | `/create_listing` | Create a tutor or tutee listing (auth required) |
| POST | `/reviews` | Submit a review + recalculate tutor rating (auth required) |
| GET | `/notes` | All uploaded study notes |
| POST | `/notes` | Save note metadata after S3 upload (auth required) |
| GET | `/get-s3-url` | Generate presigned S3 PUT URL for file upload |

---

## Local Development

### Prerequisites
- Node.js 20+
- Python 3.10+
- A Supabase project
- An AWS S3 bucket (`upgrade-notes-bucket`)

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Environment Variables

**`frontend/.env`**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_FLASK_URL=http://localhost:5001
NEXT_PUBLIC_S3_BASE_URL=https://upgrade-notes-bucket.s3.ap-southeast-2.amazonaws.com
```

**`backend/.env`**
```
FLASK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-2
S3_BUCKET_NAME=upgrade-notes-bucket
```

### Database Setup
Run migrations in order in the Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/003_add_usertype.sql`
3. `supabase/migrations/004_add_notes.sql`

To seed 50 users with listings and reviews:
```bash
cd supabase
python seed.py
```

---

## Deployment (AWS EC2)

```bash
ssh -i your-key.pem ubuntu@3.26.103.83
git clone <repo> HackInTheClouds
# Create .env files on the server
bash deploy.sh
```

Set `NEXT_PUBLIC_FLASK_URL=http://3.26.103.83:5001` in the server's `frontend/.env`.

Ensure EC2 Security Group allows inbound TCP on ports **3000** and **5001**.
