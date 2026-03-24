from flask import Flask, request, jsonify, session
from dataclasses import dataclass
import os
import boto3

from dotenv import load_dotenv
load_dotenv()

from supabase import create_client, Client

NEXT_PUBLIC_SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
NEXT_PUBLIC_SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# S3 client for generating presigned upload URLs
s3_client = boto3.client(
    's3',
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

# Base Supabase client (unauthenticated — used only for server-level reads if needed)
supabase: Client = create_client(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY')

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://3.26.103.83:3000",
    "http://3.26.103.83",
    "http://ec2-3-26-103-83.ap-southeast-2.compute.amazonaws.com:3000",
    "http://ec2-3-26-103-83.ap-southeast-2.compute.amazonaws.com",
]

@app.after_request
def add_cors(response):
    origin = request.headers.get("Origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, x-refresh-token"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

@app.route("/", defaults={"path": ""}, methods=["OPTIONS"])
@app.route("/<path:path>", methods=["OPTIONS"])
def handle_options(path):
    response = jsonify({})
    origin = request.headers.get("Origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, x-refresh-token"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response, 200

listings = []

@dataclass
class Listing:
    user_id: str
    title: str
    course_code: str
    rate: str
    description: str
    photourl: str
    location: str


@app.route('/create_listing', methods=['POST'])
def create_listing():
    data = request.get_json()

    print("Received listing payload:", data)

    # Create a user-scoped Supabase client so RLS policies are enforced.
    # The frontend passes its Supabase JWT in the Authorization and x-refresh-token headers.
    authed_client = create_client(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

    access_token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    refresh_token = request.headers.get("x-refresh-token", "").strip()

    authed_client.auth.set_session(access_token, refresh_token)

    required_fields = ['user_id', 'userType', 'title', 'course_code', 'rate', 'description', 'location', 'photourl']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required field(s)'}), 400

    user_id = data['user_id']
    user_type = data['userType']

    # Route to the correct table and FK field based on whether the user is a tutor or tutee
    is_tutor = user_type == 'Tutor'
    table_name = 'TUTOR_LISTING' if is_tutor else 'TUTEE_LISTING'
    id_field = 'tutorid' if is_tutor else 'tuteeid'

    # Fetch the user's school from the USERS table to include in the listing
    try:
        response = authed_client.table("USERS").select("school").eq("id", user_id).single().execute()
        school_data = response.data

        if not school_data or "school" not in school_data:
            print("School not found for user:", user_id)
            return jsonify({'error': 'School not found in USERS table'}), 404

        _ = school_data["school"]  # validated but not inserted — TUTOR/TUTEE_LISTING has no school column
    except Exception as e:
        print("Error fetching school:", e)
        return jsonify({'error': str(e)}), 500

    listing = {
        id_field: user_id,
        'title': data['title'],
        'course_code': data['course_code'],
        'rate': data['rate'],
        'description': data['description'],
        'location': data['location'],
        'photourl': data['photourl'],
    }

    try:
        insert_response = authed_client.table(table_name).insert(listing).execute()
        if insert_response.data:
            print("Listing created:", insert_response.data)
            return jsonify({'success': True, 'listing': insert_response.data}), 201
        else:
            print("Failed to insert listing")
            return jsonify({'error': 'Failed to insert listing'}), 500
    except Exception as e:
        print("Error inserting listing:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/listings', methods=['GET'])
def get_listings():
    try:
        viewer_id = request.args.get("viewer_id")

        tutor_res = supabase.table("TUTOR_LISTING").select("*, users:tutorid(school, rating, reviews)").order("created_at", desc=True).execute()
        tutee_res = supabase.table("TUTEE_LISTING").select("*, users:tuteeid(school, rating, reviews)").order("created_at", desc=True).execute()

        tutors = [{ **item, "id": item["tutorid"], "type": "tutor" } for item in (tutor_res.data or [])]
        tutees = [{ **item, "id": item["tuteeid"], "type": "tutee" } for item in (tutee_res.data or [])]

        combined = sorted(tutors + tutees, key=lambda x: x["created_at"], reverse=True)

        # Hide the viewer's own listings — a user shouldn't match with themselves
        if viewer_id:
            combined = [item for item in combined if item.get("id") != viewer_id]

        return jsonify(combined), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tutors', methods=['GET'])
def get_tutors():
    try:
        # Only return users who have at least one tutor listing
        res = supabase.table("TUTOR_LISTING").select("tutorid, users:tutorid(id, firstname, lastname, school, aboutme, photourl, rating, reviews)").execute()

        seen = set()
        tutors = []
        for row in (res.data or []):
            user = row.get("users")
            if user and user["id"] not in seen:
                seen.add(user["id"])
                tutors.append(user)

        return jsonify(tutors), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tutor/<tutor_id>', methods=['GET'])
def get_tutor(tutor_id):
    try:
        profile_res = supabase.table("USERS").select("*").eq("id", tutor_id).single().execute()
        if not profile_res.data:
            return jsonify({"error": "Tutor not found"}), 404

        listings_res = supabase.table("TUTOR_LISTING").select("*").eq("tutorid", tutor_id).execute()

        reviews_res = supabase.table("REVIEWS").select(
            "id, rating, comment, subject, created_at, student:student_id(firstname, lastname)"
        ).eq("tutor_id", tutor_id).order("created_at", desc=True).execute()

        return jsonify({
            "profile": profile_res.data,
            "listings": listings_res.data or [],
            "reviews": reviews_res.data or [],
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/reviews', methods=['POST'])
def submit_review():
    data = request.get_json()

    access_token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    refresh_token = request.headers.get("x-refresh-token", "").strip()

    authed_client = create_client(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
    authed_client.auth.set_session(access_token, refresh_token)

    required_fields = ['tutor_id', 'student_id', 'rating', 'comment', 'subject']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required field(s)'}), 400

    try:
        authed_client.table("REVIEWS").insert({
            "tutor_id": data["tutor_id"],
            "student_id": data["student_id"],
            "rating": int(data["rating"]),
            "comment": data["comment"],
            "subject": data["subject"],
        }).execute()

        # Recalculate average rating and update tutor's USERS row
        all_reviews = authed_client.table("REVIEWS").select("rating").eq("tutor_id", data["tutor_id"]).execute()
        count = len(all_reviews.data)
        average = round(sum(r["rating"] for r in all_reviews.data) / count, 2)
        authed_client.table("USERS").update({"rating": average, "reviews": count}).eq("id", data["tutor_id"]).execute()

        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/upload-notes', methods=['POST'])
def upload_notes():
    access_token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    refresh_token = request.headers.get("x-refresh-token", "").strip()

    authed_client = create_client(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
    authed_client.auth.set_session(access_token, refresh_token)

    file = request.files.get('file')
    user_id = request.form.get('user_id')
    title = request.form.get('title')
    subject = request.form.get('subject')
    module_code = request.form.get('module_code')
    description = request.form.get('description', '')

    if not all([file, user_id, title, subject, module_code]):
        return jsonify({'error': 'Missing required fields'}), 400

    s3_key = f"notes/{user_id}/{int(__import__('time').time() * 1000)}_{file.filename}"

    try:
        s3_client.upload_fileobj(
            file,
            os.getenv("S3_BUCKET_NAME"),
            s3_key,
            ExtraArgs={'ContentType': 'application/pdf'}
        )
    except Exception as e:
        return jsonify({'error': f'S3 upload failed: {str(e)}'}), 500

    s3_base = f"https://{os.getenv('S3_BUCKET_NAME')}.s3.{os.getenv('AWS_REGION')}.amazonaws.com"
    file_url = f"{s3_base}/{s3_key}"

    try:
        insert_response = authed_client.table("NOTES").insert({
            'user_id': user_id,
            'title': title,
            'subject': subject,
            'module_code': module_code,
            'description': description,
            'file_url': file_url,
        }).execute()

        if insert_response.data:
            return jsonify({'success': True, 'note': insert_response.data}), 201
        return jsonify({'error': 'Failed to insert note'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/notes', methods=['GET'])
def get_notes():
    try:
        res = supabase.table("NOTES").select(
            "*, uploader:user_id(firstname, lastname)"
        ).order("created_at", desc=True).execute()
        return jsonify(res.data or []), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/notes', methods=['POST'])
def create_note():
    data = request.get_json()

    access_token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    refresh_token = request.headers.get("x-refresh-token", "").strip()

    authed_client = create_client(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
    authed_client.auth.set_session(access_token, refresh_token)

    required_fields = ['user_id', 'title', 'subject', 'module_code', 'file_url']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required field(s)'}), 400

    try:
        insert_response = authed_client.table("NOTES").insert({
            'user_id':     data['user_id'],
            'title':       data['title'],
            'subject':     data['subject'],
            'module_code': data['module_code'],
            'description': data.get('description', ''),
            'file_url':    data['file_url'],
        }).execute()

        if insert_response.data:
            return jsonify({'success': True, 'note': insert_response.data}), 201
        return jsonify({'error': 'Failed to insert note'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
