"""
User API routes.
Provides CRUD access to user data.
Interacts with the OSU MySQL database.
"""

from flask import Blueprint, request, jsonify
from app.db.connection import get_db_connection

users_bp = Blueprint("users", __name__)


# ------------------------
# Helper Functions
# ------------------------

def error_response(message, status_code):
    """
    Standardized error response format.
    Returns a JSON error message with HTTP status code.
    """
    return jsonify({"error": message}), status_code


def validate_user_payload(data, require_password=True):
    """
    Validates required user fields.

    Parameters:
    - data: JSON request body
    - require_password: If True, password_hash is required

    Returns:
    - True if valid
    - False otherwise
    """
    if not data:
        return False
    if "email" not in data:
        return False
    if require_password and "password_hash" not in data:
        return False
    return True


def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    """
    Executes a database query.

    Parameters:
    - query: SQL query string
    - params: tuple of parameters
    - fetch_one: return a single row
    - fetch_all: return all rows

    Returns:
    - result (if applicable)
    - rowcount (number of affected rows)
    - lastrowid (for INSERT operations)
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(query, params or ())

    result = None
    if fetch_one:
        result = cursor.fetchone()
    elif fetch_all:
        result = cursor.fetchall()

    conn.commit()
    rowcount = cursor.rowcount
    lastrowid = cursor.lastrowid

    cursor.close()
    conn.close()

    return result, rowcount, lastrowid


# ------------------------
# Routes
# ------------------------

@users_bp.route("/users", methods=["POST"])
def create_user():
    """
    Creates a new user account.
    Requires email and password_hash.
    """
    data = request.get_json()

    if not validate_user_payload(data):
        return error_response("Missing required fields", 400)

    try:
        _, _, user_id = execute_query(
            """
            INSERT INTO users (email, password_hash, first_name, last_name, bio)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                data["email"],
                data["password_hash"],
                data.get("first_name"),
                data.get("last_name"),
                data.get("bio"),
            ),
        )
    except Exception:
        return error_response("User creation failed", 400)

    return jsonify({"user_id": user_id}), 201


@users_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """
    Retrieves a single user by ID.
    Does not return password information.
    """
    user, _, _ = execute_query(
        """
        SELECT user_id, email, first_name, last_name, bio
        FROM users
        WHERE user_id = %s
        """,
        (user_id,),
        fetch_one=True,
    )

    if not user:
        return error_response("User not found", 404)

    return jsonify(user)


@users_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    """
    Updates an existing user's profile information.
    Password updates are not handled here.
    """
    data = request.get_json()

    if not validate_user_payload(data, require_password=False):
        return error_response("Missing required fields", 400)

    _, rowcount, _ = execute_query(
        """
        UPDATE users
        SET email = %s,
            first_name = %s,
            last_name = %s,
            bio = %s
        WHERE user_id = %s
        """,
        (
            data["email"],
            data.get("first_name"),
            data.get("last_name"),
            data.get("bio"),
            user_id,
        ),
    )

    if rowcount == 0:
        return error_response("User not found", 404)

    return jsonify({"message": "User updated"})


@users_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    """
    Deletes a user account by ID.
    """
    _, rowcount, _ = execute_query(
        "DELETE FROM users WHERE user_id = %s",
        (user_id,),
    )

    if rowcount == 0:
        return error_response("User not found", 404)

    return jsonify({"message": "User deleted"})


@users_bp.route("/users", methods=["GET"])
def list_users():
    """
    Retrieves all users.
    Does not include password information.
    """
    users, _, _ = execute_query(
        """
        SELECT user_id, email, first_name, last_name, bio
        FROM users
        """,
        fetch_all=True,
    )

    return jsonify(users)
