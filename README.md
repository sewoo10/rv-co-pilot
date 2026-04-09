# RV Co-Pilot
### CS 467 Winter 2026
### Eric Azevedo, Matthew Baker, Samantha Wooten


## Overview
RV Co-Pilot is an iOS and Android mobile application designed to help campers plan trips, discover campsites, and manage their travel itineraries. It was built using React Native with Expo for the frontend and Python with Flask REST API and MySQL database for the backend.

## Key Features
- Interactive map-based campsite discovery
- User-created campsites with detailed attributes
- Trip planning with campsite organization
- Location-based search and dynamic map updates
- Full CRUD functionality across core entities

## Running This Project Locally

This project was developed using OSU infrastructure and includes some dependencies that are not publicly accessible.

To fully run the application locally, you would need:
- Access to the OSU Campus VPN (for database connectivity)
- Private `.env` configuration files (database credentials and API keys)

Because these dependencies are not included, the application may not run as expected in a standalone environment.

## Application Demo

To view the full functionality of the application, please watch the demo below:
👉 https://www.youtube.com/watch?v=gtBSeBeQ0u8

## Installation

To run the project locally, both the backend server and the frontend Expo application must be installed and running. The following instructions describe how to install the required components and run the application locally.

### Prerequisites

Before installing the project, ensure the following software is installed on your system:
- Node.js (version 20 or newer)
- npm (included with Node.js)
- Python 3
- MySQL (8.0 or higher)
- Pip (Python package manager)
- Android Studio (for Android emulator support)
- Xcode (for iOS simulator support)
- Expo CLI
- Expo Go mobile app installed on your emulator

These tools are required to clone the repository, run the backend server, and launch the mobile application.

### Clone the Repository
- Open a terminal and choose your desired project directory.
- Clone the repository from GitHub using the terminal:
  - git clone https://github.com/sewoo10/rv-co-pilot.git 
  - Navigate into the project directory:
  - cd rv-co-pilot

### Installing/Starting the Backend
- Navigate to the backend directory:
- cd backend
- Create a Python virtual environment:
- python -m venv .venv
- Note: a Python virtual environment is used to isolate the backend dependencies from the system Python installation. This ensures the correct package versions are installed and prevents conflicts with other Python projects on the tester’s machine.
- Activate the virtual environment.
  - for Windows:
    - .\.venv\scripts\activate
  - For macOS/Linux:
    - source .venv/bin/activate
- Install the backend dependencies:
  - pip install -r requirements.txt
- Create an environment configuration file named:
  - .env
- Inside the .env file, add the required database credentials (not included in this repository).

- Start the backend server:
  - python wsgi.py
- The backend API will start on http://localhost 
- Leave this terminal window running.

### Installing the Frontend
- Open a new terminal and navigate to the frontend directory:
  - cd frontend
- Install the frontend dependencies:
  - npm install
- Create an environment configuration file named:
  - .env
- Add a valid Google Maps API key to the .env file for map functionality.
- Leave this terminal window open and proceed to the next steps

### Running the Application
**For iOS simulator (Mac only, via Expo Go):**
- Ensure Xcode is installed
- Install Expo Go in the iOS simulator
- Launch the iOS simulator from Xcode
- In the frontend terminal, launch Expo Go by running:
  - npx expo start
  - Wait for the app to bundle
  - Press i
- The application will open in the simulator

**For Android emulator (Android only, via Expo go):**
- Ensure an Android emulator is installed and running
- Install Expo Go in the android emulator
- In the frontend terminal, launch Expo Go by running:
  - npx expo start
  - Wait for the app to bundle
  -  Press a
- The application will open in the emulator

## Application Use

### Getting Started: 
Register to create an account, or login to the app if you have previously registered. The email address is not verified at this point in development so entering any email address simply to test the app is acceptable. There is no lost password functionality to the app yet so if you forget your password you will have to create a new account. The first name, last name, and bio associated with an account can be edited by navigating to the account page from the bottom menu and clicking the edit button.

### Viewing Campsites:
Campsites can be viewed visually on the interactive map view or in a textual format on the campsite list view. At this point, the majority of campsites loaded into the app database are in the Corvallis, OR area. When the map page opens, the user is prompted to allow location access. After approval, the map centers on the user’s current location and displays a blue location dot. If location access is not approved, the map will default to the Corvallis, OR area. Campsites within approximately 50 miles of the visible map region will load automatically. As the user navigates around the map, campsites within the new map view will dynamically populate. When granted location access, a location button in the top right corner of the map allows the user to quickly recenter the map on their current location. To view a campsite’s details from the map view, click on a campsite icon and then click on the campsite name to navigate to the campsite details view. From the campsite list view, users can toggle between viewing nearby campsites or all campsites in the database, and can click on any campsite name to navigate to the detailed view.

### Creating/Editing Campsites:

To create a campsite, long press anywhere on the map to navigate to the create campsite view. Enter the campsite details on this page, click add, and the campsite will be added to the database. The campsite location will correspond to the position of the long press entered on the map. To edit a campsite’s details, navigate to the campsite details view and press the edit button.

### Viewing/Creating/Editing Trips:

To view the trips associated with the user’s account, click the trips button on the bottom menu. This will navigate to the trips overview, which will show all of the trips that a user has created. Clicking add trip will create a new trip, where campsites can be added using a drop-down list of available campsites in the database. Clicking on a trip in the list will navigate to the trip details view, where you can view the campsites that have previously been added to the trip or add new campsites.
