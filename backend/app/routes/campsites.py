"""
Campsite API routes.
Provides CRUD access to campsite data.
Interacts with the OSU MySQL database.
"""

from flask import Blueprint, jsonify, g, request
from app.db.connection import get_db_connection

campsites_bp = Blueprint("campsites", __name__)


# ------------------------
# Helper Functions
# ------------------------

def error_response(message, status_code):
    """
    Standardized error response format.
    Returns a JSON error message with HTTP status code.
    """
    return jsonify({"error": message}), status_code


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


def validate_campsite_payload(data):
    """
    Validates required fields for campsite creation and update.
    Returns True if valid, False otherwise.
    """
    required_fields = [
        "campsite_name",
        "latitude",
        "longitude",
        "campsite_type",
        "is_public",
        "dump_available",
        "electric_hookup_available",
        "water_available",
        "restroom_available",
        "shower_available",
        "pets_allowed",
        "wifi_available",
    ]

    if not data:
        return False

    return all(field in data for field in required_fields)


def has_access(campsite_id, user_id):
    """
    Checks whether a user can access a campsite.
    Access is allowed if:
    - The campsite is public
    - The user is the creator
    """
    campsite, _, _ = execute_query(
        """
        SELECT campsite_id
        FROM campsites
        WHERE campsite_id = %s
          AND (is_public = TRUE OR user_id = %s);
        """,
        (campsite_id, user_id),
        fetch_one=True,
    )
    return campsite is not None


# ------------------------
# Routes
# ------------------------

@campsites_bp.route("/campsites", methods=["GET"])
def list_campsites():
    """
    Retrieves all campsites visible to the current user.
    Includes:
    - Public campsites
    - Private campsites owned by the user
    """
    user_id = g.user_id

    campsites, _, _ = execute_query(
        """
        SELECT
            campsite_id,
            campsite_name,
            user_id,
            latitude,
            longitude,
            campsite_type,
            campsite_identifier,
            is_public,
            dump_available,
            electric_hookup_available,
            water_available,
            restroom_available,
            shower_available,
            pets_allowed,
            wifi_available,
            cell_carrier,
            cell_quality,
            nearby_recreation
        FROM campsites
        WHERE is_public = TRUE
           OR user_id = %s;
        """,
        (user_id,),
        fetch_all=True,
    )

    return jsonify(campsites)


@campsites_bp.route("/campsites/<int:campsite_id>", methods=["GET"])
def get_campsite(campsite_id):
    """
    Retrieves a single campsite if accessible to the user.
    """
    user_id = g.user_id

    campsite, _, _ = execute_query(
        """
        SELECT
            campsite_id,
            campsite_name,
            user_id,
            latitude,
            longitude,
            campsite_type,
            campsite_identifier,
            is_public,
            dump_available,
            electric_hookup_available,
            water_available,
            restroom_available,
            shower_available,
            pets_allowed,
            wifi_available,
            cell_carrier,
            cell_quality,
            nearby_recreation
        FROM campsites
        WHERE campsite_id = %s
          AND (is_public = TRUE OR user_id = %s);
        """,
        (campsite_id, user_id),
        fetch_one=True,
    )

    if not campsite:
        return error_response("Campsite not found", 404)

    return jsonify(campsite)


@campsites_bp.route("/campsites", methods=["POST"])
def create_campsite():
    """
    Creates a new campsite owned by the current user.
    """
    data = request.get_json()
    user_id = g.user_id

    if not validate_campsite_payload(data):
        return error_response("Missing required fields", 400)

    _, _, campsite_id = execute_query(
        """
        INSERT INTO campsites (
            campsite_name,
            user_id,
            latitude,
            longitude,
            campsite_type,
            campsite_identifier,
            is_public,
            dump_available,
            electric_hookup_available,
            water_available,
            restroom_available,
            shower_available,
            pets_allowed,
            wifi_available,
            cell_carrier,
            cell_quality,
            nearby_recreation
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            data["campsite_name"],
            user_id,
            data["latitude"],
            data["longitude"],
            data["campsite_type"],
            data.get("campsite_identifier"),
            data["is_public"],
            data["dump_available"],
            data["electric_hookup_available"],
            data["water_available"],
            data["restroom_available"],
            data["shower_available"],
            data["pets_allowed"],
            data["wifi_available"],
            data.get("cell_carrier"),
            data.get("cell_quality"),
            data.get("nearby_recreation"),
        ),
    )

    return jsonify({"campsite_id": campsite_id}), 201


@campsites_bp.route("/campsites/<int:campsite_id>", methods=["PUT"])
def update_campsite(campsite_id):
    """
    Updates an existing campsite if the user has access.
    """
    user_id = g.user_id
    data = request.get_json()

    if not validate_campsite_payload(data):
        return error_response("Missing required fields", 400)

    if not has_access(campsite_id, user_id):
        return error_response("Not authorized", 403)

    execute_query(
        """
        UPDATE campsites
        SET campsite_name = %s,
            latitude = %s,
            longitude = %s,
            campsite_type = %s,
            campsite_identifier = %s,
            is_public = %s,
            dump_available = %s,
            electric_hookup_available = %s,
            water_available = %s,
            restroom_available = %s,
            shower_available = %s,
            pets_allowed = %s,
            wifi_available = %s,
            cell_carrier = %s,
            cell_quality = %s,
            nearby_recreation = %s
        WHERE campsite_id = %s;
        """,
        (
            data["campsite_name"],
            data["latitude"],
            data["longitude"],
            data["campsite_type"],
            data.get("campsite_identifier"),
            data["is_public"],
            data["dump_available"],
            data["electric_hookup_available"],
            data["water_available"],
            data["restroom_available"],
            data["shower_available"],
            data["pets_allowed"],
            data["wifi_available"],
            data.get("cell_carrier"),
            data.get("cell_quality"),
            data.get("nearby_recreation"),
            campsite_id,
        ),
    )

    return jsonify({"message": "Campsite updated"})


@campsites_bp.route("/campsites/<int:campsite_id>", methods=["DELETE"])
def delete_campsite(campsite_id):
    """
    Deletes a campsite.
    Only the original creator is allowed to delete it.
    """
    user_id = g.user_id

    campsite, _, _ = execute_query(
        """
        SELECT campsite_id
        FROM campsites
        WHERE campsite_id = %s
          AND user_id = %s;
        """,
        (campsite_id, user_id),
        fetch_one=True,
    )

    if not campsite:
        return error_response("Not authorized", 403)

    execute_query(
        "DELETE FROM campsites WHERE campsite_id = %s;",
        (campsite_id,),
    )

    return jsonify({"message": "Campsite deleted"})
