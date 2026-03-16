from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    MyTokenObtainPairView, AcceptTermsView, ProfileView, SupabaseSyncView
)

urlpatterns = [
    path('sync/', SupabaseSyncView.as_view(), name='supabase-sync'),
    # Legacy paths (can be removed later)
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accept-terms/', AcceptTermsView.as_view(), name='accept-terms'),
    path('me/', ProfileView.as_view(), name='me'),
]
