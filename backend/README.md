# Instructions to run the Flask backend with Firebase

1. Install dependencies:
   pip install -r requirements.txt

2. Add your Firebase service account key file as 'firebase-service-account.json' in the backend directory.
   - Download this from your Firebase project settings > Service Accounts.

3. Set your Firebase Realtime Database URL in the environment variable FIREBASE_DATABASE_URL.
   Example: https://your-database-name.firebaseio.com/

4. Run the Flask server:
   python app.py

# Endpoints
- POST /signup: { email, password } → Creates a new user
- POST /login: (Use Firebase client SDK)
- POST /logout: (Use Firebase client SDK)
- GET /cart: Auth required, returns cart
- POST /cart: Auth required, adds item to cart { item }
- DELETE /cart/<item_id>: Auth required, removes item
- PUT /cart/<item_id>: Auth required, updates item

# Notes
- Authentication (login/logout) is handled on the client using Firebase SDK. Backend verifies tokens for protected endpoints.
- Cart data is stored in RTDB under 'carts/{uid}'.
