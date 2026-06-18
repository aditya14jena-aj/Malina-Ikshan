<div align="center">

# 🌍 Malina-Ikshan (मलिन-ईक्षण)

### AI-Powered Carbon Footprint Tracking & Sustainability Insights

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://malina-ikshan.vercel.app)
[![Backend on Render](https://img.shields.io/badge/Backend-Render-purple?logo=render)](https://malina-ikshan.onrender.com)

**Malina-Ikshan** is a full-stack sustainability platform that helps individuals understand, track, and reduce their carbon footprint through activity monitoring, emissions analytics, and AI-powered recommendations.

[🚀 Live Demo](https://malina-ikshan.vercel.app) · [📖 API Docs](https://malina-ikshan.onrender.com/docs) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌱 **Carbon Footprint Calculator** | Estimate your emissions from daily activities |
| 📊 **Daily Activity Tracking** | Log and monitor your carbon-generating habits |
| 📈 **Emissions Dashboard** | Visualize your footprint over time with charts |
| 🤖 **AI Sustainability Coach** | Get personalized advice powered by AI |
| 🎯 **Smart Recommendations** | Actionable tips tailored to your lifestyle |
| 🏆 **Community Leaderboard** | Compare progress and stay motivated |
| 📱 **Responsive UI** | Seamless experience across all devices |
| 📉 **Data Visualizations** | Rich analytics to understand your impact |

---

## 🛠 Tech Stack

### Frontend
- **[React](https://reactjs.org/)** — Component-based UI
- **[Vite](https://vitejs.dev/)** — Lightning-fast dev tooling
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — High-performance Python API framework
- **[SQLAlchemy](https://www.sqlalchemy.org/)** — ORM for database management
- **PostgreSQL** (production) / **SQLite** (development)

### Deployment
- **[Vercel](https://vercel.com/)** — Frontend hosting
- **[Render](https://render.com/)** — Backend + managed database

---

## 📁 Project Structure

```
malina-ikshan/
├── frontend/          # React application
├── backend/           # FastAPI application
├── docs/              # Project documentation
└── screenshots/       # Application screenshots
```

---

## 🚀 Local Development

### Prerequisites

- Node.js v16+
- Python 3.8+
- PostgreSQL (for production testing)

---

### ⚙️ Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
```

> ⚠️ **Never hardcode credentials in source code.** Always use environment variables.

#### Run the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

| | URL |
|---|---|
| **Local API** | `http://localhost:8000` |
| **Local API Docs** | `http://localhost:8000/docs` |
| **Production API** | `https://malina-ikshan.onrender.com` |
| **Production API Docs** | `https://malina-ikshan.onrender.com/docs` |

---

### 🎨 Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

| | URL |
|---|---|
| **Local Frontend** | `http://localhost:5173` |
| **Production Frontend** | `https://malina-ikshan.vercel.app` |

#### Vercel Environment Variable

```env
VITE_API_URL=https://malina-ikshan.onrender.com
```

---

## 🗄 Database

| Environment | Database |
|---|---|
| Development | SQLite (no setup required) |
| Production | PostgreSQL (Render Managed Database) |

---

## 🔥 API Reference

| Feature | Endpoints |
|---|---|
| **Authentication** | `POST /register`, `POST /login` |
| **Emissions** | `/api/emissions/*` |
| **Activity Logs** | `/logs/*` |
| **Achievements** | `/achievements/*` |
| **Leaderboard** | `/leaderboard/*` |

Full interactive documentation available at [`/docs`](https://malina-ikshan.onrender.com/docs).

---

## 🔐 Security

- All secrets stored in `.env` files (never committed)
- No hardcoded API URLs or credentials in source code
- JWT-based authentication
- CORS restricted in production environments

---

## 🚀 Roadmap

- [ ] OCR-based utility bill scanning
- [ ] Carbon reduction goal tracking
- [ ] Gamification system with badges and streaks
- [ ] Community challenges
- [ ] Advanced AI sustainability insights
- [ ] Mobile app (iOS & Android)

---

<<<<<<< HEAD
=======
## 📸 App Showcase

![Malina Ikshan Showcase](slides.svg)

---

>>>>>>> a8abeaa (Updating APP Showcase)
## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

Built with ❤️ to promote sustainability and climate awareness.

*Malina-Ikshan (मलिन-ईक्षण) — "Pollution Monitor" in Sanskrit*

<<<<<<< HEAD
</div>
=======
</div>
>>>>>>> a8abeaa (Updating APP Showcase)
