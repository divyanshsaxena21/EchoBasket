import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth, db, storage

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Safely resolve the service account path
raw_cred_path = os.environ.get('FIREBASE_SERVICE_ACCOUNT_PATH', 'backend/firebase-service-account.json')
if not os.path.isabs(raw_cred_path):
    cred_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', raw_cred_path))
else:
    cred_path = raw_cred_path

if not os.path.exists(cred_path):
    raise FileNotFoundError(f"Firebase credential file not found at: {cred_path}")

# Load other Firebase environment variables
database_url = os.environ.get('FIREBASE_DATABASE_URL')
storage_bucket = os.environ.get('FIREBASE_STORAGE_BUCKET')
project_id = os.environ.get('FIREBASE_PROJECT_ID')

# Initialize Firebase
cred = credentials.Certificate(cred_path)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        'databaseURL': database_url,
        'storageBucket': storage_bucket,
        'projectId': project_id
    })

print("✅ Firebase initialized")
print("Service account path:", cred_path)
