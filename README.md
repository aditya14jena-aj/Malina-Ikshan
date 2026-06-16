# Malina-Ikshan (मलिन-ईक्षण)

**AI-Powered Carbon Footprint Tracking and Sustainability Insights**

Malina-Ikshan is a full-stack sustainability platform that helps individuals understand, track, and reduce their carbon footprint through activity monitoring, emissions analytics, and AI-powered recommendations.

## Features

* Carbon footprint calculator
* Daily activity tracking
* Emissions dashboard
* Personalized sustainability recommendations
* AI-powered sustainability coach
* Responsive modern UI
* Data visualization and analytics

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* FastAPI
* SQLite
* SQLAlchemy

### Deployment

* Vercel (Frontend)
* Render (Backend)

## Project Structure

/frontend – React application

/backend – FastAPI application

/docs – Project documentation

/screenshots – Application screenshots

## Local Development

### Prerequisites

* Node.js
* Python 3.8+

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

Backend:
http://127.0.0.1:8000

API Docs:
http://127.0.0.1:8000/docs

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:
http://localhost:5173

## Future Enhancements

* OCR-based utility bill scanning
* Carbon reduction goal tracking
* Gamification and achievement badges
* Community leaderboard
* Advanced AI recommendations

## License

MIT License
