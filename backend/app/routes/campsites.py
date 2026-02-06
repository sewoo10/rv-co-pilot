"""
Campsite API routes.
Provides read-only access to campsite data.
"""

from flask import Blueprint, jsonify
from app.db.connection import get_db_connection

campsites_bp = Blueprint("campsites", __name__)


@campsites_bp.route("/campsites", methods=["GET"])
def list_campsites():
    """
    Retrieves all campsites.
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            campsite_id,
            name,
            site_identifier,
            latitude,
            longitude,
            campsite_type,
            has_dump,
            has_electric,
            has_water,
            pets_allowed,
            has_wifi,
            cell_carrier,
            cell_bars,
            recreation_notes,
            is_public
        FROM campsites
        """
    )

    campsites = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(campsites)
