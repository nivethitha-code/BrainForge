from rest_framework import serializers
from .models import Quiz, Question, Option, Attempt, Answer

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ('id', 'option_text', 'order_index')

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ('id', 'order_index', 'question_text', 'explanation', 'options')
        # correct_option_id hidden from preview

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = (
            'id', 'title', 'topic', 'question_count', 'options_per_question', 
            'difficulty', 'time_limit_seconds', 'status', 'created_at', 'questions'
        )
        read_only_fields = ('id', 'title', 'status', 'created_at')

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('question', 'selected_option', 'is_correct', 'time_taken_seconds')

class AttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.ReadOnlyField(source='quiz.title')
    quiz_topic = serializers.ReadOnlyField(source='quiz.topic')
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Attempt
        fields = (
            'id', 'quiz', 'quiz_title', 'quiz_topic', 'user', 'started_at', 
            'submitted_at', 'score', 'total_questions', 'status', 
            'time_taken_seconds', 'answers'
        )
        read_only_fields = ('id', 'user', 'score', 'status', 'time_taken_seconds')
