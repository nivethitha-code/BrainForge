import os
import resend
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY")
        if not self.api_key:
            print("Warning: RESEND_API_KEY not found in environment variables")
        resend.api_key = self.api_key

    def send_otp_email(self, to_email, otp_code):
        try:
            params = {
                "from": "BrainForge <onboarding@resend.dev>",
                "to": [to_email],
                "subject": "Your BrainForge Verification Code",
                "html": f"""
                <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                    <h1 style="color: #3B82F6;">Welcome to BrainForge!</h1>
                    <p>Your verification code is:</p>
                    <h2 style="font-size: 32px; letter-spacing: 5px; color: #1E40AF;">{otp_code}</h2>
                    <p>This code will expire in 10 minutes.</p>
                </div>
                """
            }
            email = resend.Emails.send(params)
            return email
        except Exception as e:
            print(f"Error sending email with Resend: {e}")
            return None

    def send_welcome_email(self, to_email, username):
        try:
            params = {
                "from": "BrainForge <onboarding@resend.dev>",
                "to": [to_email],
                "subject": "Welcome to BrainForge AI!",
                "html": f"""
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1 style="color: #3B82F6;">Hello {username}!</h1>
                    <p>Your account has been successfully verified. You're all set to start creating and taking AI-powered quizzes.</p>
                    <a href="{os.getenv('FRONTEND_URL')}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
                </div>
                """
            }
            email = resend.Emails.send(params)
            return email
        except Exception as e:
            print(f"Error sending welcome email: {e}")
            return None
    def send_feature_alert(self, to_email, username, feature_name):
        try:
            params = {
                "from": "BrainForge <onboarding@resend.dev>",
                "to": [to_email],
                "subject": f"New Feature: {feature_name} is here!",
                "html": f"""
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #E5E7EB; rounded: 12px; max-width: 600px; margin: auto;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #8B5CF6; margin-bottom: 8px;">Exciting News, {username}!</h1>
                        <p style="color: #6B7280; font-size: 16px;">We just launched something new to help you learn better.</p>
                    </div>
                    <div style="background-color: #F5F3FF; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                        <h2 style="color: #7C3AED; margin-top: 0;">🚀 {feature_name}</h2>
                        <p style="color: #4B5563; line-height: 1.6;">Our latest AI improvement is now live and waiting for you to try it out on BrainForge.</p>
                    </div>
                    <div style="text-align: center;">
                        <a href="{os.getenv('FRONTEND_URL')}/dashboard" style="display: inline-block; padding: 12px 32px; background-color: #8B5CF6; color: white; text-decoration: none; border-radius: 9999px; font-weight: bold; shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.5);">Try it Now</a>
                    </div>
                </div>
                """
            }
            email = resend.Emails.send(params)
            return email
        except Exception as e:
            print(f"Error sending feature alert: {e}")
            return None

    def send_quiz_reminder(self, to_email, username):
        try:
            params = {
                "from": "BrainForge <onboarding@resend.dev>",
                "to": [to_email],
                "subject": "Missing your brilliance! 🧠✨",
                "html": f"""
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #E5E7EB; border-radius: 12px; max-width: 600px; margin: auto;">
                    <h1 style="color: #8B5CF6;">It's time for a Brain Workout, {username}!</h1>
                    <p style="color: #4B5563;">You haven't taken a quiz in a while. Keep your streak alive and sharpen your skills!</p>
                    <div style="text-align: center; margin-top: 24px;">
                        <a href="{os.getenv('FRONTEND_URL')}/quizzes" style="display: inline-block; padding: 12px 32px; background-color: #8B5CF6; color: white; text-decoration: none; border-radius: 9999px; font-weight: bold;">Browse Quizzes</a>
                    </div>
                </div>
                """
            }
            email = resend.Emails.send(params)
            return email
        except Exception as e:
            print(f"Error sending reminder: {e}")
            return None

    def send_rank_update(self, to_email, username, challenger_name):
        try:
            params = {
                "from": "BrainForge <onboarding@resend.dev>",
                "to": [to_email],
                "subject": "Someone is catching up! 🏃💨",
                "html": f"""
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #E5E7EB; border-radius: 12px; max-width: 600px; margin: auto;">
                    <h1 style="color: #8B5CF6;">Heads up, {username}!</h1>
                    <p style="color: #4B5563;"><b>{challenger_name}</b> just finished a high-score quiz and is climbing the leaderboard. Don't let them take your spot!</p>
                    <div style="text-align: center; margin-top: 24px;">
                        <a href="{os.getenv('FRONTEND_URL')}/leaderboard" style="display: inline-block; padding: 12px 32px; background-color: #7C3AED; color: white; text-decoration: none; border-radius: 9999px; font-weight: bold;">See Leaderboard</a>
                    </div>
                </div>
                """
            }
            email = resend.Emails.send(params)
            return email
        except Exception as e:
            print(f"Error sending rank update: {e}")
            return None
