
from flask import Blueprint, request, jsonify
from firebase_admin import db
from .auth import verify_token
from src.nlp_utils import CATEGORIES

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['GET'])
def get_cart():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token[7:]
    uid = verify_token(token)
    if not uid:
        return jsonify({'error': 'Invalid token'}), 401
    ref = db.reference(f'carts/{uid}')
    cart = ref.get() or {}
    return jsonify(cart)

@cart_bp.route('/cart', methods=['POST'])
def add_to_cart():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token[7:]
    uid = verify_token(token)
    if not uid:
        return jsonify({'error': 'Invalid token'}), 401
    item = request.json.get('item')
    # Categorize item
    if item:
        name = item.get('name', '').lower()
        item['category'] = CATEGORIES.get(name)
        item['quantity'] = item.get('quantity', 1)
        item['brand'] = item.get('brand')
        item['price'] = item.get('price')
        ref = db.reference(f'carts/{uid}')
        cart = ref.get() or {}
        cart[item['id']] = item
        ref.set(cart)
        return jsonify({'success': True})
    return jsonify({'error': 'No item provided'}), 400

@cart_bp.route('/cart/<item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token[7:]
    uid = verify_token(token)
    if not uid:
        return jsonify({'error': 'Invalid token'}), 401
    ref = db.reference(f'carts/{uid}/{item_id}')
    ref.delete()
    return jsonify({'success': True})

@cart_bp.route('/cart/<item_id>', methods=['PUT'])
def update_cart_item(item_id):
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token[7:]
    uid = verify_token(token)
    if not uid:
        return jsonify({'error': 'Invalid token'}), 401
    item = request.json.get('item')
    ref = db.reference(f'carts/{uid}/{item_id}')
    ref.set(item)
    return jsonify({'success': True})
