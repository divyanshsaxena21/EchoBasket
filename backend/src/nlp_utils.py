import re
from typing import Dict, Any

# Simple item categories for demo
CATEGORIES = {
    'milk': 'dairy',
    'cheese': 'dairy',
    'apple': 'produce',
    'banana': 'produce',
    'bread': 'bakery',
    'water': 'beverages',
    'snacks': 'snacks',
    'almond milk': 'dairy',
    # Add more as needed
}

# Basic NLP for command parsing

def parse_command(text: str) -> Dict[str, Any]:
    text = text.lower()
    result = {
        'intent': None,
        'item': None,
        'quantity': 1,
        'category': None,
        'action': None,
        'brand': None,
        'price': None
    }
    # Intent detection
    if any(word in text for word in ['add', 'buy', 'need', 'want']):
        result['intent'] = 'add'
        result['action'] = 'add'
    elif 'remove' in text or 'delete' in text:
        result['intent'] = 'remove'
        result['action'] = 'remove'
    elif 'find' in text or 'search' in text:
        result['intent'] = 'search'
        result['action'] = 'search'
    # Quantity extraction
    match = re.search(r'(\d+)\s*(\w+)', text)
    if match:
        result['quantity'] = int(match.group(1))
        result['item'] = match.group(2)
    else:
        # Try to find item name
        for item in CATEGORIES.keys():
            if item in text:
                result['item'] = item
                break
    # Category assignment
    if result['item'] and result['item'] in CATEGORIES:
        result['category'] = CATEGORIES[result['item']]
    # Brand extraction
    brand_match = re.search(r'brand\s+(\w+)', text)
    if brand_match:
        result['brand'] = brand_match.group(1)
    # Price extraction
    price_match = re.search(r'under\s*\$?(\d+)', text)
    if price_match:
        result['price'] = int(price_match.group(1))
    return result
