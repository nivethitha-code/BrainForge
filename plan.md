BrainForge AI

Complete Full-Stack Development Blueprint

TeachEdison Fullstack Assignment · Coimbatore · Final Version





QuizMind AI is a full-stack AI-powered quiz application built for the TeachEdison hiring assignment. Users register with email OTP verification, accept a one-time Terms of Use agreement, then create AI-generated quizzes on any topic with flexible options per question. They take timed quizzes, review per-answer explanations, retake quizzes, and track complete attempt history — all inside a beautiful white-blue themed UI with cute mascot illustrations and smooth Framer Motion animations. Built with Next.js (JavaScript), Django REST, Supabase PostgreSQL, and GROQ AI.









## 1. Registration and Email Verification

User visits /register and fills name, email, password then submits

OTP Agent fires immediately — 6-digit code emailed via Resend

User redirected to /verify-email — enters the 6-digit code

On success — account activated — welcome email sent automatically

If OTP expires after 10 minutes — user can request a new one

Unverified users are blocked at the login endpoint with clear error



## 2. Login and Terms Agreement

User logs in at /login — receives JWT access token and refresh token

Tokens stored securely in httpOnly cookies — not localStorage

First login checks terms_accepted in USERS table

If false — Terms modal appears — user must click Accept to continue

terms_accepted set to true in DB — modal never shown again after that



## 3. Dashboard

Welcome banner with greeting and cute mascot waving illustration

Four stats cards — Total Quizzes Created, Total Attempts, Average Score, Best Score

Recent activity list — last 5 attempts with quiz name, score, date, time taken

Quick action button — Create New Quiz — prominently placed with animation

Navigation links to My Quizzes, Leaderboard, Profile



## 4. Quiz Creation

User goes to /quiz/create and fills the creation form:

Topic — free text like "React hooks" or "World War 2 battles"

Number of questions — slider from 5 to 20

Difficulty — Easy / Medium / Hard

Options per question — user picks 2, 3, or 4

Time limit — 5 / 10 / 15 / 20 / 30 minutes

Submit triggers /quiz/generating screen with animated mascot and progress bar

Quiz Generation Agent calls GROQ — validates JSON — saves atomically to DB

On success redirects to /quiz/[id]/preview



## 5. Quiz Preview

Shows quiz title, topic, difficulty, question count, time limit, options per question

All questions listed — question text only, no options or answers revealed

Mascot illustration cheering the user on

Two buttons — Start Quiz and Back to Dashboard



## 6. Taking the Quiz

Timer starts server-side — started_at saved to ATTEMPTS table immediately

One question shown at a time with animated slide transition

Options rendered dynamically — 2, 3, or 4 buttons based on options_per_question

Progress bar shows current position — Question 4 of 12

Previous and Next navigation — user can revisit unanswered questions

Timer visible top corner — pulses red and shakes when under 60 seconds

Auto-submits when timer hits zero — status set to timed_out

Submit button appears once all questions are answered



## 7. Results and Score

Redirected to /quiz/[id]/results after submission

Animated score reveal — number counts up from 0 to final score

Breakdown cards — correct count, incorrect count, skipped count, time taken

Mascot reacts — MascotCheer for good score, MascotSad for low score

Two action buttons — Review Answers and Retake Quiz



## 8. Answer Review

/quiz/[id]/review shows every question with full detail:

The question text

What the user selected — highlighted green if correct, red if wrong

The correct answer highlighted in green

AI-generated explanation paragraph for why the answer is correct

This data comes from GET /api/attempts/:id/ which only reveals answers post-submission



## 9. History and Retake

/quizzes shows all quizzes the user has created with attempt count and best score

Click a quiz — see every single attempt for it with date, score, time taken

Click any attempt — see full question by question breakdown of what was answered

Retake creates a brand new ATTEMPTS row with fresh timer — old history preserved







## Root Structure

quiz-app/

├── frontend/

│   ├── public/

│   │   ├── mascots/              ← doll illustrations per screen

│   │   └── icons/

│   ├── src/

│   │   ├── app/                  ← Next.js App Router pages (.js/.jsx)

│   │   ├── components/           ← all reusable UI components

│   │   ├── hooks/                ← custom React hooks

