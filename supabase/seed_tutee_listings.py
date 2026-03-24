"""
Seeds tutee listings for all USERS where usertype = 'Tutee' and no TUTEE_LISTING exists yet.
Safe to re-run — skips tutees who already have a listing.

Usage:
  cd HackInTheClouds/backend && source venv/bin/activate
  cd ../supabase && python seed_tutee_listings.py
"""

import sys
import os
import random
import time

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))

from supabase import create_client

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
PASSWORD = "Password123!"

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

COURSES = [
    ("IS112", "Data Management"),
    ("IS113", "Web Application Development"),
    ("IS111", "Introduction to Programming"),
    ("CS101", "Algorithms & Data Structures"),
    ("ACCT201", "Financial Accounting"),
    ("ACCT202", "Management Accounting"),
    ("STAT101", "Business Statistics"),
    ("ECON101", "Microeconomics"),
    ("ECON102", "Macroeconomics"),
    ("FIN201", "Corporate Finance"),
    ("LAW101", "Contract Law"),
    ("MKT101", "Marketing Principles"),
    ("IS215", "Digital Innovation"),
    ("IS216", "Web Application Technologies II"),
    ("IS483", "IS Project Experience"),
]

LOCATIONS = [
    "SMU / Online", "Zoom", "SMU Li Ka Shing Library", "SMU Connexion",
    "Online only", "City area / Online", "Bugis / Online", "SMU Campus"
]

LISTING_PHOTOS = [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&h=200&fit=crop",
]

# Fetch all tutees
tutees_res = supabase.table("USERS").select("id, firstname, lastname").eq("usertype", "Tutee").execute()
tutees = tutees_res.data or []
print(f"Found {len(tutees)} tutee accounts.")

# Fetch existing tutee listings to avoid duplicates
existing_res = supabase.table("TUTEE_LISTING").select("tuteeid").execute()
existing_ids = {row["tuteeid"] for row in (existing_res.data or [])}
print(f"Already have listings for {len(existing_ids)} tutees — skipping those.\n")

to_seed = [t for t in tutees if t["id"] not in existing_ids]
print(f"Creating listings for {len(to_seed)} tutees...\n")

# Need authed clients — fetch emails from auth.users isn't possible via anon key,
# so we pull emails by matching against seed_state.json if available
import json
STATE_FILE = os.path.join(os.path.dirname(__file__), 'seed_state.json')
email_map = {}
if os.path.exists(STATE_FILE):
    with open(STATE_FILE) as f:
        state = json.load(f)
    for entry in state.get("tutees", []):
        email, user_id = entry[0], entry[1]
        email_map[user_id] = email

created = 0
skipped = 0

for tutee in to_seed:
    user_id = tutee["id"]
    email = email_map.get(user_id)

    if not email:
        print(f"  SKIP {tutee['firstname']} {tutee['lastname']} — no email found (not in seed_state.json)")
        skipped += 1
        continue

    course_code, course_name = random.choice(COURSES)

    # Sign in as the tutee to respect RLS
    session = supabase.auth.sign_in_with_password({"email": email, "password": PASSWORD})
    if not session.session:
        print(f"  SKIP {email} — could not sign in")
        skipped += 1
        continue

    client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    client.auth.set_session(session.session.access_token, session.session.refresh_token)

    client.table("TUTEE_LISTING").insert({
        "tuteeid": user_id,
        "title": f"Seeking Tutor for {course_code}",
        "course_code": course_code,
        "rate": str(random.randint(20, 35)),
        "description": f"Looking for a patient tutor for {course_name}. Prefer weekly sessions leading up to the exam.",
        "location": random.choice(LOCATIONS),
        "photourl": random.choice(LISTING_PHOTOS),
    }).execute()

    print(f"  Created listing for {tutee['firstname']} {tutee['lastname']} ({course_code})")
    created += 1
    time.sleep(0.3)

print(f"\nDone. Created {created} tutee listings, skipped {skipped}.")
