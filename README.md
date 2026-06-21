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
## Automated Testing

The backend includes automated pytest-based validation for:

- Authentication
- Carbon footprint calculations
- AI Eco Coach scoring
- Emission tracking
- Badge achievement system
- Security utilities

Current metrics:

- 35+ automated tests
- 100% passing
- 66% code coverage
---


## 🧭 Interactive Guided Tour (Tutorial System)

The application features a built-in, immersive tutorial overlay to help first-time users confidently navigate the configuration workspace. 

### How It Works:
1. **Onboarding State Verification:** On component mount, the app queries `localStorage` for `has_boarded_v3`. If no flag is found, the tutorial sequence automatically triggers (`tourStep = 1`).
2. **Contextual Isolation:** The tour progresses through 4 specialized checkpoints by updating the component state step-by-step. It targets and visually highlights essential form modules via dynamic CSS classes (`relative z-[150] ring-4 ring-emerald-500/50`).
3. **The Step Pipeline:**

| Step | Target Focus | Overlay Insight Summary |
| :--- | :--- | :--- |
| **Step 1** | Transit Parameters | Breaks down where to log car & bus mileage data featuring helpful inline text placeholders. |
| **Step 2** | Dietary Profile | Highlights toggles for customizing meal configurations. |
| **Step 3** | Ledger Sync Button | Showcases the main synchronization CTA that securely flushes data payload states directly to the database. |
| **Step 4** | Complete Callout | Motivating final banner celebrating the tracking setup completion. |

4. **Persistence Layer:** Clicking **"Skip Tour ✕"** or completing the final step records `has_boarded_v3: "true"` directly to the client's local storage storage layout, ensuring returning users enter straight into the live dashboard workspace next time.

---
## 📸 App Showcase

![Malina Ikshan Showcase](slides.svg)

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

Built with ❤️ to promote sustainability and climate awareness.

*Malina-Ikshan (मलिन-ईक्षण) — "Pollution Monitor" in Sanskrit*

</div>
=======
</div>