│   │   ├── lib/                  ← API client, utils, constants

│   │   ├── store/                ← Zustand global state slices

│   │   └── styles/               ← global CSS

│   ├── .env.local

│   ├── next.config.js

│   ├── tailwind.config.js

│   └── package.json



## All Pages — App Router

src/app/

├── (auth)/                       ← public route group — no sidebar

│   ├── login/

│   │   └── page.jsx

│   ├── register/

│   │   └── page.jsx

│   ├── verify-email/

│   │   └── page.jsx

│   └── forgot-password/

│       └── page.jsx

├── (app)/                        ← protected route group

│   ├── layout.jsx                ← sidebar + navbar wrapper

│   ├── dashboard/

│   │   └── page.jsx

│   ├── quizzes/

│   │   └── page.jsx              ← all quizzes + attempt history

│   ├── profile/

│   │   └── page.jsx

│   ├── leaderboard/

│   │   └── page.jsx

│   └── quiz/

│       ├── create/

│       │   └── page.jsx          ← topic + count + difficulty + options

│       ├── generating/

│       │   └── page.jsx          ← AI loading with mascot

│       └── [id]/

│           ├── preview/page.jsx

│           ├── take/page.jsx

│           ├── results/page.jsx

│           ├── review/page.jsx

│           └── retake/page.jsx

├── admin/

│   ├── users/page.jsx

│   └── quizzes/page.jsx

├── layout.jsx                    ← root layout + Zustand + providers

├── page.jsx                      ← landing redirect

└── not-found.jsx



## Components Folder — Complete Map

src/components/

├── ui/                           ← base design system components

│   ├── Button.jsx                ← primary, secondary, ghost, danger

│   ├── Input.jsx                 ← label + error + icon support

│   ├── Card.jsx                  ← base card with hover shadow

│   ├── Badge.jsx                 ← difficulty and status pills

│   ├── Modal.jsx                 ← accessible modal wrapper

│   ├── Spinner.jsx               ← loading spinner + skeleton

│   ├── Toast.jsx                 ← success / error / info toasts

│   ├── ProgressBar.jsx           ← animated fill bar

│   ├── Slider.jsx                ← range input for question count

│   └── Tooltip.jsx

├── layout/

│   ├── Navbar.jsx                ← top bar with avatar + logout

│   ├── Sidebar.jsx               ← collapsible nav links

│   ├── Footer.jsx

│   └── PageWrapper.jsx           ← Framer Motion fade-in wrapper

├── auth/

│   ├── LoginForm.jsx

│   ├── RegisterForm.jsx

│   ├── OTPInput.jsx              ← 6-box OTP entry UI

│   ├── TermsModal.jsx            ← must-accept modal one-time

│   └── AuthCard.jsx              ← white card + mascot layout

├── dashboard/

│   ├── StatsCard.jsx             ← animated number reveal card

│   ├── RecentActivity.jsx        ← last 5 attempts list

│   ├── WelcomeBanner.jsx         ← greeting + mascot

│   └── QuickActions.jsx          ← create quiz shortcut

├── quiz/

│   ├── CreateForm.jsx            ← full creation form with all fields

│   ├── GeneratingScreen.jsx      ← animated AI loading screen

│   ├── PreviewCard.jsx           ← quiz info before start

│   ├── QuestionCard.jsx          ← single question wrapper

│   ├── OptionButton.jsx          ← renders N options dynamically

│   ├── QuizTimer.jsx             ← countdown with red pulse warning

│   ├── QuizProgress.jsx          ← step indicator bar

│   ├── ResultCard.jsx            ← score + breakdown

│   ├── ReviewItem.jsx            ← Q + user answer + correct + explanation

│   ├── HistoryCard.jsx           ← one attempt row in history

│   └── AttemptList.jsx           ← all attempts for one quiz

├── mascots/

│   ├── MascotWave.jsx            ← login and welcome screens

│   ├── MascotThinking.jsx        ← generating screen

│   ├── MascotStudy.jsx           ← preview and taking quiz

│   ├── MascotCheer.jsx           ← good score results

│   └── MascotSad.jsx             ← low score results

└── charts/

    ├── ScoreChart.jsx            ← score over time line chart

    └── AccuracyBar.jsx           ← per-topic accuracy bar



