"""
Trip API routes.
Provides CRUD access to trip data.
Interacts with the OSU MySQL database.
"""

from flask import Blueprint, jsonify, g, request
from app.db.connection import get_db_connection

trips_bp = Blueprint("trips", __name__)


# ------------------------
# Helper Functions
# ------------------------

def error_response(message, status_code):
    """
    Returns a standardized JSON error response.
    """
    return jsonify({"error": message}), status_code


def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    """
    Executes a database query and optionally fetches one or all results.

    Returns:
        result: fetched row(s) if requested
        rowcount: number of affected rows
        lastrowid: ID of last inserted row (if applicable)
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


def validate_trip_payload(data):
    """
    Validates required fields for creating or updating a trip.
    """
    if not data or "trip_name" not in data:
        return False
    return True


# ------------------------
# Routes
# ------------------------

@trips_bp.route("/trips", methods=["GET"])
def list_trips():
    """
    Retrieves all trips owned by the current user.
    """
    user_id = g.user_id

    trips, _, _ = execute_query(
        """
        SELECT trip_id, trip_name, date_created
        FROM trips
        WHERE user_id = %s;
        """,
        (user_id,),
        fetch_all=True,
    )

    return jsonify(trips)


@trips_bp.route("/trips/<int:trip_id>", methods=["GET"])
def get_trip(trip_id):
    """
    Retrieves a single trip owned by the current user.
    """
    user_id = g.user_id

    trip, _, _ = execute_query(
        """
        SELECT trip_id, trip_name, date_created
        FROM trips
        WHERE trip_id = %s
          AND user_id = %s;
        """,
        (trip_id, user_id),
        fetch_one=True,
    )

    if not trip:
        return error_response("Trip not found", 404)

    return jsonify(trip)


@trips_bp.route("/trips", methods=["POST"])
def create_trip():
    """
    Creates a new trip for the current user.
    """
    user_id = g.user_id
    data = request.get_json()

    if not validate_trip_payload(data):
        return error_response("Missing required fields", 400)

    _, _, trip_id = execute_query(
        """
        INSERT INTO trips (user_id, trip_name, date_created)
        VALUES (%s, %s, CURDATE());
        """,
        (user_id, data["trip_name"]),
    )

    return jsonify({"trip_id": trip_id}), 201


@trips_bp.route("/trips/<int:trip_id>", methods=["PUT"])
def update_trip(trip_id):
    """
    Updates the name of a trip owned by the current user.
    """
    user_id = g.user_id
    data = request.get_json()

    if not validate_trip_payload(data):
        return error_response("Missing required fields", 400)

    _, rowcount, _ = execute_query(
        """
        UPDATE trips
        SET trip_name = %s
        WHERE trip_id = %s
          AND user_id = %s;
        """,
        (data["trip_name"], trip_id, user_id),
    )

    if rowcount == 0:
        return error_response("Trip not found", 404)

    return jsonify({"message": "Trip updated"})


@trips_bp.route("/trips/<int:trip_id>", methods=["DELETE"])
def delete_trip(trip_id):
    """
    Deletes a trip owned by the current user.
    """
    user_id = g.user_id

    _, rowcount, _ = execute_query(
        """
        DELETE FROM trips
        WHERE trip_id = %s
          AND user_id = %s;
        """,
        (trip_id, user_id),
    )

    if rowcount == 0:
        return error_response("Trip not found", 404)

    return jsonify({"message": "Trip deleted"})
