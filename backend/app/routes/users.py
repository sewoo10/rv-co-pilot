"""
User API routes.
Defines RESTful endpoints for creating and retrieving users.
Interacts with the OSU MySQL database.
"""

from flask import Blueprint, request, jsonify
from app.db.connection import get_db_connection


users_bp = Blueprint("users", __name__)


@users_bp.route("/users", methods=["POST"])
def create_user():
    """Create a new user record"""
    data = request.json

    # Validate required fields
    if "email" not in data or "password_hash" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Insert new user into the database
        cursor.execute(
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
        conn.commit()
        user_id = cursor.lastrowid
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({"user_id": user_id}), 201


@users_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """Retrieve a single user by ID"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT user_id, email, first_name, last_name, bio FROM users WHERE user_id = %s",
        (user_id,),
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user)
