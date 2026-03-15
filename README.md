# 🧠 BrainForge AI Quizz App — Quick Start Guide

Welcome buddy! Don't worry, getting this app running is easy. Just follow these steps:

## 1. Prerequisites
Make sure you have these installed on your Windows machine:
- **Python 3.10+**: [Download here](https://www.python.org/downloads/)
- **Node.js**: [Download here](https://nodejs.org/)

## 2. Setting up API Keys (Crucial!)
Open these files and fill in your keys:
1. **Backend**: `backend/.env`
   - You need a **Supabase** account (for the database).
   - You need a **GROQ** API key (for the AI generation).
   - You need a **Resend** API key (for emailing OTPs).
2. **Frontend**: `frontend/.env`
   - Set `NEXT_PUBLIC_API_URL=http://localhost:8000`

## 3. Launching the Backend
Open a terminal in the `backend` folder and run:
```powershell
# 1. Install dependencies
pip install -r requirements.txt

# 2. Setup the database (creates tables in Supabase)
python scripts/setup_db.py

# 3. Start the server
python manage.py runserver
```

## 4. Launching the Frontend
Open a **new** terminal in the `frontend` folder and run:
```powershell
# 1. Install dependencies
npm install

# 2. Start the app
npm run dev
```
Now open [http://localhost:3000](http://localhost:3000) in your browser!

## 5. Deployment (Hosting)
The project is ready to be hosted! 🚀

- **Backend (Render)**:
  - Connect your GitHub repo.
  - Set Build Command: `./build.sh` (make sure to `chmod +x build.sh` in your repo).
  - Set Start Command: `gunicorn config.wsgi:application`.
  - Add all `.env` variables to Render's Environment section.
- **Frontend (Vercel)**:
  - Connect your GitHub repo.
  - Set Framework Preset: `Next.js`.
  - Add `NEXT_PUBLIC_API_URL` (your Render backend URL) to Vercel's Environment Variables.

---
*Created with ❤️ by Antigravity*
