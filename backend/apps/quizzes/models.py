import uuid
from django.db import models
from django.conf import settings

class Quiz(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=200)
    topic = models.CharField(max_length=200)
    question_count = models.SmallIntegerField()
    options_per_question = models.SmallIntegerField()
    difficulty = models.CharField(max_length=10) # easy, medium, hard
    time_limit_seconds = models.IntegerField()
    status = models.CharField(max_length=20, default='ready') # ready, generating, failed
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'quizzes'

class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    order_index = models.SmallIntegerField()
    question_text = models.TextField()
    explanation = models.TextField()
    correct_option_id = models.UUIDField(null=True, blank=True) # Will point to Option.id

    class Meta:
        db_table = 'questions'

class Option(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_text = models.TextField()
    order_index = models.SmallIntegerField()

    class Meta:
        db_table = 'options'

class Attempt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attempts')
    started_at = models.DateTimeField()
    submitted_at = models.DateTimeField(null=True, blank=True)
    score = models.SmallIntegerField(null=True, blank=True)
    total_questions = models.SmallIntegerField()
    status = models.CharField(max_length=20, default='in_progress') # in_progress, completed, timed_out
    time_taken_seconds = models.IntegerField(null=True, blank=True)
    
    # Challenge Bonus
    bonus_points = models.SmallIntegerField(default=0)
    is_weekly_milestone = models.BooleanField(default=False)

    class Meta:
        db_table = 'attempts'

class Answer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attempt = models.ForeignKey(Attempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    selected_option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    is_correct = models.BooleanField()
    time_taken_seconds = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'answers'