## Zustand Store — Global State

src/store/

├── authStore.js    ← user object, JWT token, isLoggedIn, termsAccepted

├── quizStore.js    ← currentQuiz, questions, options, generatingStatus

└── attemptStore.js ← currentAttempt, answers, timer, score



## Lib and Hooks

src/lib/

├── api.js          ← axios instance with JWT interceptor + refresh logic

├── constants.js    ← difficulty options, time limits, option counts

└── utils.js        ← formatTime, calcScore, formatDate helpers

src/hooks/

├── useAuth.js      ← login, logout, register, verify actions

├── useQuiz.js      ← create, fetch, delete quiz actions

└── useTimer.js     ← countdown hook with auto-submit trigger







quiz-app/

└── backend/

    ├── config/

    │   ├── settings/

    │   │   ├── base.py           ← shared settings

    │   │   ├── development.py    ← DEBUG=True, local DB

    │   │   └── production.py     ← Render env, Redis, ALLOWED_HOSTS

    │   ├── urls.py               ← root URL config

    │   ├── wsgi.py

    │   └── asgi.py

    ├── apps/

    │   ├── accounts/             ← user authentication app

    │   │   ├── models.py         ← User, EmailOTP models

    │   │   ├── serializers.py    ← register, login, OTP serializers

    │   │   ├── views.py          ← all auth API views

    │   │   ├── routers.py        ← URL patterns for accounts

    │   │   ├── agents.py         ← OTPAgent, EmailAgent

    │   │   ├── schemas.py        ← request and response schemas

    │   │   ├── permissions.py    ← IsVerified, IsOwner

    │   │   └── tests.py

    │   └── quizzes/              ← quiz core app

    │       ├── models.py         ← Quiz, Question, Option, Attempt, Answer

    │       ├── serializers.py    ← nested serializers for quiz + options

    │       ├── views.py          ← all quiz API views

    │       ├── routers.py        ← URL patterns for quizzes

    │       ├── agents.py         ← QuizGenAgent, ScoringAgent, LeaderboardAgent

    │       ├── schemas.py        ← GROQ prompt builder and response validator

    │       ├── permissions.py    ← IsQuizOwner

    │       └── tests.py

    ├── core/

    │   ├── groq_client.py        ← GROQ API wrapper with retry logic

    │   ├── email_service.py      ← Resend API wrapper

    │   ├── supabase_client.py    ← Supabase connection helper

    │   ├── exceptions.py         ← custom DRF exception handlers

    │   └── pagination.py         ← standard page size config

    ├── scripts/

    │   └── create_tables.py      ← auto-creates all 7 tables in Supabase

    ├── requirements.txt

    ├── manage.py

    ├── .env

    ├── Procfile                  ← web: gunicorn config.wsgi

    └── render.yaml               ← Render deployment config









## Table 1 — USERS





## Table 2 — EMAIL_OTP



## Table 3 — QUIZZES





## Table 4 — QUESTIONS



## Table 5 — OPTIONS





## Table 6 — ATTEMPTS



## Table 7 — ANSWERS



## All Relationships







## Agent 1 — Quiz Generation Agent



Trigger: POST /api/quizzes/generate/ with topic, question_count, difficulty, options_per_question

Model: GROQ llama-3.3-70b-versatile

Retry: Up to 3 attempts — invalid JSON or wrong option count triggers retry with stricter prompt

Atomic save: Quiz row first → Question rows → Option rows — all in one transaction

correct_option_id: Set by matching correct_index from GROQ response to the saved OPTIONS row id

On failure: Return 503 — set quiz status to failed — show retry button on frontend



Prompt template:

Generate {question_count} MCQ questions about "{topic}" at {difficulty} difficulty.

Each question must have exactly {options_per_question} options. No more, no less.

Return ONLY valid JSON — no markdown, no explanation text:

{"title":"...","questions":[{"question":"...",

"options":["opt1","opt2","opt3"],"correct_index":0,

"explanation":"..."}]}

correct_index is 0-based position in the options array.



## Agent 2 — OTP Email Agent



Trigger: 1) User registers  2) User requests password reset

OTP generation: secrets.randbelow(1000000) formatted to always be 6 digits

Expiry: 10 minutes from created_at

