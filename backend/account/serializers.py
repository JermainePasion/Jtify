from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User
from django.utils.encoding import force_str, force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.exceptions import ValidationError
from django.utils.encoding import smart_str
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import DjangoUnicodeDecodeError
from . import utils
from .models import Profile
from .models import Contact, ArtistRegister

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'password2']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError({'password': 'Password fields didn\'t match'})
        return attrs
    
    

    def create(self, validated_data):
        # Remove password2 from the validated data before creating the user
        validated_data.pop('password2', None)
        
        # Call your UserManager's create_user method to create the user
        user = User.objects.create_user(**validated_data)
        
        return user

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name','id']

class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style = {'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style = {'input_type': 'password'}, write_only=True)
    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError({'password': 'Password fields didn\'t match'})
        user.set_password(password)
        user.save()
        return attrs
    
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        try:
            user = User.objects.get(email=email)
            uid_bytes = force_bytes(user.pk)
            uid = urlsafe_base64_encode(uid_bytes)
            token = PasswordResetTokenGenerator().make_token(user)
            link = f'http://localhost:3000/reset/{uid}/{token}'
            
            # Add the following line to actually send the email
            utils.Util.send_email({'to_email': email, 'email_subject': 'Password Reset', 'email_body': link})

            # Return attrs
            return attrs
        except User.DoesNotExist:
            raise ValidationError({'email': 'Email is not registered'})

        
class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')

            id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValidationError({'token': 'Token is not valid or expired'})

            if password != password2:
                raise serializers.ValidationError({'password': 'Password fields didn\'t match'})

            user.set_password(password)
            user.save()
            return attrs

        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user, token)
            raise ValidationError({'token': 'Token is not valid or expired'})
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

# class ColorSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Color
#         fields = ['color']
    
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class ArtistRegisterSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = ArtistRegister
        fields = '__all__'

