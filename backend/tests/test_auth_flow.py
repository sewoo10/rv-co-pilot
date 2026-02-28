"""
Tests auth.py
"""

from werkzeug.security import generate_password_hash


class TestRegister:
    """Tests registration of user."""
    
    def test_register_success(self, client, mock_db_connection):
        """Test successful user registration."""

        mock_conn, mock_cursor = mock_db_connection
        mock_cursor.fetchone.return_value = None
        mock_cursor.lastrowid = 1
        
        payload = {
            'firstName': 'John',
            'lastName': 'Doe',
            'email': 'johndoe123@gmail.com',
            'password': 'K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE'
        }
        
        response = client.post(
            '/api/register',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = response.get_json()
        assert 'token' in data
        assert isinstance(data['token'], str)
    
    
    def test_register_missing_email(self, client):
        """Test registration fails when email is missing."""

        payload = {
            'firstName': 'John',
            'lastName': 'Doe',
            'password': 'K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE'
        }
        
        response = client.post(
            '/api/register',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert data['error'] == 'Email and password required'
    
    
    def test_register_missing_password(self, client):
        """Test registration fails when password is missing."""
        
        payload = {
            'firstName': 'John',
            'lastName': 'Doe',
            'email': 'johndoe123@gmail.com'
        }
        
        response = client.post(
            '/api/register',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert data["error"] == "Email and password required"
    
    
    def test_register_missing_both_email_and_password(self, client):
        """Test registration fails when both email and password are missing."""

        payload = {
            'firstName': 'John',
            'lastName': 'Doe',

        }
        
        response = client.post(
            '/api/register',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert data["error"] == "Email and password required"
    
    
    def test_register_user_already_exists(self, client, mock_db_connection):
        """Test registration fails when user with that email already exists."""

        mock_conn, mock_cursor = mock_db_connection
        mock_cursor.fetchone.return_value = {"user_id": 1}
        
        payload = {
            'firstName': 'John',
            'lastName': 'Doe',
            'email': 'johndoe123@gmail.com',
            'password': 'K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE'
        }
        
        response = client.post(
            '/api/register',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert data["error"] == "User already exists"


class TestLogin:
    """Tests login of user."""
    
    def test_login_success(self, client, mock_db_connection):
        """Test successful user login."""

        mock_conn, mock_cursor = mock_db_connection
        
        password = "K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE"
        password_hash = generate_password_hash(password)
        
        mock_cursor.fetchone.return_value = {
            "user_id": 1,
            "password_hash": password_hash
        }
        
        payload = {
            "email": "johndoe123@gmail.com",
            "password": password
        }
        
        response = client.post(
            '/api/login',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = response.get_json()
        assert "token" in data
        assert isinstance(data["token"], str)
    
    
    def test_login_missing_email(self, client):
        """Test login fails when email is missing."""

        payload = {
            "password": "K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE"
        }
        
        response = client.post(
            '/api/login',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert data["error"] == "Email and password required"
    
    
    def test_login_missing_password(self, client):
        """Test login fails when password is missing."""

        payload = {
            "email": "johndoe123@gmail.com"
        }
        
        response = client.post(
            '/api/login',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert data["error"] == "Email and password required"
    
    
    def test_login_missing_both(self, client):
        """Test login fails when both email and password are missing."""

        payload = {}
        
        response = client.post(
            '/api/login',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert data["error"] == "Email and password required"
    
    
    def test_login_user_not_found(self, client, mock_db_connection):
        """Test login fails when user email does not exist."""

        mock_conn, mock_cursor = mock_db_connection
        mock_cursor.fetchone.return_value = None
        
        payload = {
            "email": "johndoe123@gmail.com",
            "password": "K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE"
        }
        
        response = client.post(
            '/api/login',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 401
        data = response.get_json()
        assert data["error"] == "Invalid username"
    
    
    def test_login_invalid_password(self, client, mock_db_connection):
        """Test login fails when password is incorrect."""
        mock_conn, mock_cursor = mock_db_connection
        
        password_hash = generate_password_hash("K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE")
        
        # Mock the cursor to return a user
        mock_cursor.fetchone.return_value = {
            "user_id": 1,
            "password_hash": password_hash
        }
        
        payload = {
            "email": "johndoe123@gmail.com",
            "password": "N7v@qP4!zL2#tR9$"
        }
        
        response = client.post(
            '/api/login',
            json=payload,
            content_type='application/json'
        )
        
        assert response.status_code == 401
        data = response.get_json()
        assert data["error"] == "Invalid password"