Rate limit: Maximum 3 OTP requests per hour per email address

Validation checks: Not expired → not is_used → purpose matches → belongs to this user

On success: Mark is_used = true → activate account or update password

Welcome email: Sent automatically after successful email verification



## Agent 3 — Scoring Agent



Trigger: POST /api/attempts/:id/submit/ with list of {question_id, selected_option_id}

Scoring: is_correct = (selected_option_id == question.correct_option_id) for each answer

Time: time_taken_seconds = submitted_at minus started_at — both server-side timestamps

Atomicity: All ANSWERS rows saved in one DB transaction — fail means rollback not partial save

Timed out: If timer expired attempt is still scored — status set to timed_out

Returns: score, total, percentage, time_taken_seconds, per-question is_correct list



## Agent 4 — Leaderboard Agent



Trigger: Called automatically by Scoring Agent after every successful submission

Query: Top 10 ATTEMPTS by score for quiz_id — joined with USERS for username

Tiebreaker: Same score — lower time_taken_seconds wins

Cache: Django cache backed by Redis on Render — 5 minute TTL

Endpoint: GET /api/quizzes/:id/leaderboard/ — cache hit first, DB query as fallback







## Auth Endpoints



## Quiz Endpoints



## Attempt and Answer Endpoints







All 7 tables are created automatically by running this script once after the first deploy. It connects to Supabase using the service role key and executes raw SQL with all constraints, foreign keys, indexes, and cascade rules in the correct dependency order.



# Run once after deploy:  python scripts/create_tables.py



# Creation order matters — follow FK dependencies:

# 1. users

# 2. email_otp          (FK → users)

# 3. quizzes            (FK → users)

# 4. questions          (FK → quizzes) — without correct_option_id first

# 5. options            (FK → questions)

# 6. ALTER questions    ADD correct_option_id FK → options

# 7. attempts           (FK → quizzes, users)

# 8. answers            (FK → attempts, questions, options)



# All PKs:    gen_random_uuid()

# All times:  TIMESTAMPTZ

# All FKs:    ON DELETE CASCADE

# Indexes:    on all FK columns for query performance







## Colour Palette



## Mascot Placement per Screen



## Framer Motion Animation Plan

Page transitions: Fade-in plus 8px slide-up on every route change — 300ms ease

Cards: Hover scale 1.02 with shadow deepening — 200ms ease

Option buttons: Spring bounce on selection plus colour flash — green correct, red wrong

Score reveal: Number counts up from 0 to final score over 1.5 seconds

Mascots: Gentle float loop — translateY 0 to minus 8px — 3 second cycle

Timer warning: Pulse red and subtle shake animation when under 60 seconds

Generating screen: Rotating gear plus progress bar fill animation

Toast notifications: Slide in from top-right — auto-dismiss after 4 seconds

Sidebar: Smooth collapse and expand with width transition







## Frontend Environment — .env.local

NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_APP_NAME=QuizMind AI



## Backend Environment — .env

SECRET_KEY=your-django-secret-key-here

DEBUG=True

SUPABASE_URL=https://xxxxx.supabase.co

SUPABASE_SERVICE_KEY=eyJhbGci...

SUPABASE_DB_URL=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres

GROQ_API_KEY=gsk_...

RESEND_API_KEY=re_...

FRONTEND_URL=http://localhost:3000

JWT_ACCESS_EXPIRY_MINUTES=15

JWT_REFRESH_EXPIRY_DAYS=7

REDIS_URL=redis://localhost:6379



## Local Development — Step by Step

1. git clone https://github.com/yourname/quizmind-ai

2. cd backend → pip install -r requirements.txt → cp .env.example .env → fill values

3. python scripts/create_tables.py — creates all 7 tables in Supabase

4. python manage.py runserver — Django runs on http://localhost:8000

5. cd frontend → npm install → cp .env.local.example .env.local → fill values

6. npm run dev — Next.js runs on http://localhost:3000



## Production Deployment



## render.yaml — Render Config

services:

  - type: web

    name: quizmind-backend

    env: python

    buildCommand: pip install -r requirements.txt

    startCommand: gunicorn config.wsgi:application

    envVars:

      - key: PYTHON_VERSION

        value: 3.11.0







Project title with live demo links — Vercel URL and Render URL

