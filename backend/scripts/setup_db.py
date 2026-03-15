import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

def setup_database():
    if not DB_URL:
        print("Error: DATABASE_URL not found in environment variables.")
        return

    commands = [
        # Create schema
        "CREATE SCHEMA IF NOT EXISTS quiz_app;",
        
        # Table 1: users
        """
        CREATE TABLE IF NOT EXISTS quiz_app.users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            is_verified BOOLEAN DEFAULT false,
            terms_accepted BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
        """,

        # Table 2: email_otp
        """
        CREATE TABLE IF NOT EXISTS quiz_app.email_otp (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES quiz_app.users(id) ON DELETE CASCADE,
            otp_code VARCHAR(6) NOT NULL,
            purpose VARCHAR(20) NOT NULL,
            is_used BOOLEAN DEFAULT false,
            expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now()
        );
        """,

        # Table 3: quizzes
        """
        CREATE TABLE IF NOT EXISTS quiz_app.quizzes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_by UUID REFERENCES quiz_app.users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            topic VARCHAR(200) NOT NULL,
            question_count SMALLINT NOT NULL,
            options_per_question SMALLINT NOT NULL,
            difficulty VARCHAR(10) NOT NULL,
            time_limit_seconds INTEGER NOT NULL,
            status VARCHAR(20) DEFAULT 'ready',
            created_at TIMESTAMPTZ DEFAULT now()
        );
        """,

        # Table 4: questions (without correct_option_id initially to avoid circular dependency)
        """
        CREATE TABLE IF NOT EXISTS quiz_app.questions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            quiz_id UUID REFERENCES quiz_app.quizzes(id) ON DELETE CASCADE,
            order_index SMALLINT NOT NULL,
            question_text TEXT NOT NULL,
            explanation TEXT NOT NULL,
            correct_option_id UUID
        );
        """,

        # Table 5: options
        """
        CREATE TABLE IF NOT EXISTS quiz_app.options (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            question_id UUID REFERENCES quiz_app.questions(id) ON DELETE CASCADE,
            option_text TEXT NOT NULL,
            order_index SMALLINT NOT NULL
        );
        """,

        # Add circular FK for correct_option_id
        "ALTER TABLE quiz_app.questions ADD CONSTRAINT fk_correct_option FOREIGN KEY (correct_option_id) REFERENCES quiz_app.options(id) ON DELETE SET NULL;",

        # Table 6: attempts
        """
        CREATE TABLE IF NOT EXISTS quiz_app.attempts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            quiz_id UUID REFERENCES quiz_app.quizzes(id) ON DELETE CASCADE,
            user_id UUID REFERENCES quiz_app.users(id) ON DELETE CASCADE,
            started_at TIMESTAMPTZ NOT NULL,
            submitted_at TIMESTAMPTZ,
            score SMALLINT,
            total_questions SMALLINT NOT NULL,
            status VARCHAR(20) DEFAULT 'in_progress',
            time_taken_seconds INTEGER
        );
        """,

        # Table 7: answers
        """
        CREATE TABLE IF NOT EXISTS quiz_app.answers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            attempt_id UUID REFERENCES quiz_app.attempts(id) ON DELETE CASCADE,
            question_id UUID REFERENCES quiz_app.questions(id) ON DELETE CASCADE,
            selected_option_id UUID REFERENCES quiz_app.options(id) ON DELETE CASCADE,
            is_correct BOOLEAN NOT NULL,
            time_taken_seconds INTEGER
        );
        """,

        # Indexes for performance
        "CREATE INDEX IF NOT EXISTS idx_users_email ON quiz_app.users(email);",
        "CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quiz_app.quizzes(created_by);",
        "CREATE INDEX IF NOT EXISTS idx_attempts_quiz_user ON quiz_app.attempts(quiz_id, user_id);",
        "CREATE INDEX IF NOT EXISTS idx_answers_attempt ON quiz_app.answers(attempt_id);"
    ]

    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        for command in commands:
            cur.execute(command)
        conn.commit()
        cur.close()
        conn.close()
        print("Successfully set up database schema and tables in Supabase.")
    except Exception as e:
        print(f"Error connecting to or setting up the database: {e}")

if __name__ == "__main__":
    setup_database()
