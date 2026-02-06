"""Application configuration settings. Loads environment variables & defines configuration values"""
import os
from dotenv import load_dotenv


load_dotenv()

class ApplicationConfig:
    """Base configuration for Flask application."""
    SECRET_KEY = os.environ["SECRET_KEY"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = r"sqlite:///rv_copilot.db" #TODO: Replace placeholder with actual URI