Screenshot or GIF of the running app

Tech stack badges

Local setup — step by step instructions

Database design decisions:

Why OPTIONS is a separate table and not fixed columns

Why correct_option_id is a FK not a stored letter

Why started_at is server-side for timer integrity

Why is_correct is stored rather than computed on read

API structure overview — auth vs quiz vs attempt grouping

Agent descriptions — what each of the 4 agents does

Challenges faced:

GROQ JSON validation — solved with retry and strict prompt schema

Circular FK between QUESTIONS and OPTIONS — solved with ALTER TABLE after both created

Server-side timer — solved by storing started_at in ATTEMPTS immediately

Dynamic options rendering — solved by reading options_per_question from quiz

Features implemented vs skipped with honest reasons why

Architectural decisions — why Supabase, why Render, why Zustand over Redux









Built with purpose. Designed to impress. Ready to ship.  🚀

### Table 1

| 🎯  Project Overview What we are building — tech stack and all features |

### Table 2

| Tech Stack | Core Features |
| Next.js 14 App Router (JavaScript) | Email OTP verification (signup + reset) |
| Django 5 + Django REST Framework | Terms acceptance modal — one time only |
| Supabase — PostgreSQL database | Server-side quiz timer — prevents cheating |
| GROQ API — llama-3.3-70b-versatile | Dynamic options per question — user choice |
| Resend — transactional email | Per-answer AI explanations generated upfront |
| JWT — djangorestframework-simplejwt | Quiz preview page before starting |
| Zustand — global state management | Full attempt history per quiz |
| Tailwind CSS — white blue theme | Retake with fresh attempt — history preserved |
| Framer Motion — animations | Leaderboard per quiz — Redis cached |
| Vercel — frontend deployment | Dashboard with stats and score charts |
| Render — backend deployment | Admin panel — bonus feature |

### Table 3

| 🚶  Complete User Flow Every step from landing to retake |

### Table 4

| 🎨  Frontend Structure Next.js 14 App Router — JavaScript — complete file map |

### Table 5

| ⚙️  Backend Structure Django 5 + DRF — complete folder and file map |

### Table 6

| 🗄️  Database Design All 7 tables — final corrected version |

### Table 7

| Key design decisions 1) OPTIONS is a separate table — not fixed columns — so each question supports 2/3/4 options dynamically based on user choice at creation time.  2) correct_option_id in QUESTIONS is a FK pointing to the exact OPTIONS row — no letter comparison needed.  3) terms_accepted_at removed — the boolean alone is sufficient.  4) All 7 tables are in 3NF with two intentional justified denormalizations: is_correct in ANSWERS and time_taken_seconds in ATTEMPTS — both stored to avoid expensive recomputation on every read.  5) All tables auto-created via scripts/create_tables.py on first deploy. |

### Table 8

| Column | Type | Constraint | Notes |
| id | uuid | PRIMARY KEY | Auto-generated via gen_random_uuid() |
| email | varchar(255) | UNIQUE NOT NULL | UK — no two users share an email |
| username | varchar(100) | UNIQUE NOT NULL | UK — no two users share a username |
| password_hash | varchar(255) | NOT NULL | bcrypt hashed — never stored plain |
| is_verified | boolean | DEFAULT false | Set true after OTP verification |
| terms_accepted | boolean | DEFAULT false | Set true after Terms modal accept |
| created_at | timestamptz | DEFAULT now() | Account creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Auto-updated via DB trigger |

### Table 9

| UK = Unique Key — explained Both email and username carry a Unique Key constraint meaning no two rows can share the same value. If a duplicate is attempted PostgreSQL throws a unique constraint violation and Django returns a clean "This email is already registered" error to the user. UK is different from PK — PK is the main row identifier (id), UK just enforces uniqueness on other columns. A table can have multiple UKs but only one PK. |

### Table 10

| Column | Type | Constraint | Notes |
| id | uuid | PRIMARY KEY |  |
| user_id | uuid | FK → users.id | CASCADE delete when user deleted |
| otp_code | varchar(6) | NOT NULL | 6-digit numeric code |
| purpose | varchar(20) | NOT NULL | verify_email  or  reset_password |
| is_used | boolean | DEFAULT false | Marked true after successful use |
| expires_at | timestamptz | NOT NULL | Created at plus 10 minutes |
| created_at | timestamptz | DEFAULT now() | When OTP was issued |

