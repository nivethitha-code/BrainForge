# 🧠 BrainForge — AI-Powered Exam Excellence Platform

> A cutting-edge full-stack application that leverages AI to generate personalized quizzes and track academic progress — from instant quiz generation to global leaderboards — all in one seamless experience.

---

## 🔗 Live Demo & Screenshots

🌐 **Deployed App:** [brainforge-theta.vercel.app](https://brainforge-theta.vercel.app)

| Sign In | Dashboard | Quiz Generation |
|-----------------|----------------|-----------------|
| ![Login Page](https://github.com/user-attachments/assets/25900a02-1e51-46e4-88a9-ebe5a2a52ea8) | ![Dashboard](https://github.com/user-attachments/assets/79e86f56-429a-43a6-a075-31699344dcef) | ![Generation](https://github.com/user-attachments/assets/9542b476-28b8-4f06-9576-05ec2cee9eed) |

---

## 🧱 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-f55036?style=for-the-badge&logo=groq&logoColor=white)
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

**Environment Variables**

`backend/.env`
```
DATABASE_URL=your_supabase_postgresql_url
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
```

`frontend/.env`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

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

**D Nivethitha** — [LinkedIn](https://www.linkedin.com/in/nivethitha-d-306a46326/) · [GitHub](https://github.com/nivethitha-code) · [Email](mailto:nivethithadharmarajan25@gmail.com) 

