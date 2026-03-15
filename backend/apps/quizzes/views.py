import json
from django.utils import timezone
from django.db import transaction
from django.db.models import Count, Avg, Max, Sum, Q
from django.contrib.auth import get_user_model
from rest_framework import status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

from .models import Quiz, Question, Option, Attempt, Answer
from .serializers import QuizSerializer, AttemptSerializer
from core.groq_client import GroqClient

User = get_user_model()

class QuizViewSet(viewsets.ModelViewSet):
    serializer_class = QuizSerializer
    
    def get_queryset(self):
        return Quiz.objects.filter(created_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, status='generating')

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        quizzes_created = Quiz.objects.filter(created_by=user).count()
        attempts = Attempt.objects.filter(user=user, status='completed')
        total_attempts = attempts.count()
        
        from django.db.models.functions import Coalesce
        from django.db.models import F
        
        # Calculate total scores (base + bonus) for consistent stats
        scores = attempts.annotate(
            total_attempt_score=F('score') + Coalesce(F('bonus_points'), 0)
        )
        
        avg_score = scores.aggregate(Avg('total_attempt_score'))['total_attempt_score__avg'] or 0
        best_score = scores.aggregate(Max('total_attempt_score'))['total_attempt_score__max'] or 0
        
        return Response({
            "quizzes_created": quizzes_created,
            "total_attempts": total_attempts,
            "average_score": round(avg_score, 1),
            "best_score": best_score
        })

    @action(detail=False, methods=['post'], url_path='generate')
    def generate(self, request):
        topic = request.data.get('topic')
        count = int(request.data.get('question_count', 5))
        difficulty = request.data.get('difficulty', 'medium')
        options_count = int(request.data.get('options_per_question', 4))
        
        # Create Quiz entry first
        quiz = Quiz.objects.create(
            created_by=request.user,
            topic=topic,
            question_count=count,
            difficulty=difficulty,
            options_per_question=options_count,
            title=f"Quiz about {topic}",
            time_limit_seconds=count * 60, # Default 1 min per question
            status='generating'
        )
        
        try:
            with transaction.atomic():
                # Generate with AI
                groq_client = GroqClient()
                ai_response = groq_client.generate_quiz(topic, count, difficulty, options_count)

                if not ai_response:
                    raise Exception("AI generation failed")
                
                data = json.loads(ai_response)
                quiz.title = data.get('title', quiz.title)
                
                for i, q_data in enumerate(data.get('questions', [])):
                    question = Question.objects.create(
                        quiz=quiz,
                        order_index=i + 1,
                        question_text=q_data['question'],
                        explanation=q_data.get('explanation', '')
                    )
                    
                    # Create options
                    options = []
                    for j, opt_text in enumerate(q_data['options']):
                        option = Option.objects.create(
                            question=question,
                            option_text=opt_text,
                            order_index=j
                        )
                        options.append(option)
                    
                    # Set correct option
                    correct_idx = q_data.get('correct_index', 0)
                    if correct_idx < len(options):
                        question.correct_option_id = options[correct_idx].id
                        question.save()
                
                quiz.status = 'ready'
                quiz.save()
            return Response(QuizSerializer(quiz).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            quiz.status = 'failed'
            quiz.save()
            return Response({"detail": str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class AttemptViewSet(viewsets.ModelViewSet):
    serializer_class = AttemptSerializer

    def get_queryset(self):
        return Attempt.objects.filter(user=self.request.user).order_by('-started_at')

    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        # Global leaderboard ranking users by their total score across all completed attempts
        from django.db.models.functions import Coalesce
        
        users = User.objects.annotate(
            total_score=Coalesce(Sum('attempts__score', filter=Q(attempts__status='completed')), 0) + 
                        Coalesce(Sum('attempts__bonus_points', filter=Q(attempts__status='completed')), 0)
        ).filter(total_score__gt=0).order_by('-total_score')[:10]

        data = []
        for i, user in enumerate(users):
            data.append({
                "rank": i + 1,
                "username": user.username,
                "score": user.total_score,
                "avatar": user.username[0].upper() if user.username else "U"
            })
        
        # Get current user's rank and accuracy
        user_rank = "100+"
        user_score = 0
        user_accuracy = 0
        
        all_rankings = User.objects.annotate(
            total_score=Coalesce(Sum('attempts__score', filter=Q(attempts__status='completed')), 0) + 
                        Coalesce(Sum('attempts__bonus_points', filter=Q(attempts__status='completed')), 0)
        ).order_by('-total_score')
        
        for i, u in enumerate(all_rankings):
            if u.id == request.user.id:
                user_rank = i + 1
                user_score = u.total_score or 0
                break
        
        # Calculate accuracy and weekly challenge separately
        user_attempts = Attempt.objects.filter(user=request.user, status='completed')
        
        # Weekly Challenge: Last 7 days
        week_ago = timezone.now() - timezone.timedelta(days=7)
        weekly_count = user_attempts.filter(submitted_at__gte=week_ago).count()

        if user_attempts.exists():
            total_possible = user_attempts.aggregate(Sum('total_questions'))['total_questions__sum'] or 1
            total_scored = user_attempts.aggregate(Sum('score'))['score__sum'] or 0
            user_accuracy = round((total_scored / total_possible) * 100, 1)

        return Response({
            "leaderboard": data,
            "user_stats": {
                "rank": user_rank,
                "score": user_score,
                "accuracy": user_accuracy,
                "weekly_count": weekly_count,
                "username": request.user.username
            }
        })

    @action(detail=False, methods=['post'], url_path='start/(?P<quiz_id>[^/.]+)')
    def start_attempt(self, request, quiz_id=None):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
            attempt = Attempt.objects.create(
                quiz=quiz,
                user=request.user,
                started_at=timezone.now(),
                total_questions=quiz.question_count,
                status='in_progress'
            )
            return Response(AttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk=None):
        from django.db.models.functions import Coalesce
        from core.email_service import EmailService
        
        attempt = self.get_object()
        if attempt.status != 'in_progress':
            return Response({"detail": "Attempt already submitted"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Capture current Top 10 Leaderboard before score update
        def get_top_10():
            return list(User.objects.annotate(
                total_score=Coalesce(Sum('attempts__score', filter=Q(attempts__status='completed')), 0) + 
                            Coalesce(Sum('attempts__bonus_points', filter=Q(attempts__status='completed')), 0)
            ).filter(total_score__gt=0).order_by('-total_score')[:10].values_list('id', flat=True))

        top_10_before = get_top_10()
        
        answers_data = request.data.get('answers', [])
        score = 0
        
        with transaction.atomic():
            for ans in answers_data:
                question_id = ans.get('question_id')
                selected_option_id = ans.get('selected_option_id')
                try:
                    question = Question.objects.get(id=question_id, quiz=attempt.quiz)
                    # Use exact matching for UUIDs/Strings
                    is_correct = str(selected_option_id) == str(question.correct_option_id)
                    if is_correct: 
                        score += 1
                    
                    Answer.objects.create(
                        attempt=attempt, 
                        question=question, 
                        selected_option_id=selected_option_id, 
                        is_correct=is_correct, 
                        time_taken_seconds=ans.get('time_taken_seconds')
                    )
                except Question.DoesNotExist: 
                    continue
            
            attempt.submitted_at = timezone.now()
            attempt.score = score
            attempt.status = 'completed'
            attempt.time_taken_seconds = (attempt.submitted_at - attempt.started_at).total_seconds()
            
            # Weekly Challenge Logic
            week_ago = timezone.now() - timezone.timedelta(days=7)
            weekly_count = Attempt.objects.filter(user=request.user, status='completed', submitted_at__gte=week_ago).count()
            
            # Milestone: 5th quiz completion in a week
            if weekly_count == 4: # Will be 5 after this save
                attempt.is_weekly_milestone = True
                attempt.bonus_points = score # Double points for the milestone quiz
            
            attempt.save()
            
            # Track activity for reminders
            request.user.last_quiz_at = attempt.submitted_at
            request.user.save()

        # 2. Check Rank Changes After Save (Leaderboard Automation)
        top_10_after = get_top_10()
        email_service = EmailService()
        
        try:
            prev_rank = top_10_before.index(request.user.id) if request.user.id in top_10_before else 999
            curr_rank = top_10_after.index(request.user.id) if request.user.id in top_10_after else 999
            
            # If the user moved up in the top 10 rankings
            if curr_rank < prev_rank:
                # Notify users who were overtaken
                for i in range(curr_rank + 1, min(prev_rank, len(top_10_after))):
                    victim_id = top_10_after[i]
                    victim = User.objects.get(id=victim_id)
                    if victim.leaderboard_updates:
                        email_service.send_rank_update(victim.email, victim.username, request.user.username)
        except Exception as e:
            print(f"Rank alert automation error: {e}")

        return Response(AttemptSerializer(attempt).data)
