"""
UpGrade Seed Script
Creates real Supabase auth users and seeds listings + reviews at scale.

Prerequisites:
  1. Disable email confirmation in Supabase Dashboard:
     Authentication → Settings → uncheck "Enable email confirmations"
  2. Run 001_initial_schema.sql in the SQL Editor first
  3. pip install -r backend/requirements.txt

Usage:
  cd HackInTheClouds/backend && source venv/bin/activate
  pip install faker
  cd ../supabase && python seed.py
"""

import sys
import os
import random
import time
import json

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))

from supabase import create_client
from faker import Faker

fake = Faker('en_GB')

STATE_FILE = os.path.join(os.path.dirname(__file__), 'seed_state.json')


def save_state(tutors, tutees):
    with open(STATE_FILE, 'w') as f:
        json.dump({"tutors": tutors, "tutees": tutees}, f, indent=2)


def load_state():
    with open(STATE_FILE) as f:
        data = json.load(f)
    return data["tutors"], data["tutees"]

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
PASSWORD = "Password123!"

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# ============================================================
# Data pools
# ============================================================

SCHOOLS = [
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Information Systems",
    "Bachelor of Business Management",
    "Bachelor of Accountancy",
    "Bachelor of Laws",
    "Bachelor of Social Science",
    "Bachelor of Science in Economics",
]

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

TUTOR_BIO_TEMPLATES = [
    "Year {year} {degree} student at SMU. Scored A for {course} and happy to share my approach. Patient and structured teaching style.",
    "Graduated with distinction in {degree}. Have tutored 10+ students in {course}. Sessions are exam-focused with past paper practice.",
    "Dean's List student specialising in {course}. I break down complex concepts into simple frameworks that stick.",
    "Former TA for {course}. I know exactly what professors look for and can help you avoid common mistakes.",
    "Peer tutor at SMU Learning Support. Experienced with students at all levels for {course} and related modules.",
]

TUTEE_BIO_TEMPLATES = [
    "Struggling with {course} and looking for consistent weekly sessions. Prefer someone who has taken the module before.",
    "Need help catching up on {course} after missing a few lectures. Looking for someone patient and clear.",
    "Preparing for {course} finals and want targeted practice on the harder topics. Flexible on timing.",
    "First time taking {course} and finding it tough. Looking for a tutor who can explain from the basics.",
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

AVATAR_PHOTOS_MALE = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=400&h=400&fit=crop&crop=face",
]

AVATAR_PHOTOS_FEMALE = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=400&fit=crop&crop=face",
]

REVIEW_COMMENTS = [
    "Really clear explanations. Helped me understand {course} properly for the first time.",
    "Super patient and goes at your pace. Highly recommend for {course}.",
    "Exam-focused sessions were exactly what I needed. Got a B+ after struggling all semester.",
    "Explains concepts very intuitively. The analogies used really helped me remember key ideas.",
    "Punctual, well-prepared, and genuinely helpful. Will book again for the next exam.",
    "Broke down {course} into manageable chunks. Went from failing to passing after 3 sessions.",
    "Great tutor, very knowledgeable. Would have liked more practice questions but overall solid.",
    "Helped me nail the tricky parts of {course}. Very responsive over WhatsApp too.",
    "Very systematic approach. Gave me a study plan that I actually followed.",
    "Knows the module inside out. Pointed out exactly what to focus on for the finals.",
]


def make_authed_client(email):
    session = supabase.auth.sign_in_with_password({"email": email, "password": PASSWORD})
    if not session.session:
        print(f"  Could not sign in as {email}")
        sys.exit(1)
    client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    client.auth.set_session(session.session.access_token, session.session.refresh_token)
    return client


def update_tutor_rating(client, tutor_id):
    all_reviews = client.table("REVIEWS").select("rating").eq("tutor_id", tutor_id).execute()
    if not all_reviews.data:
        return
    count = len(all_reviews.data)
    average = round(sum(r["rating"] for r in all_reviews.data) / count, 2)
    client.table("USERS").update({"rating": average, "reviews": count}).eq("id", tutor_id).execute()


# ============================================================
# Create users (skipped if seed_state.json exists)
# ============================================================

NUM_TUTORS = 35
NUM_TUTEES = 15
TOTAL = NUM_TUTORS + NUM_TUTEES

if os.path.exists(STATE_FILE):
    print(f"Found seed_state.json — skipping user creation and loading existing users.\n")
    created_tutors, created_tutees = load_state()
    # Convert lists back to tuples
    created_tutors = [tuple(t) for t in created_tutors]
    created_tutees = [tuple(t) for t in created_tutees]
    print(f"  Loaded {len(created_tutors)} tutors, {len(created_tutees)} tutees.\n")
