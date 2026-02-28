"""
Test campsite.py
"""

from datetime import datetime, timedelta, timezone
import jwt


class TestGetCampsites:
    '''Tests retrieval of campsites(s)'''

    def test_list_of_campsites_success(self, client, app, mocker, mock_db_connection):
        '''Test successful retrieval of campsites'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.campsites.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchall.return_value = []

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        response = client.get(
            '/api/campsites',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_of_campsite_success(self, client, app, mocker, mock_db_connection):
        '''Test successful get of campsite'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.campsites.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = {'campsite_id': 1}

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        response = client.get(
            '/api/campsites/1',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, dict)
        assert 'campsite_id' in data
        assert data['campsite_id'] == 1

    
class TestCreateCampsite:
    '''Tests creation of campsites'''

    def test_creation_of_campsite_success(self, client, app, mocker, mock_db_connection):
        '''Test successful creation of campsite'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.campsites.get_db_connection', return_value=mock_conn)
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        campsite_data = {
            "campsite_name": "Campsite 1",
            "latitude": 45.5,
            "longitude": -122.5,
            "campsite_type": "RV",
            "is_public": False,
            "dump_available": True,
            "electric_hookup_available": True,
            "water_available": True,
            "restroom_available": True,
            "shower_available": False,
            "pets_allowed": True,
            "wifi_available": False
        }

        response = client.post(
            '/api/campsites',
            headers={'Authorization': f'Bearer {token}'},
            json=campsite_data
        )

        assert response.status_code == 201
        data = response.get_json()
        assert isinstance(data, dict)
        assert 'campsite_id' in data
        assert data['campsite_id'] == 1


class TestUpdateCampsite:
    '''Tests updating campsites'''

    def test_update_of_campsite_success(self, client, app, mocker, mock_db_connection):
        '''Test successful updating of campsite'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.campsites.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = {'campsite_id': 1}

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        campsite_data = {
            "campsite_name": "Campsite One",
            "latitude": 45.5,
            "longitude": -122.5,
            "campsite_type": "RV",
            "is_public": False,
            "dump_available": False,
            "electric_hookup_available": True,
            "water_available": True,
            "restroom_available": True,
            "shower_available": True,
            "pets_allowed": False,
            "wifi_available": False
        }

        response = client.put(
            '/api/campsites/1',
            headers={'Authorization': f'Bearer {token}'},
            json=campsite_data
        )

        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, dict)
        assert 'message' in data
        assert data['message'] == 'Campsite updated'


class TestDeleteCampsite:
    '''Tests deletion of campsite'''

    def test_deletion_of_campsite_success(self, client, app, mocker, mock_db_connection):
        '''Test successful deletion of campsite'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.campsites.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = {'campsite_id': 1}

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        response = client.delete(
            '/api/campsites/1',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, dict)
        assert 'message' in data
        assert data['message'] == 'Campsite deleted'
        