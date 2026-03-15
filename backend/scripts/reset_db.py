import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

def reset_database():
    if not DB_URL:
        print("Error: DATABASE_URL not found in environment variables.")
        return

    # Order matters due to Foreign Key constraints
    commands = [
        "TRUNCATE TABLE quiz_app.answers CASCADE;",
        "TRUNCATE TABLE quiz_app.attempts CASCADE;",
        "TRUNCATE TABLE quiz_app.options CASCADE;",
        "TRUNCATE TABLE quiz_app.questions CASCADE;",
        "TRUNCATE TABLE quiz_app.quizzes CASCADE;",
        "TRUNCATE TABLE quiz_app.email_otp CASCADE;",
        "TRUNCATE TABLE quiz_app.users CASCADE;",
        
        # Django internal tables (to clear users and sessions)
        "TRUNCATE TABLE accounts_user CASCADE;",
        "TRUNCATE TABLE accounts_emailotp CASCADE;",
        "TRUNCATE TABLE quizzes_answer CASCADE;",
        "TRUNCATE TABLE quizzes_attempt CASCADE;",
        "TRUNCATE TABLE quizzes_option CASCADE;",
        "TRUNCATE TABLE quizzes_question CASCADE;",
        "TRUNCATE TABLE quizzes_quiz CASCADE;",
        "TRUNCATE TABLE django_session CASCADE;"
    ]

    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        print("Starting database reset...")
        for command in commands:
            try:
                cur.execute(command)
                print(f"Executed: {command.strip()}")
            except psycopg2.errors.UndefinedTable:
                # If a table doesn't exist yet, just skip it
                conn.rollback()
                print(f"Skipping: Table does not exist.")
                continue
            except Exception as e:
                conn.rollback()
                print(f"Warning: Could not clear table. Error: {e}")
                continue
        
        conn.commit()
        cur.close()
        conn.close()
        print("\nSuccessfully cleared all tables in Supabase. You can now start with a fresh registration!")
    except Exception as e:
        print(f"Error connecting to the database: {e}")

if __name__ == "__main__":
    reset_database()
