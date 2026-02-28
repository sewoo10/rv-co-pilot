"""
Application factory for the Flask backend.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from the backend directory
backend_dir = Path(__file__).parent.parent
load_dotenv(backend_dir / '.env')

from flask import Flask
from .routes.health import health_bp    # basic connection health check
from .routes.users import users_bp
from .routes.campsites import campsites_bp
from .routes.trips import trips_bp
from .routes.trip_entries import trip_entries_bp
from .routes.auth import auth_bp

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(users_bp, url_prefix="/api")
    app.register_blueprint(campsites_bp, url_prefix="/api")
    app.register_blueprint(trips_bp, url_prefix="/api")
    app.register_blueprint(trip_entries_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")

    return app