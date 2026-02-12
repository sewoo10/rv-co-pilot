"""
Application factory for the Flask backend.
"""

from flask import Flask
from .routes.health import health_bp    # basic connection health check
from .routes.users import users_bp
from .routes.campsites import campsites_bp
from .routes.trips import trips_bp
from .routes.trip_entries import trip_entries_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(users_bp, url_prefix="/api")
    app.register_blueprint(campsites_bp, url_prefix="/api")
    app.register_blueprint(trips_bp, url_prefix="/api")
    app.register_blueprint(trip_entries_bp, url_prefix="/api")

    # Mock user used for testing, delete after user authentication integration complete
    @app.before_request
    def mock_user():
        from flask import g
        g.user_id = 1

    return app