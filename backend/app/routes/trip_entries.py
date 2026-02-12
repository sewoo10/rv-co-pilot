"""
TripEntry API routes.
Provides CRUD operations for managing campsites within trips.
Handles relational logic between trips and campsites.
Interacts with the OSU MySQL database.
"""

from flask import Blueprint, jsonify, g, request
from app.db.connection import get_db_connection
from datetime import datetime

trip_entries_bp = Blueprint("trip_entries", __name__)


# ------------------------
# Helpers
# ------------------------

def error_response(message, status_code):
    """
    Standardized JSON error response helper.
    """
    return jsonify({"error": message}), status_code


def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    """
    Executes a database query with optional fetch behavior.
    Handles connection management and returns:
        result, rowcount, lastrowid
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


def user_owns_trip(trip_id, user_id):
    """
    Verifies that the specified trip belongs to the current user.
    Prevents unauthorized trip access.
    """
    trip, _, _ = execute_query(
        """
        SELECT trip_id
        FROM trips
        WHERE trip_id = %s
          AND user_id = %s;
        """,
        (trip_id, user_id),
        fetch_one=True,
    )
    return trip is not None


def validate_trip_entry_payload(data):
    """
    Validates required fields for creating a trip entry.
    """
    required = ["campsite_id", "begin_date", "end_date"]
    if not data:
        return False
    return all(field in data for field in required)


def validate_dates(begin_date, end_date):
    """
    Ensures date format is YYYY-MM-DD and that
    end_date is not earlier than begin_date.
    """
    try:
        start = datetime.strptime(begin_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
    except (TypeError, ValueError):
        return False, "Invalid date format. Use YYYY-MM-DD."

    if end < start:
        return False, "End date cannot be before begin date."

    return True, None


# ------------------------
# Routes
# ------------------------

@trip_entries_bp.route("/trips/<int:trip_id>/entries", methods=["GET"])
def list_trip_entries(trip_id):
    """
    Retrieves all campsite entries associated with a specific trip.
    Only accessible to the trip owner.
    """
    user_id = g.user_id

    if not user_owns_trip(trip_id, user_id):
        return error_response("Not authorized", 403)

    entries, _, _ = execute_query(
        """
        SELECT
            te.trip_entry_id,
            te.campsite_id,
            te.begin_date,
            te.end_date,
            te.notes,
            c.campsite_name
        FROM trip_entries te
        JOIN campsites c ON te.campsite_id = c.campsite_id
        WHERE te.trip_id = %s;
        """,
        (trip_id,),
        fetch_all=True,
    )

    return jsonify(entries)


@trip_entries_bp.route("/trips/<int:trip_id>/entries", methods=["POST"])
def add_trip_entry(trip_id):
    """
    Adds a campsite to a trip with associated date range and optional notes.
    Only the trip owner may add entries.
    """
    user_id = g.user_id
    data = request.get_json()

    if not validate_trip_entry_payload(data):
        return error_response("Missing required fields", 400)

    valid, message = validate_dates(data["begin_date"], data["end_date"])
    if not valid:
        return error_response(message, 400)

    if not user_owns_trip(trip_id, user_id):
        return error_response("Not authorized", 403)

    _, _, trip_entry_id = execute_query(
        """
        INSERT INTO trip_entries (
            trip_id,
            campsite_id,
            begin_date,
            end_date,
            notes
        )
        VALUES (%s, %s, %s, %s, %s);
        """,
        (
            trip_id,
            data["campsite_id"],
            data["begin_date"],
            data["end_date"],
            data.get("notes"),
        ),
    )

    return jsonify({"trip_entry_id": trip_entry_id}), 201


@trip_entries_bp.route(
    "/trips/<int:trip_id>/entries/<int:trip_entry_id>",
    methods=["PUT"]
)
def update_trip_entry(trip_id, trip_entry_id):
    """
    Updates the date range and/or notes for a specific trip entry.
    Only accessible to the trip owner.
    """
    user_id = g.user_id
    data = request.get_json()

    if not data:
        return error_response("Missing required fields", 400)

    required_fields = ["begin_date", "end_date"]
    if not all(field in data for field in required_fields):
        return error_response("Missing required fields", 400)

    valid, message = validate_dates(data["begin_date"], data["end_date"])
    if not valid:
        return error_response(message, 400)

    if not user_owns_trip(trip_id, user_id):
        return error_response("Not authorized", 403)

    _, rowcount, _ = execute_query(
        """
        UPDATE trip_entries
        SET begin_date = %s,
            end_date = %s,
            notes = %s
        WHERE trip_entry_id = %s
          AND trip_id = %s;
        """,
        (
            data["begin_date"],
            data["end_date"],
            data.get("notes"),
            trip_entry_id,
            trip_id,
        ),
    )

    if rowcount == 0:
        return error_response("Trip entry not found", 404)

    return jsonify({"message": "Trip entry updated"})


@trip_entries_bp.route(
    "/trips/<int:trip_id>/entries/<int:trip_entry_id>",
    methods=["DELETE"]
)
def delete_trip_entry(trip_id, trip_entry_id):
    """
    Removes a campsite entry from a trip.
    Only the trip owner may delete entries.
    """
    user_id = g.user_id

    if not user_owns_trip(trip_id, user_id):
        return error_response("Not authorized", 403)

    _, rowcount, _ = execute_query(
        """
        DELETE FROM trip_entries
        WHERE trip_entry_id = %s
          AND trip_id = %s;
        """,
        (trip_entry_id, trip_id),
    )

    if rowcount == 0:
        return error_response("Trip entry not found", 404)

    return jsonify({"message": "Trip entry removed"})
