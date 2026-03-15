from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model
from core.email_service import EmailService

User = get_user_model()

class Command(BaseCommand):
    help = 'Sends quiz reminders to users who have been inactive for more than 24 hours'

    def handle(self, *args, **options):
        self.stdout.write('Checking for inactive users...')
        
        email_service = EmailService()
        one_day_ago = timezone.now() - timezone.timedelta(days=1)
        
        # Criteria: 
        # 1. User has quiz_reminders enabled
        # 2. User hasn't finished a quiz in 24h (last_quiz_at is old or None)
        # 3. User is verified
        inactive_users = User.objects.filter(
            quiz_reminders=True,
            is_verified=True
        ).filter(
            models.Q(last_quiz_at__lt=one_day_ago) | models.Q(last_quiz_at__isnull=True)
        )

        sent_count = 0
        for user in inactive_users:
            self.stdout.write(f'Sending reminder to {user.email}...')
            success = email_service.send_quiz_reminder(user.email, user.username)
            if success:
                sent_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully sent {sent_count} reminders!'))
