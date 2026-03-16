import random
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework import status, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailOTP
from .serializers import (
    RegisterSerializer, UserSerializer, VerifyEmailSerializer, 
    ForgotPasswordSerializer, ResetPasswordSerializer, SupabaseSyncSerializer
)


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

class SupabaseSyncView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = SupabaseSyncSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            username = serializer.validated_data.get('username')

            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': username or email.split('@')[0],
                    'is_verified': True,
                }
            )

            if not created and not user.is_verified:
                user.is_verified = True
                user.save()

            # Generate Django tokens for the synced user
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "detail": "Successfully synced with Supabase"
            }, status=status.HTTP_200_OK)
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

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"detail": "Account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
