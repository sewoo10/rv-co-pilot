from dotenv import load_dotenv
import os

# Load .env from the backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(backend_dir, '.env'))

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
