
from django.urls import path
from account.views import *


urlpatterns = [
  path('register/', UserRegistrationView.as_view(), name='register'),
  path('login/', UserLoginView.as_view(), name='login'),
  path('profile/', UserProfileView.as_view(), name='profile'),
  path('change-password/', UserChangePasswordView.as_view(), name='change-password'),
  path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
  path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
  # path('email-verification/', UserEmailVerificationView.as_view(), name='email-verification'),
  path('verify-otp/', verify_otp, name='verify_otp'),
  path('resend-otp/', resend_otp, name='resend_otp'),
  path('profile/update', updateUserProfile, name='update-profile'),
  path('<int:pk>/liked-songs/', LikedSongListView.as_view(), name='liked-songs'),
]