### Table 11

| Column | Type | Constraint | Notes |
| id | uuid | PRIMARY KEY |  |
| created_by | uuid | FK → users.id | Quiz owner — CASCADE delete |
| title | varchar(200) | NOT NULL | AI-generated title from topic |
| topic | varchar(200) | NOT NULL | Free text entered by user |
| question_count | smallint | NOT NULL | Between 5 and 20 |
| options_per_question | smallint | NOT NULL | 2, 3, or 4 — user sets at creation |
| difficulty | varchar(10) | NOT NULL | easy / medium / hard |
| time_limit_seconds | integer | NOT NULL | 300 / 600 / 900 / 1200 / 1800 |
| status | varchar(20) | DEFAULT ready | ready / generating / failed |
| created_at | timestamptz | DEFAULT now() |  |

### Table 12

| options_per_question — how it flows User picks 2, 3, or 4 on the create form. This number is saved in QUIZZES.options_per_question. The Quiz Generation Agent reads it and tells GROQ to generate exactly that many options per question. GROQ returns that many option texts. The agent saves exactly that many rows into the OPTIONS table per question. Every question in the quiz has the same count — consistent throughout. |

### Table 13

| Column | Type | Constraint | Notes |
| id | uuid | PRIMARY KEY |  |
| quiz_id | uuid | FK → quizzes.id | CASCADE delete with parent quiz |
| order_index | smallint | NOT NULL | 1-based ordering within quiz |
| question_text | text | NOT NULL | The question shown to the user |
| correct_option_id | uuid | FK → options.id | Points to the correct OPTIONS row |
| explanation | text | NOT NULL | AI explanation — stored at creation time |

### Table 14

| Column | Type | Constraint | Notes |
| id | uuid | PRIMARY KEY |  |
| question_id | uuid | FK → questions.id | CASCADE delete with question |
| option_text | text | NOT NULL | The text of this choice |
| order_index | smallint | NOT NULL | 1-based display order per question |

### Table 15

| Why OPTIONS is a separate table — normalization Fixed columns like option_a, option_b, option_c, option_d violate 1NF — they are a repeating group representing the same thing duplicated across columns. The separate OPTIONS table gives one row per option, achieves 1NF compliance, and scales to any number of options. All 7 tables satisfy 3NF. Each question owns its option rows via question_id FK — querying OPTIONS WHERE question_id = X returns exactly that question's choices with no mixing across questions. |

### Table 16

| Column | Type | Constraint | Notes |
| id | uuid | PRIMARY KEY |  |
| quiz_id | uuid | FK → quizzes.id | Which quiz was attempted |
| user_id | uuid | FK → users.id | Who attempted it |
| started_at | timestamptz | NOT NULL | Server time — prevents timer cheating |
| submitted_at | timestamptz | NULLABLE | Null while attempt is in progress |
| score | smallint | NULLABLE | Correct answer count — set after submit |
| total_questions | smallint | NOT NULL | Snapshot of question_count at attempt time |
| status | varchar(20) | DEFAULT in_progress | in_progress / completed / timed_out |
| time_taken_seconds | integer | NULLABLE | submitted_at minus started_at — stored for performance |

### Table 17

| Column | Type | Constraint | Notes |
| id | uuid | PRIMARY KEY |  |
| attempt_id | uuid | FK → attempts.id | CASCADE delete with attempt |
| question_id | uuid | FK → questions.id | Which question this answer is for |
| selected_option_id | uuid | FK → options.id NULLABLE | Null if user skipped this question |
| is_correct | boolean | NOT NULL | Computed at submit — stored for performance |
| time_taken_seconds | integer | NULLABLE | Time spent on this single question |

### Table 18

