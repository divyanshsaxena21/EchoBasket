
# Load .env before any other imports
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from flask import Flask
from flask_cors import CORS
from firebase import *
from routes.auth import auth_bp
from routes.cart import cart_bp
from routes.suggestions import suggestions_bp
from routes.speech import speech_bp
from routes.search import search_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(suggestions_bp)
app.register_blueprint(speech_bp)
app.register_blueprint(search_bp)

if __name__ == '__main__':
    app.run(debug=True)
