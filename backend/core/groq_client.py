import os
import requests
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class GroqClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        self.client = Groq(api_key=self.api_key)
        self.model = "llama-3.3-70b-versatile"

    def generate_quiz(self, topic, question_count, difficulty, options_per_question):
        prompt = f"""
        Generate {question_count} MCQ questions about "{topic}" at {difficulty} difficulty.
        Each question must have exactly {options_per_question} options. No more, no less.
        Return ONLY valid JSON — no markdown, no explanation text:
        {{
            "title": "A descriptive title for the quiz",
            "questions": [
                {{
                    "question": "The question text",
                    "options": ["opt1", "opt2", "opt3", ...],
                    "correct_index": 0,
                    "explanation": "Brief explanation of why the answer is correct"
                }}
            ]
        }}
        correct_index is 0-based position in the options array.
        """
        
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                response_format={"type": "json_object"}
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Error generating quiz with GROQ: {e}")
            return None
