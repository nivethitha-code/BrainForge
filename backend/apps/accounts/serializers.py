from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import EmailOTP

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'is_verified', 'terms_accepted', 
            'created_at', 'password', 'quiz_reminders', 
            'leaderboard_updates', 'new_features'
        )
        read_only_fields = ('id', 'is_verified', 'terms_accepted', 'created_at')

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
            instance.save()
        return super().update(instance, validated_data)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

class SupabaseSyncSerializer(serializers.Serializer):
    supabase_id = serializers.CharField()
    email = serializers.EmailField()
    username = serializers.CharField(required=False, allow_blank=True)
