# 🧠 BrainForge — AI-Powered Quiz platform

> A full-stack application that leverages AI to generate personalized quizzes and track academic progress — from instant quiz generation to global leaderboards — all in one seamless experience.

---

## 🔗 Live Demo

🌐 **Deployed App:** [brainforge.vercel.app](https://brain-forge-silk.vercel.app)

---

## 🧱 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-f55036?style=for-the-badge&logo=groq&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![Uptime Robot](https://img.shields.io/badge/Uptime%20Robot-3BD671?style=for-the-badge&logo=uptimerobot&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🚀 Installation & Setup

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/scripts/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Structure

**Auth**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register/ | Register and trigger OTP email |
| POST | /auth/verify-email/ | Validate OTP and activate account |
| POST | /auth/login/ | Login and receive JWT tokens |
| POST | /auth/token/refresh/ | Refresh expired access token |
| POST | /auth/accept-terms/ | Store terms acceptance (confirmed) |
| GET | /auth/me/ | Get current user profile |
| PATCH | /auth/me/ | Update user profile / settings |

**Quizzes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /quizzes/generate/ | AI quiz generation via GROQ (Atomic) |
| GET | /quizzes/ | List user's created quizzes |
| GET | /quizzes/:id/ | Quiz detail with questions & options |
| DELETE | /quizzes/:id/ | Delete quiz |
| GET | /quizzes/stats/ | User's quiz stats (Avg Score, Best Score) |

**Attempts & Leaderboard**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /attempts/start/:quiz_id/ | Create a new active attempt session |
| POST | /attempts/:id/submit/ | Submit answers and calculate score |
| GET | /attempts/:id/ | Retrieve full attempt result with review |
| GET | /attempts/ | User's full attempt history |
| GET | /attempts/leaderboard/ | Global Top 10 + current user rank |

---

## 💡 Usage

- **Register** with your email and verify via the OTP sent to your inbox.
- **Generate Quiz** → Enter a topic (e.g., "Quantum Physics") and let AI create questions for you.
- **Take Quiz** → Race against the clock to answer questions and earn scores.
- **Leaderboard** → Compare your accuracy and speed with other users globally.

---

## ✨ Features

**🔐 Secure Authentication**
- JWT-based login and registration with email verification.
- Defensive registration logic: Automatically cleans up unverified accounts to allow re-registration if OTP is missed.
- Secure token storage using Zustand persistence and interceptors for seamless API calls.

**🤖 AI Quiz Generation**
- Powered by **Groq (Llama-3.3-70B)** for lightning-fast, high-quality MCQ generation.
- Dynamic difficulty scaling and customizable question counts.
- Transactional "atomic" saving: Ensures quiz data is perfectly structured before being marked as 'ready'.

**📊 Analytics & Leaderboard**
- Aggregated user statistics (Average Score, Best Score, Weekly Challenges).
- Global Leaderboard ranking users by total performance across all attempts.
- Automated rank-climb alerts: Be notified when someone overtakes your spot!

**📨 Smart Email System**
- Transactional emails via **Resend** for OTP delivery and welcome greetings.
- Lazy-loaded email architecture: Prevents external service delays from slowing down the main server boot.

---

## ⏭️ Features Skipped & Why

| Feature | Reason |
|---|---|
| **Admin Panel** | Skipped to focus on delivering a complete, polished user-facing experience. Admin functionality can be layered on top of the existing API endpoints in a future iteration. |
| **Classroom / Teacher Mode** | Would require a separate role-based access system, class management, student invitation flows, and a completely different user journey — essentially a second application on top of this one. A solid generalized AI quiz platform was prioritized over a half-finished classroom feature.Mainly due to time constraint |
| **Real-time Multiplayer** | Would require WebSocket integration which adds significant infrastructure complexity beyond the assignment requirements.Mainly due to time constraint |

---

## 📚 Key Learnings & Challenges

- **Overcoming Hydration/Prerender Errors**: Fixed a critical Next.js 14 error where `useSearchParams` caused build failures by wrapping components in `<Suspense />` boundaries.
- **Render Free Tier Optimization**: Solved `SIGKILL` and `Worker Timeout` issues by optimizing Gunicorn settings (`--timeout 150`, `--workers 1`) and moving heavy libraries to "Lazy Imports" to fit within 512MB RAM 
- **Dependency Version Conflicts**: Resolved an `ImportError` in the `groq-sdk` by performing a partial dependency upgrade and shifting to function-level imports to ensure Django could boot even if SDKs failed.
- **User Experience "Limbo"**: Implemented a "Delete-on-Retry" logic for unverified users, ensuring that a lost OTP doesn't lock a user out of their chosen email address.

---

## 🗂️ Project Structure

```
BrainForge/
├── backend/
│   ├── apps/
│   │   ├── accounts/     # User Auth, OTP, Profile
│   │   └── quizzes/      # Quiz models, AI Logic, Attempts
│   ├── core/             # AI (Groq) & Email (Resend) clients
│   ├── config/           # Django settings & URL routing
│   └── scripts/          # Database migration tools
└── frontend/
    └── src/
        ├── app/          # Next.js App Router (Auth/App/Quiz)
        ├── components/   # Atomic UI & Framer Motion assets
        ├── lib/          # Axios API wrappers
        └── store/        # Zustand state management
```

---

## 📄 License & Author

MIT License © 2026

**D Nivethitha** — [LinkedIn](https://www.linkedin.com/in/nivethitha-d-306a46326/) · [GitHub](https://github.com/nivethitha-code) · [Email](nivethithadharmarajan25@gmail.com) 

