import random
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import EmailOTP
from .serializers import (
    RegisterSerializer, UserSerializer, VerifyEmailSerializer, 
    ForgotPasswordSerializer, ResetPasswordSerializer
)
from core.email_service import EmailService

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_verified:
            raise serializers.ValidationError({"detail": "Email not verified. Please verify your email first."})
        data['user'] = UserSerializer(self.user).data
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate and send OTP
            otp_code = str(random.randint(100000, 999999))
            EmailOTP.objects.create(
                user=user,
                otp_code=otp_code,
                purpose='verify_email',
                expires_at=timezone.now() + timedelta(minutes=10)
            )
            email_service = EmailService()
            email_service.send_otp_email(user.email, otp_code)
            
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            
            otp = EmailOTP.objects.filter(
                user__email=email,
                otp_code=otp_code,
                purpose='verify_email',
                is_used=False,
                expires_at__gt=timezone.now()
            ).first()
            
            if otp:
                user = otp.user
                user.is_verified = True
                user.save()
                otp.is_used = True
                otp.save()
                
                email_service = EmailService()
                email_service.send_welcome_email(user.email, user.username)
                return Response({"detail": "Email successfully verified."}, status=status.HTTP_200_OK)
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AcceptTermsView(APIView):
    def post(self, request):
        user = request.user
        user.terms_accepted = True
        user.save()
        return Response({"detail": "Terms accepted."}, status=status.HTTP_200_OK)

class ProfileView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