| Relationship | Meaning |
| USERS → EMAIL_OTP (1 : many) | One user has many OTP records — verify_email and reset_password |
| USERS → QUIZZES (1 : many) | One user creates many quizzes |
| USERS → ATTEMPTS (1 : many) | One user makes many attempts across all quizzes |
| QUIZZES → QUESTIONS (1 : many) | One quiz contains 5 to 20 questions |
| QUESTIONS → OPTIONS (1 : many) | One question owns 2/3/4 option rows in OPTIONS table |
| QUESTIONS → OPTIONS (1 : 1 via correct_option_id) | correct_option_id points to exactly one OPTIONS row — the right answer |
| QUIZZES → ATTEMPTS (1 : many) | One quiz can be attempted many times by many users |
| ATTEMPTS → ANSWERS (1 : many) | One attempt records one ANSWERS row per question — full history |
| QUESTIONS → ANSWERS (1 : many) | One question is answered across many attempts — analytics ready |
| OPTIONS → ANSWERS (1 : many) | One option can be selected across many different attempt answers |

### Table 19

| 🤖  AI Agents All 4 agents — goal, trigger, logic, failure handling |

### Table 20

| 🎯 Goal Accept topic, question_count, difficulty, and options_per_question. Call GROQ with a strict JSON prompt. Validate the response — correct number of questions, correct number of options each, correct_index in bounds. Retry up to 3 times on failure. Save Quiz + Questions + Options atomically in one DB transaction. Never save partial or malformed data. |

### Table 21

| 🎯 Goal Generate a cryptographically secure 6-digit OTP, store it with purpose and expiry, send a formatted email via Resend, then validate OTPs on submission checking expiry, reuse prevention, purpose match, and rate limiting. |

### Table 22

| 🎯 Goal At quiz submission compare every selected_option_id against the question's correct_option_id, compute total score, calculate time taken using server-side timestamps, and persist all ANSWERS rows in a single atomic DB transaction. Never allow partial saves. |

### Table 23

| 🎯 Goal After every quiz submission compute and cache the top 10 scores for that quiz so the leaderboard page loads instantly without running a slow DB query on every request. |

### Table 24

| 🔌  API Reference Every REST endpoint — method, path, description, auth |

### Table 25

| Method | Endpoint | Description | Auth |
| POST | /api/auth/register/ | Register user and trigger OTP email | Public |
| POST | /api/auth/verify-email/ | Validate OTP and activate account | Public |
| POST | /api/auth/login/ | Login and receive JWT access + refresh tokens | Public |
| POST | /api/auth/token/refresh/ | Refresh expired access token | Public |
| POST | /api/auth/logout/ | Blacklist refresh token | Required |
| POST | /api/auth/forgot-password/ | Send password reset OTP to email | Public |
| POST | /api/auth/reset-password/ | Validate OTP and set new password | Public |
| POST | /api/auth/accept-terms/ | Set terms_accepted = true in USERS | Required |
| GET | /api/auth/me/ | Get current user profile and stats | Required |
| PATCH | /api/auth/me/ | Update username or password | Required |

### Table 26

| Method | Endpoint | Description | Auth |
| POST | /api/quizzes/generate/ | Call GROQ — save Quiz + Questions + Options atomically | Required |
| GET | /api/quizzes/ | List user quizzes paginated — newest first | Required |
| GET | /api/quizzes/:id/ | Quiz detail + questions — options shown, correct answers hidden | Required |
| DELETE | /api/quizzes/:id/ | Soft delete quiz — owner only | Required |
| GET | /api/quizzes/:id/leaderboard/ | Top 10 scores for this quiz — served from cache | Required |
| GET | /api/quizzes/:id/attempts/ | All attempts for one quiz — for history page | Required |

### Table 27

| Method | Endpoint | Description | Auth |
| POST | /api/quizzes/:id/attempts/ | Start attempt — record started_at server-side | Required |
| POST | /api/attempts/:id/submit/ | Submit answers — trigger Scoring Agent | Required |
| GET | /api/attempts/:id/ | Full attempt with answers + explanations — post-submit only | Required |
| GET | /api/attempts/ | Current user full attempt history across all quizzes | Required |

### Table 28

| ⚡  Supabase Auto Table Creation scripts/create_tables.py — run once after deploy |

### Table 29

| 💎  UI and UX Design System White-blue theme, mascots, motion |

### Table 30

| Name | Hex |
| Primary Blue | #3B82F6 |
| Blue Dark | #1E40AF |
| Blue Light | #DBEAFE |
| Blue Pale | #EFF6FF |
| White | #FFFFFF |
| Text Primary | #111827 |
| Text Muted | #6B7280 |
| Success Green | #10B981 |
| Error Red | #EF4444 |
| Border Gray | #E5E7EB |

