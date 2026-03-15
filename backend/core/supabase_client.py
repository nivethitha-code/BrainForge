import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

class SupabaseClient:
    def __init__(self):
        self.db_url = os.getenv("DATABASE_URL")
        if not self.db_url:
            print("Warning: DATABASE_URL not found in environment variables")

    def get_connection(self):
        try:
            return psycopg2.connect(self.db_url)
        except Exception as e:
            print(f"Error connecting to Supabase: {e}")
            return None

    def execute_query(self, query, params=None, fetch=False):
        conn = self.get_connection()
        if not conn:
            return None
        
        try:
            cur = conn.cursor()
            cur.execute(query, params)
            
            result = None
            if fetch:
                result = cur.fetchall()
            
            conn.commit()
            cur.close()
            conn.close()
            return result
        except Exception as e:
            print(f"Database error: {e}")
            if conn:
                conn.close()
            return None
