import os
import requests
from flask import Blueprint, request, jsonify
from firebase_admin import db
from .auth import verify_token  # Your existing token verification function
from datetime import datetime

suggestions_bp = Blueprint('suggestions', __name__)
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')

def get_current_season():
    month = datetime.now().month
    if month in [12, 1, 2]:
        return 'winter'
    elif month in [3, 4, 5]:
        return 'spring'
    elif month in [6, 7, 8]:
        return 'summer'
    else:
        return 'fall'

def get_groq_suggestions(prompt: str) -> str:
    url = 'https://api.groq.com/openai/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'model': 'llama-3.3-70b-versatile',
        'messages': [
            {'role': 'system', 'content': (
                "You are a helpful assistant suggesting grocery items. "
                "Include seasonal and trending products, categorize items, "
                "and suggest quantities as needed."
            )},
            {'role': 'user', 'content': prompt}
        ],
        'max_tokens': 200
    }
    response = requests.post(url, headers=headers, json=data)
    if response.ok:
        return response.json()['choices'][0]['message']['content']
    else:
        print('Groq API error:', response.status_code, response.text)
        return f'Error: {response.status_code} {response.text}'

@suggestions_bp.route('/suggestions', methods=['POST'])
def suggestions():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token[7:]
    else:
        return jsonify({'error': 'Authorization token required'}), 401

    uid = verify_token(token)
    if not uid:
        return jsonify({'error': 'Invalid token'}), 401

    # Get current season
    season = get_current_season()

    # Fetch user's cart items from Firebase
    cart_ref = db.reference(f'carts/{uid}')
    cart = cart_ref.get() or {}

    # Prepare cart summary string
    cart_items_list = [f"{item.get('quantity',1)} x {item.get('name', 'unknown')}" for item in cart.values()]
    cart_summary = ", ".join(cart_items_list) if cart_items_list else "no items"

    # Use the incoming prompt from the user (optional, or you can build your own)
    data = request.get_json(silent=True) or {}
    user_prompt = data.get('prompt', '').strip() or "Suggest grocery items"

    # Construct prompt with cart and season context
    prompt = (
        f"The user currently has {cart_summary} in their cart. "
        f"It is {season} season. "
        f"Based on this, {user_prompt}."
    )

    suggestions_text = get_groq_suggestions(prompt)
    return jsonify({'suggestions': suggestions_text})
