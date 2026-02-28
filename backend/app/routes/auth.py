"""
Authentication API routes.
Handles user registration and login.
"""

import jwt
import datetime
from flask import Blueprint, request, jsonify, current_app, g
from werkzeug.security import generate_password_hash, check_password_hash
from app.db.connection import get_db_connection

auth_bp = Blueprint("auth", __name__)


# ------------------------
# Helper Functions
# ------------------------

def error_response(message, status_code):
    """
    Standardized error response format.
    Returns a JSON error message with HTTP status code.
    """
    return jsonify({"error": message}), status_code


def execute_query(query, params=None, fetch_one=False):
    """
    Executes a database query for authentication routes.

    Parameters:
    - query: SQL query string
    - params: tuple of parameters
    - fetch_one: return a single row

    Returns:
    - result (if applicable)
    - lastrowid (for INSERT operations)
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(query, params or ())

    result = None
    if fetch_one:
        result = cursor.fetchone()

    conn.commit()
    lastrowid = cursor.lastrowid

    cursor.close()
    conn.close()

    return result, lastrowid


def create_token(user_id):
    """
    Creates a JWT token for authenticated users.
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }

    token = jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return token


# ------------------------
# Routes
# ------------------------

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Registers a new user account.
    Requires email and password.
    """
    data = request.get_json()

    if not data or "email" not in data or "password" not in data:
        return error_response("Email and password required", 400)

    existing_user, _ = execute_query(
        "SELECT user_id FROM users WHERE email = %s",
        (data["email"],),
        fetch_one=True
    )

    if existing_user:
        return error_response("User already exists", 400)

    password_hash = generate_password_hash(data["password"])

    _, user_id = execute_query(
        """
        INSERT INTO users (email, password_hash)
        VALUES (%s, %s)
        """,
        (data["email"], password_hash)
    )

    token = create_token(user_id)

    return jsonify({"token": token, "userId": user_id}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticates a user and returns a JWT token.
    """
    data = request.get_json()

    if not data or "email" not in data or "password" not in data:
        return error_response("Email and password required", 400)

    user, _ = execute_query(
        """
        SELECT user_id, password_hash
        FROM users
        WHERE email = %s
        """,
        (data["email"],),
        fetch_one=True
    )

    if not user:
        return error_response("Invalid username", 401)

    if not check_password_hash(user["password_hash"], data["password"]):
        return error_response("Invalid password", 401)

    token = create_token(user["user_id"])

    return jsonify({"token": token, "userId": user["user_id"]}), 200


# ------------------------
# Authentication Middleware
# ------------------------

@auth_bp.before_app_request
def authenticate():
    """
    Validates JWT token and sets g.user_id.
    Skips authentication for public routes.
    """
    if request.endpoint in (
        "auth.login",
        "auth.register",
        "health.health_check",
    ):
        return

    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return error_response("Authorization token required", 401)

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=["HS256"]
        )
        g.user_id = payload["user_id"]
    except jwt.ExpiredSignatureError:
        return error_response("Token expired", 401)
    except jwt.InvalidTokenError:
        return error_response("Invalid token", 401)
        
