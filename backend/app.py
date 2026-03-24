from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dataclasses import dataclass
from dataclasses import asdict
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
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://52.203.210.111:3000"])

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

        school = school_data["school"]
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


@app.route('/get_listings', methods=['GET'])
def get_listings():
    return jsonify([asdict(listing) for listing in listings]), 200


@app.route('/get-s3-url', methods=['GET'])
def get_s3_url():
    file_name = request.args.get('filename')
    content_type = request.args.get('contentType')

    if not file_name or not content_type:
        return jsonify({'error': 'Missing filename or contentType'}), 400

    # Generate a short-lived presigned URL so the client can upload directly to S3
    # without routing the file through this server
    try:
        url = s3_client.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': os.getenv("S3_BUCKET_NAME"),
                'Key': file_name,
                'ContentType': content_type
            },
            ExpiresIn=60
        )
        return jsonify({'url': url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
