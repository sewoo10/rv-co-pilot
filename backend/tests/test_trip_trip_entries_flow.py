"""
Test trips.py, and trip_entries.py
"""

from datetime import datetime, timedelta, timezone
import jwt


class TestCreateTrip:
    '''Tests creation of trip'''

    def test_create_trip_sucess(self, client, app, mocker, mock_db_connection):
        '''Test successful creation of trip'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trips.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = None
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        payload = {
            'trip_name': 'Trip 1',
        }

        response = client.post(
            '/api/trips',
            json=payload,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response.status_code == 201
        data = response.get_json()
        assert 'trip_id' in data
        assert isinstance(data['trip_id'], int)

    def test_create_trip_no_name(self, client, app, mocker, mock_db_connection):
        '''Test fails when trip is created with no name'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trips.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = None
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        payload = {}

        response = client.post(
            '/api/trips',
            json=payload,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response.status_code == 400
        data = response.get_json()
        assert data['error'] == 'Missing required fields'


class TestAddCampsiteToTrip:
    '''Tests adding campsites to trip'''

    def test_add_campsite_to_trip_sucess(self, client, app, mocker, mock_db_connection):
        '''Test successful addition of campsite to trip'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trip_entries.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = {'trip_id': 1}
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        payload = {
            'campsite_id': '1',
            'begin_date': '2026-01-01',
            'end_date': '2026-01-03',
            'notes': 'Notes here'
        }

        response = client.post(
            '/api/trips/1/entries',
            json=payload,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response.status_code == 201
        data = response.get_json()
        assert 'trip_entry_id' in data
        assert isinstance(data['trip_entry_id'], int)
        
    def test_add_same_campsite_with_same_dates(self, client, app, mocker, mock_db_connection):
        '''Test fail when adding same campsite with same dates'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trip_entries.get_db_connection', return_value=mock_conn)
        
        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        payload = {
            'campsite_id': '1',
            'begin_date': '2026-01-01',
            'end_date': '2026-01-03',
            'notes': 'Notes here'
        }

        # first request (success)
        mock_cursor.fetchone.side_effect = [
            {'trip_id': 1},  
            None,            
        ]
        mock_cursor.lastrowid = 1

        response1 = client.post(
            '/api/trips/1/entries',
            json=payload,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response1.status_code == 201
        data1 = response1.get_json()
        assert 'trip_entry_id' in data1
        assert isinstance(data1['trip_entry_id'], int)

        # second request (success - API currently allows duplicate overlaps)
        mock_cursor.fetchone.side_effect = [
            {'trip_id': 1},           
            {'trip_entry_id': 1},     
        ]
        mock_cursor.lastrowid = 2

        response2 = client.post(
            '/api/trips/1/entries',
            json=payload,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response2.status_code == 201
        data2 = response2.get_json()
        assert 'trip_entry_id' in data2
        assert isinstance(data2['trip_entry_id'], int)

    def test_add_same_campsite_with_different_dates(self, client, app, mocker, mock_db_connection):
        '''Test successful when adding same campsite with different dates'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trip_entries.get_db_connection', return_value=mock_conn)
        
        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        payload1 = {
            'campsite_id': '1',
            'begin_date': '2026-01-01',
            'end_date': '2026-01-03',
            'notes': 'Notes here'
        }

        # first request (success)
        mock_cursor.fetchone.side_effect = [
            {'trip_id': 1},  
            None,            
        ]
        mock_cursor.lastrowid = 1

        response1 = client.post(
            '/api/trips/1/entries',
            json=payload1,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response1.status_code == 201
        data1 = response1.get_json()
        assert 'trip_entry_id' in data1
        assert isinstance(data1['trip_entry_id'], int)

        payload2 = {
            'campsite_id': '1',
            'begin_date': '2026-01-10',
            'end_date': '2026-01-13',
            'notes': 'Notes here'
        }

        # second request (sucess)
        mock_cursor.fetchone.side_effect = [
            {'trip_id': 1},           
            None,
        ]
        mock_cursor.lastrowid = 2

        response2 = client.post(
            '/api/trips/1/entries',
            json=payload2,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response2.status_code == 201
        data2 = response2.get_json()
        assert 'trip_entry_id' in data2
        assert isinstance(data2['trip_entry_id'], int)


class TestRemoveCampsiteFromTrip:
    '''Tests removing campsite from trip'''

    def test_remove_campsite_from_trip_sucess(self, client, app, mocker, mock_db_connection):
        '''Test successful removal of campsite from trip'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trip_entries.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = {'trip_id': 1}
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        payload = {
            'campsite_id': '1',
            'begin_date': '2026-01-01',
            'end_date': '2026-01-03',
            'notes': 'Notes here'
        }

        # add campsite to trip (sucess)
        response1 = client.post(
            '/api/trips/1/entries',
            json=payload,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response1.status_code == 201
        data1 = response1.get_json()
        assert 'trip_entry_id' in data1
        assert isinstance(data1['trip_entry_id'], int)

        # remove campsite from trip (sucess)
        response2 = client.delete(
            '/api/trips/1/entries/1',
            headers={'Authorization': f'Bearer {token}'}
        )

        assert response2.status_code == 200
        data2 = response2.get_json()
        assert 'message' in data2
        assert isinstance(data2['message'], str)


class TestDeleteTrip:
    '''Tests deletion of trip'''

    def test_delete_trip_sucess(self, client, app, mocker, mock_db_connection):
        '''Test successful deletion of trip'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trips.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = {'trip_id': 1}
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        response = client.delete(
            '/api/trips/1',
            headers={'Authorization': f'Bearer {token}'}
        )

        assert response.status_code == 200
        data = response.get_json()
        assert 'message' in data
        assert isinstance(data['message'], str)


class TestListTrips:
    '''Tests retrieveal of trip(s)'''

    def test_list_trips_sucess(self, client, app, mocker, mock_db_connection):
        '''Test sucessful retreving all trips owned by user'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trips.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchall.return_value = [
            {'trip_id': 1, 'trip_name': 'Trip 1', 'date_created': '2026-01-01'},
            {'trip_id': 2, 'trip_name': 'Trip 2', 'date_created': '2026-01-02'},
            {'trip_id': 3, 'trip_name': 'Trip 3', 'date_created': '2026-01-03'},
        ]
        mock_cursor.lastrowid = 3

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        response = client.get(
            '/api/trips',
            headers={'Authorization': f'Bearer {token}'}
        )

        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) == 3


    def test_get_trip_sucess(self, client, app, mocker, mock_db_connection):
        '''Test sucessful when retreving a trip by user'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trips.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = {'trip_id': 1}
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        response = client.get(
            '/api/trips/1',
            headers={'Authorization': f'Bearer {token}'}
        )

        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, dict)
        assert 'trip_id' in data
        assert data['trip_id'] == 1


class TestUpdateTrips:
    '''Tests updating of trip'''

    def test_update_trip_success(self, client, app, mocker, mock_db_connection):
        '''Tests sucessful when updating a trip'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trips.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = None
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        payload1 = {
            'trip_name': 'Trip 1',
        }

        # creation of trip (sucess)
        response1 = client.post(
            '/api/trips',
            json=payload1,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response1.status_code == 201
        data1 = response1.get_json()
        assert 'trip_id' in data1
        assert isinstance(data1['trip_id'], int)

        payload2 = {
            'trip_name': 'Trip One',
        }

        # update trip (sucess)
        response2 = client.put(
            '/api/trips/1',
            json=payload2,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response2.status_code == 200
        data2 = response2.get_json()
        assert 'message' in data2
        assert isinstance(data2['message'], str)


class TestVerificationOfTripOwnership:
    '''Tests verification of ownership of trip'''

    def test_verification_rejection(self, client, app, mocker, mock_db_connection):
        '''Tests fails when different user tries to CRUD trip entries they don't own'''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trip_entries.get_db_connection', return_value=mock_conn)
        
        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        # GET - list trip entries (fail)
        mock_cursor.fetchone.return_value = None
        response = client.get(
            '/api/trips/999/entries',
            headers={'Authorization': f'Bearer {token}'}
        )
        assert response.status_code == 403
        assert response.get_json()['error'] == 'Not authorized'

        # POST - add campsite to trip (fail)
        mock_cursor.fetchone.return_value = None
        payload = {
            'campsite_id': 1,
            'begin_date': '2026-01-01',
            'end_date': '2026-01-03',
        }
        response = client.post(
            '/api/trips/999/entries',
            json=payload,
            headers={'Authorization': f'Bearer {token}'}
        )
        assert response.status_code == 403
        assert response.get_json()['error'] == 'Not authorized'

        # PUT - update trip entry (fail)
        mock_cursor.fetchone.return_value = None
        payload = {
            'begin_date': '2026-01-05',
            'end_date': '2026-01-07',
        }
        response = client.put(
            '/api/trips/999/entries/1',
            json=payload,
            headers={'Authorization': f'Bearer {token}'}
        )
        assert response.status_code == 403
        assert response.get_json()['error'] == 'Not authorized'

        # DELETE - remove entry from trip (fail)
        mock_cursor.fetchone.return_value = None
        response = client.delete(
            '/api/trips/999/entries/1',
            headers={'Authorization': f'Bearer {token}'}
        )
        assert response.status_code == 403
        assert response.get_json()['error'] == 'Not authorized'
    

class TestDateValidation:
    '''Tests validation of dates'''

    def test_validation_of_date_format(self, client, app, mocker, mock_db_connection):
        '''Tests fails when dates are inputed wrong '''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trip_entries.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = {'trip_id': 1}
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        payload = {
            'campsite_id': '1',
            'begin_date': '1-1-26',
            'end_date': '1-3-26',
            'notes': 'Notes here'
        }

        response = client.post(
            '/api/trips/1/entries',
            json=payload,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert isinstance(data['error'], str)

    def test_validation_end_date_before_begin_date(self, client, app, mocker, mock_db_connection):
        '''Tests fails when end date is before begin date '''

        mock_conn, mock_cursor = mock_db_connection
        mocker.patch('app.routes.trip_entries.get_db_connection', return_value=mock_conn)
        mock_cursor.fetchone.return_value = {'trip_id': 1}
        mock_cursor.lastrowid = 1

        token = jwt.encode(
            {
                'user_id': 1,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1),
            },
            app.config['SECRET_KEY'],
            algorithm='HS256',
        )

        payload = {
            'campsite_id': '1',
            'begin_date': '2026-01-03',
            'end_date': '2026-01-01',
            'notes': 'Notes here'
        }

        response = client.post(
            '/api/trips/1/entries',
            json=payload,
            content_type='application/json',
            headers={'Authorization': f'Bearer {token}'},
        )

        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert isinstance(data['error'], str)
        