### Table 31

| Screen | Mascot and Pose |
| Login and Register | MascotWave — waving hello with friendly pose |
| Email Verify page | MascotThinking — holding an envelope |
| Terms Modal | MascotStudy — reading a scroll |
| Dashboard | MascotCheer — arms raised celebrating |
| Quiz Create form | MascotStudy — holding a pencil |
| Generating screen | MascotThinking — gears spinning animation |
| Quiz Preview | MascotStudy — excited and ready |
| Taking Quiz | MascotStudy — focused and concentrating |
| Results — score over 70% | MascotCheer — jumping celebrating |
| Results — score under 70% | MascotSad — comforting and supportive |
| History and Retake | MascotWave — browsing casually |
| Error and 404 pages | MascotSad — sorry apologetic face |

### Table 32

| 🚀  Deployment and Environment Local dev, env vars, Vercel and Render |

### Table 33

| Layer | Setup Notes |
| Frontend — Vercel | Connect GitHub repo — auto deploys on every push — add env vars in Vercel dashboard |
| Backend — Render | New web service — connect GitHub — auto detects Procfile — add env vars — free tier |
| Database — Supabase | Free tier — 500MB storage — 2 projects — tables auto-created by script on first run |
| Email — Resend | Free tier — 3000 emails per month — more than enough for assignment demo |
| Cache — Redis | Render Redis add-on — free tier — used by Leaderboard Agent cache |
| AI — GROQ | Free tier — generous rate limits — llama-3.3-70b-versatile available free |

### Table 34

| 📄  README Structure What your GitHub README must include |

### Table 35

| ✅  Submission Checklist Every TeachEdison evaluation criterion covered |

### Table 36

| Feature Implemented | Evaluation Criteria Covered |
| ✅ User registration and login | System thinking — complete user flow |
| ✅ Email OTP verification | Security — OTP rate limit and expiry |
| ✅ Terms acceptance modal — one time | UX — one-time agreement stored in DB |
| ✅ Quiz creation form with all fields | Decision making — all settings captured |
| ✅ Dynamic options — 2 / 3 / 4 per question | Flexibility — proper OPTIONS table design |
| ✅ GROQ AI generation with retry logic | Resilience — 3 retries with validation |
| ✅ Atomic DB save — never partial data | Reliability — atomic transactions |
| ✅ Quiz preview before starting | UX — informed decision before starting |
| ✅ Server-side timer — anti-cheat | Security — prevents browser timer manipulation |
| ✅ Dynamic option buttons on quiz screen | Code quality — reads from options_per_question |
| ✅ Auto-submit on timer expiry | UX — graceful time limit handling |
| ✅ Score and results screen animated | UX — animated engaging feedback |
| ✅ Per-answer AI explanation on review | Learning value — AI powered explanations |
| ✅ Full answer review page | Learning value — see every answer reviewed |
| ✅ Quiz history list with all attempts | System thinking — full history preserved |
| ✅ Click attempt — full Q and A breakdown | System thinking — attempt level detail |
| ✅ Retake — fresh attempt — history kept | Feature completeness — retake supported |
| ✅ Leaderboard — Redis cached | Performance — cache aware design |
| ✅ Dashboard with stats and charts | UX — meaningful data on landing screen |
| ✅ Zustand global state management | Code quality — clean state management |
| ✅ Responsive UI — mobile ready | Code quality — responsive layout |
| ✅ Error handling — all edge cases | Code quality — graceful failure handling |
| ✅ Mascot illustrations on every screen | UX — wow factor and personality |
| ✅ Framer Motion animations throughout | UX — smooth professional interactions |
| ✅ Admin panel — bonus feature | Initiative — went beyond base requirements |
| ✅ Deployed frontend on Vercel | Deliverable — as required by TeachEdison |
| ✅ Deployed backend on Render | Deliverable — Render as requested |
| ✅ GitHub repo with clean JS structure | Code quality — readable JS structure |
| ✅ README with full architecture notes | Deliverable — architectural decisions clear |
| ✅ Supabase auto-create script | System thinking — auto setup script |

