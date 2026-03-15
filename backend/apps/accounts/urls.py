from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, VerifyEmailView, MyTokenObtainPairView, 
    AcceptTermsView, ProfileView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accept-terms/', AcceptTermsView.as_view(), name='accept-terms'),
    path('me/', ProfileView.as_view(), name='me'),
]
