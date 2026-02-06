"""
This file is for temporary use while building user account creation and authentication 
features. It will be incorporated into the main app file once those features are fully 
developed and tested.
"""
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from models import db, User
from config import ApplicationConfig



# Initialize flask app and configuration
app = Flask(__name__)
app.config.from_object(ApplicationConfig)
bcrypt = Bcrypt(app)
db.init_app(app)

# Create database tables TODO: Update after testing
with app.app_context():
    db.create_all()


# Routes
@app.route("/register", methods=["POST"])
def register_user():
    """Register new user account."""

    # Get user details from request
    email = request.json["email"]
    password = request.json["password"]
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    bio = request.json.get("bio")

    # Check for existing user
    duplicate_user = User.query.filter_by(email=email).first() is not None
    if duplicate_user:
        return jsonify({"error": "Email already registered"}), 400

    # Create user
    password_hash = bcrypt.generate_password_hash(password)
    new_user = User(
        email=email,
        password_hash=password_hash,
        first_name=first_name,
        last_name=last_name,
        bio=bio
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login_user():
    """Authenticate user and log them in."""

     # Get user details from request
    email = request.json["email"]
    password = request.json["password"]

    # Validate user
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"error": "Invalid email"}), 401

    if not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401
    return jsonify({"message": "Login successful"}), 200


if __name__ == "__main__":
    app.run(debug=True)