else:
    print(f"Creating {TOTAL} users ({NUM_TUTORS} tutors, {NUM_TUTEES} tutees)...\n")

    created_tutors = []
    created_tutees = []

    for i in range(TOTAL):
        is_tutor = i < NUM_TUTORS
        gender = random.choice(["male", "female"])

        first = fake.first_name_male() if gender == "male" else fake.first_name_female()
        last = fake.last_name()
        email = f"{first.lower()}.{last.lower()}{random.randint(10,99)}@upgrade.com"
        school = random.choice(SCHOOLS)
        course_code, course_name = random.choice(COURSES)
        year = random.randint(1, 4)

        if is_tutor:
            bio_template = random.choice(TUTOR_BIO_TEMPLATES)
            bio = bio_template.format(year=year, degree=school.replace("Bachelor of ", ""), course=course_name)
            rate = str(random.randint(25, 60))
        else:
            bio_template = random.choice(TUTEE_BIO_TEMPLATES)
            bio = bio_template.format(course=course_name)

        photourl = random.choice(AVATAR_PHOTOS_MALE if gender == "male" else AVATAR_PHOTOS_FEMALE)

        # Retry sign_up with exponential backoff to handle Supabase rate limits
        for attempt in range(5):
            res = supabase.auth.sign_up({"email": email, "password": PASSWORD})
            if res.user is not None:
                break
            wait = 2 ** attempt * 10
            print(f"  Rate limited — waiting {wait}s before retry (attempt {attempt + 1}/5)...")
            time.sleep(wait)
        else:
            print(f"  FAILED to create {email} after 5 attempts — exiting.")
            sys.exit(1)

        user_id = res.user.id

        client = make_authed_client(email)
        client.table("USERS").insert({
            "id": user_id,
            "firstname": first,
            "lastname": last,
            "school": school,
            "aboutme": bio,
            "photourl": photourl,
            "rating": 0,
            "reviews": 0,
        }).execute()

        role = "tutor" if is_tutor else "tutee"
        print(f"  [{i+1}/{TOTAL}] {first} {last} ({role}) → {email}")

        if is_tutor:
            created_tutors.append((email, user_id, course_code, course_name, rate))
        else:
            created_tutees.append((email, user_id))

        # Save after every user so we can resume if interrupted
        save_state(created_tutors, created_tutees)
        time.sleep(0.5)

# ============================================================
# Create tutor listings
# ============================================================

print(f"\nCreating {NUM_TUTORS} tutor listings...")

for email, user_id, course_code, course_name, rate in created_tutors:
    client = make_authed_client(email)
    client.table("TUTOR_LISTING").insert({
        "tutorid": user_id,
        "title": f"{course_name} Tutoring — {course_code}",
        "course_code": course_code,
        "rate": rate,
        "description": f"Experienced in {course_name}. Sessions tailored to your weak areas with exam practice and concept reviews.",
        "location": random.choice(LOCATIONS),
        "photourl": random.choice(LISTING_PHOTOS),
    }).execute()
    print(f"  Listing created for {email}")
    time.sleep(0.2)

# ============================================================
# Create tutee listings (half the tutees post a listing)
# ============================================================

tutees_with_listings = random.sample(created_tutees, k=NUM_TUTEES // 2)
print(f"\nCreating {len(tutees_with_listings)} tutee listings...")

for email, user_id in tutees_with_listings:
    course_code, course_name = random.choice(COURSES)
    client = make_authed_client(email)
    client.table("TUTEE_LISTING").insert({
        "tuteeid": user_id,
        "title": f"Seeking Tutor for {course_code}",
        "course_code": course_code,
        "rate": str(random.randint(20, 35)),
        "description": f"Looking for a patient tutor for {course_name}. Prefer weekly sessions leading up to the exam.",
        "location": random.choice(LOCATIONS),
        "photourl": random.choice(LISTING_PHOTOS),
    }).execute()
    print(f"  Tutee listing created for {email}")
    time.sleep(0.2)

# ============================================================
# Seed reviews — each tutee leaves 1-3 reviews on random tutors
# ============================================================

print(f"\nSeeding reviews...")

for tutee_email, tutee_id in created_tutees:
    tutee_client = make_authed_client(tutee_email)
    reviewed_tutors = random.sample(created_tutors, k=random.randint(1, 3))

    for tutor_email, tutor_id, course_code, course_name, _ in reviewed_tutors:
        rating = random.choices([3, 4, 4, 5, 5, 5], k=1)[0]  # weighted toward 4-5 stars
        comment_template = random.choice(REVIEW_COMMENTS)
        comment = comment_template.format(course=course_name)

        tutee_client.table("REVIEWS").insert({
            "tutor_id": tutor_id,
            "student_id": tutee_id,
            "rating": rating,
            "comment": comment,
            "subject": course_code,
        }).execute()

        update_tutor_rating(tutee_client, tutor_id)
        print(f"  {tutee_email} → {tutor_email} ({rating}★)")
        time.sleep(0.2)

print(f"""
Done! Created:
  {NUM_TUTORS} tutors with listings
  {NUM_TUTEES} tutees ({len(tutees_with_listings)} with listings)
  Reviews seeded with recalculated ratings

All accounts use password: {PASSWORD}
""")
