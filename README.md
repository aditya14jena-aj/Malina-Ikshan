# Malina-Ikshan

Full-stack application with a React + Vite + Tailwind CSS frontend and a FastAPI + SQLite backend.

## Structure
- `/frontend`: React application
- `/backend`: FastAPI application
- `/docs`: Documentation
- `/screenshots`: Project screenshots

## Run Instructions

### Prerequisites
- Node.js
- Python 3.8+

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
The API will be available at http://127.0.0.1:8000. Interactive docs are at http://127.0.0.1:8000/docs.

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
The frontend will be available at http://localhost:5173.
