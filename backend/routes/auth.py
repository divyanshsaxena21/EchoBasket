from flask import Blueprint, request, jsonify
from firebase_admin import auth

auth_bp = Blueprint('auth', __name__)

# Helper: Verify Firebase ID Token
def verify_token(token):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception:
        return None

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    try:
        user = auth.create_user(email=email, password=password)
        return jsonify({'uid': user.uid}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    return jsonify({'error': 'Use Firebase client SDK for login'}), 400

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'error': 'Logout is handled client-side'}), 400
