from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from account.serializers import *
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated 
from rest_framework.decorators import permission_classes
import pyotp
from account.models import OTP
from rest_framework.decorators import api_view
from django.contrib.auth import logout
from django.http import JsonResponse
from django.core.files.base import ContentFile
from rest_framework import generics

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
    data = request.data
    user_id = data['user_id']
    user = User.objects.get(id=user_id)
    otp = OTP.objects.get(user=user)
    otp_key = otp.otp_secret
    otp_instance = pyotp.TOTP(otp_key, digits =6)
    otp_code = otp_instance.now()
    send_otp_email(user.email, otp_code)
    return Response({'message': 'OTP has been sent to your email'}, status=status.HTTP_200_OK)


class LikedSongListView(generics.ListCreateAPIView):
    serializer_class = LikedSongSerializer

    def get_queryset(self):
        user_pk = self.kwargs.get('pk')
        queryset = LikedSong.objects.filter(user_id=user_pk)
        return queryset

    def perform_create(self, serializer):
        user_pk = self.kwargs.get('pk')
        serializer.save(user_id=user_pk)