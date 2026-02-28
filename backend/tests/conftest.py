"""
Pytest configuration and fixtures for backend tests.
"""
import pytest
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

# Add the parent directory to the path so we can import app
sys.path.insert(0, str(Path(__file__).parent.parent))

from app import create_app


@pytest.fixture
def app():
    """Create a Flask app configured for testing."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'test-secret-key'
    return app


@pytest.fixture
def client(app):
    """Create a test client for the Flask app."""
    return app.test_client()


@pytest.fixture
def app_context(app):
    """Create an app context for testing."""
    with app.app_context():
        yield app


@pytest.fixture
def mock_db_connection(mocker):
    """Mock the database connection."""
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.__enter__.return_value = mock_cursor
    mock_cursor.__exit__.return_value = None
    
    mocker.patch(
        'app.routes.auth.get_db_connection',
        return_value=mock_conn
    )
    
    return mock_conn, mock_cursor
