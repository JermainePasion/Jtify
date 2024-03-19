
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
  path('logout/', logout_view, name='logout'),
  path('contact-us/', ContactView.as_view(), name='contact'),
  path('artist-register/', ArtistRegisterView.as_view(), name='artist-register-list-create'),
  path('user-profile/<int:user_id>/', UserProfileDetailView.as_view(), name='user-profile-detail'),
  path('verify-artist/<str:verification_token>/', verify_artist, name='verify_artist'),
]
