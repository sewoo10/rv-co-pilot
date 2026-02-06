"""SQL Alchemy Database models for the app."""
from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

def get_uuid():
    """Generate unique ID"""
    return uuid4().int


class User(db.Model):
    """User model for app users."""
    __tablename__ = 'Users'
    user_id = db.Column(db.Integer, primary_key=True, default=get_uuid)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(20), nullable=True)
    last_name = db.Column(db.String(20), nullable=True)
    bio = db.Column(db.String(1000), nullable=True)
