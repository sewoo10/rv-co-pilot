# RV-Co-Pilot
CS467 Winter 2026 Capstone

Frontend Progress Report #2



## Backend Progress Report #2

### API Endpoints

All routes are prefixed with: 

```
/api
```

---

#### Users
GET /api/users – List all users
POST /api/users – Create a new user
GET /api/users/<user_id> – Retrieve a single user
PUT /api/users/<user_id> – Update a user
DELETE /api/users/<user_id> – Delete a user

---

#### Campsites
GET /api/campsites – List campsites (public + user-owned)
POST /api/campsites – Create a campsite
GET /api/campsites/<campsite_id> – Retrieve a single campsite
PUT /api/campsites/<campsite_id> – Update a campsite
DELETE /api/campsites/<campsite_id> – Delete a campsite (creator only)

---

#### Trips
GET /api/trips – List trips for current user
POST /api/trips – Create a trip
GET /api/trips/<trip_id> – Retrieve a trip
PUT /api/trips/<trip_id> – Update a trip
DELETE /api/trips/<trip_id> – Delete a trip

---

#### Trip Entries
GET /api/trips/<trip_id>/entries – List trip entries
POST /api/trips/<trip_id>/entries – Add campsite to trip
PUT /api/trips/<trip_id>/entries/<trip_entry_id> – Update trip entry
DELETE /api/trips/<trip_id>/entries/<trip_entry_id> – Remove trip entry

---

### Testing (curl Examples)

To test locally:

1. Run the backend:

```
flask run
```

2. In a second terminal, execute the following:

#### Create a user:
```bash
curl -X POST http://127.0.0.1:5000/api/users \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password_hash": "hashedpassword",
  "first_name": "Sam",
  "last_name": "Tester",
  "bio": "Testing backend"
}'
```


#### Create a trip:
```bash
curl -X POST http://127.0.0.1:5000/api/trips \
-H "Content-Type: application/json" \
-d '{
  "trip_name": "My First Trip"
}'
```

#### Create a campsite:
```bash
curl -X POST http://127.0.0.1:5000/api/campsites \
-H "Content-Type: application/json" \
-d '{
  "campsite_name": "Test Campsite",
  "latitude": 44.123456,
  "longitude": -121.654321,
  "campsite_type": "Public Land",
  "is_public": true,
  "dump_available": false,
  "electric_hookup_available": true,
  "water_available": true,
  "restroom_available": true,
  "shower_available": false,
  "pets_allowed": true,
  "wifi_available": false
}'
```

#### Add a campsite to a trip:
```bash
curl -X POST http://127.0.0.1:5000/api/trips/1/entries \
-H "Content-Type: application/json" \
-d '{
  "campsite_id": 1,
  "begin_date": "2026-06-01",
  "end_date": "2026-06-05",
  "notes": "First stop"
}'
```

---

### Authentication Note

Authentication is currently mocked using a temporary "before_request" function in "__init__.py" that sets:

```
g.user_id = 1
```

This allows full testing of authorization logic (ownership checks, trip restrictions, campsite visibility rules) without implementing full authentication yet.
Proper authentication will be implemented in Progress Report #3.