from flask import Blueprint, request, jsonify
from firebase_admin import db
from routes.auth import verify_token
from src.nlp_utils import CATEGORIES

search_bp = Blueprint('search', __name__)

@search_bp.route('/search', methods=['POST'])
def search_items():
    token = request.headers.get('Authorization')
    uid = verify_token(token)
    if not uid:
        return jsonify({'error': 'Invalid token'}), 401
    query = request.json.get('query', '').lower()
    brand = request.json.get('brand')
    price = request.json.get('price')
    ref = db.reference(f'carts/{uid}')
    cart = ref.get() or {}
    results = []
    for item in cart.values():
        if query and query not in item.get('name', '').lower():
            continue
        if brand and brand.lower() != item.get('brand', '').lower():
            continue
        if price and item.get('price') and float(item['price']) > float(price):
            continue
        results.append(item)
    return jsonify({'results': results})
