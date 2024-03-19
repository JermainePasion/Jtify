from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from account.serializers import *
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.decorators import permission_classes
import pyotp
from account.models import OTP
from rest_framework.decorators import api_view
from django.contrib.auth import logout
from django.http import JsonResponse
from django.core.files.base import ContentFile
from rest_framework import generics
from account.models import Contact
from account.serializers import ContactSerializer
from django.core.mail import send_mail
from django.conf import settings
from .serializers import UserProfileSerializer
from songs .serializers import SongSerializer, PlaylistSerializer
from songs .models import Song, Playlist
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.contrib.auth.tokens import PasswordResetTokenGenerator




def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

# Create your views here.
class UserRegistrationView(APIView):
    renderer_classes = (UserRenderer,)
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            profile = user.profile
            otp_key = pyotp.random_base32()
            otp_instance = pyotp.TOTP(otp_key, digits =6)
            otp_code = otp_instance.now()
            token= get_tokens_for_user(user)

            otp = OTP.objects.create(user=user, otp_secret=otp_key)
            
            send_otp_email(user.email, otp_code)

            return Response({
                'user_id':user.id, 
                'otp_id':otp.id, 
                'token':token, 
                'profile': {'image': profile.image.url}, 
                'message': 'User created successfully'}, 
                status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response({'msg': 'Registration failed'}, status=status.HTTP_400_BAD_REQUEST)
    
def send_otp_email(email, otp_code):
    data = {
        'email_subject': 'OTP Verification',
        'email_body': f'Hi, your otp is {otp_code}',
        'to_email': email,
    }
    utils.Util.send_email(data)

@api_view(['POST'])
def verify_otp(request):
    data = request.data
    print(data)
    try:
        user_id = data['user_id']
        otp_id = data['otp_id']
        otp_code = data['otp_code']

        user = User.objects.get(id=user_id)
        otp = OTP.objects.get(id=otp_id, user=user)
        print(otp_code)
        print(otp.otp_secret)

        if user.is_active:
            return Response({'message': 'User is already verified'}, status=status.HTTP_400_BAD_REQUEST)

        if otp.is_verified:
            return Response({'message': 'OTP is already verified'}, status=status.HTTP_400_BAD_REQUEST)
        
        totp = pyotp.TOTP(otp.otp_secret)

        if totp.verify(otp_code, valid_window=7):
            user.is_active = True
            user.save()

            otp.is_verified = True
            otp.save()

            return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
        else:
            raise Exception('OTP verification failed')
        
    except Exception as e:
        message = {'message': str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    


class UserLoginView(APIView):
    renderer_classes = (UserRenderer,)
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            user = authenticate(email=email, password=password)
            if user is not None:
                token= get_tokens_for_user(user)
                return Response({'token':token, 'message': 'Login successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors':['Email or password is not valid']}}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    renderer_classes = (UserRenderer,)  # Assuming UserRenderer is defined
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        try:
            user = request.user
            profile = user.profile  # Access the profile associated with the user
            serializer = ProfileSerializer(profile)
            user_data = UserProfileSerializer(user).data
            profile_data = serializer.data  # Serialize the profile instance
            return Response({'user_data': user_data, 'profile_data': profile_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    try:
        user = request.user
        profile = request.user.profile
        data = request.data

        if 'profile_picture' in request.FILES:
            user.profile.image = request.FILES['profile_picture']

        user.name = data.get('name')
        user.email = data.get('email')
        user.save()
        profile.color = data.get('color')
        profile.font = data.get('font')
        profile.save()

        serializer = UserProfileSerializer(user)
        return Response({'message': 'Profile updated successfully', 'user': serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        print("Internal Server Error:", e)
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# class UserEmailVerificationView(APIView):
#     permission_classes = (IsAuthenticated,)
#     def post(self, request, format=None):
#        user = request.user
#        token = EmailConfirmationToken.objects.create(user=user)
#        send_confirmation_email(user.email, token.token, user.id)
#        return Response({'message': 'Email verification link has been sent to your email'}, status=status.HTTP_200_OK)


class UserChangePasswordView(APIView):
    renderer_classes = (UserRenderer,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SendPasswordResetEmailView(APIView):
    renderer_classes = (UserRenderer,)
    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'message': 'Password reset email has been sent.'}, status=status.HTTP_200_OK)
        
class UserPasswordResetView(APIView):
    renderer_classes = (UserRenderer,)
    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def resend_otp(request):
    try:
        data = request.data
        user_id = data['user_id']
        user = User.objects.get(id=user_id)
        
        if user.is_active:
            return Response({'message': 'Account is already active. Cannot resend OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        
        otp = OTP.objects.get(user=user)
        otp_key = otp.otp_secret
        otp_instance = pyotp.TOTP(otp_key, digits=6)
        otp_code = otp_instance.now()
        send_otp_email(user.email, otp_code)
        return Response({'message': 'OTP has been sent to your email'}, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)




@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

class ContactView(APIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()

        # Send email to user
        user_email_subject = 'Contact Confirmation'
        user_email_body = f'Thank you for contacting us. We will get back to you soon. \n\nMessage: {serializer.instance.message}'

        # Check if user is active
        if self.request.user.is_active:
            user_email = self.request.user.email
        else:
            # If user is anonymous, use the email provided in the form
            user_email = serializer.instance.email

        send_mail(user_email_subject, user_email_body, settings.EMAIL_HOST_USER, [user_email], fail_silently=False)

        # Send email to yourself
        admin_email_subject = 'New Contact Form Submission'
        admin_email_body = f'You have received a new contact form submission from {user_email}.\n\nMessage: {serializer.instance.message}'
        send_mail(admin_email_subject, admin_email_body, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], fail_silently=False)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ArtistRegisterView(APIView):
    serializer_class = ArtistRegisterSerializer
    permission_classes = [IsAuthenticated]  # Require authentication for this view

    def post(self, request, format=None):
        data = request.data.copy()
        data['user'] = request.user.id
        
        # Generate verification token
        verification_token = get_random_string(length=32)  # Generate a random string
        print(f"Generated verification token: {verification_token}")
        data['verification_token'] = verification_token  # Add the token to the data
        
        serializer = self.serializer_class(data=data)
        
        if serializer.is_valid():
            user = request.user
            artist_register = serializer.save(user=user)
            
            # Send email notification to the user and admin
            send_mail_notification(request.user, artist_register, verification_token)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def send_mail_notification(user, artist_register, verification_token):
    print(f"Verification token in email: {verification_token}")
    subject_user = 'New Artist Registration'
    message_user = f'''
    Dear {user.name},

    Thank you for your artist registration. We have received your submission and will review it shortly.

    Regards,
    Jtify
    '''

    from_email = settings.EMAIL_HOST_USER
    recipient_list_user = [user.email]  # Send email to the registered user
    send_mail(subject_user, message_user, from_email, recipient_list_user)

    # Send email to admin
    subject_admin = 'New Artist Registration'
    message_admin = f'''
    New artist registration details:
    Name: {user.name}
    Email: {user.email}
    Phone Number: {artist_register.phone_number}
    YouTube Link: {artist_register.youtube_link}
    Created At: {artist_register.created_at}
    
    Click the following link to verify artist: http://localhost:3000/verify-artist/{verification_token}/
    '''
   
    recipient_list_admin = [settings.EMAIL_HOST_USER]  # Send email to the admin
    send_mail(subject_admin, message_admin, from_email, recipient_list_admin)

@api_view(['GET'])
def verify_artist(request, verification_token):
    print(f"Verification token: {verification_token}")
    try:
        artist_register = ArtistRegister.objects.get(verification_token=verification_token)
        print(f"Artist registration found: {artist_register}" )
        
        if artist_register.user.is_artist:
            return Response({'message': 'Artist is already verified'}, status=status.HTTP_400_BAD_REQUEST)

        if artist_register.verification_token == verification_token:
            user = artist_register.user
            user.is_artist = True
            user.save()

            subject_user = 'Artist Registration Successful'
            message_user = f'''
            Dear {user.name},
            Artist registration successful. You can now upload your songs and create playlists.
            
            Regards,
            jtify
            '''
            from_email = settings.EMAIL_HOST_USER
            recipient_list_user = [user.email]  # Send email to the registered user
            send_mail(subject_user, message_user, from_email, recipient_list_user)

            return Response({'message': 'Token verified successfully'}, status=status.HTTP_200_OK)
        else:
            print(f"Token not verified: {verification_token}")
            return Response({'message': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except ArtistRegister.DoesNotExist:
        return Response({'message': 'Artist registration not found'}, status=status.HTTP_404_NOT_FOUND)



class UserProfileDetailView(APIView):
    def get(self, request, user_id):
        try:
            # Retrieve user profile, uploaded songs, and created playlists
            user_profile = User.objects.get(id=user_id)
            uploaded_songs = Song.objects.filter(user_id=user_id)
            created_playlists = Playlist.objects.filter(user_id=user_id)

            # Serialize the data
            profile_serializer = UserProfileSerializer(user_profile)
            song_serializer = SongSerializer(uploaded_songs, many=True)
            playlist_serializer = PlaylistSerializer(created_playlists, many=True)

            # Return JSON response
            return Response({
                'profile': profile_serializer.data,
                'uploaded_songs': song_serializer.data,
                'created_playlists': playlist_serializer.data
            })
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
