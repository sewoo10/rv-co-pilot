"""
Application factory for the Flask backend.
Additional routes will be added as needed.
"""

from flask import Flask
from .routes.health import health_bp    # basic connection health check
from .routes.users import users_bp
from .routes.campsites import campsites_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(users_bp, url_prefix="/api")
    app.register_blueprint(campsites_bp, url_prefix="/api")


    return app