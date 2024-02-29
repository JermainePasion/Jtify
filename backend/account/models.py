from typing import Any
from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
import pyotp
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework_simplejwt.tokens import RefreshToken
from colorfield.fields import ColorField


# User Liked Songs



#  Custom User Manager
class UserManager(BaseUserManager):
  def create_user(self, email, name, password=None):
    """
    Creates and saves a User with the given email, name, and password.
    """
    if not email:
        raise ValueError('User must have an email address')

    user = self.model(
        email=self.normalize_email(email),
        name=name,
    )

    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_superuser(self, email, name, password=None):
      """
      Creates and saves a superuser with the given email, name, tc and password.
      """
      user = self.create_user(
          email,
          password=password,
          name=name,
          
      )
      user.is_admin = True
      user.is_active = True
      user.is_artist = True
      user.save(using=self._db)
      return user

#  Custom User Model
class User(AbstractBaseUser):
  email = models.EmailField(
      verbose_name='Email',
      max_length=255,
      unique=True,
  )
  name = models.CharField(max_length=200)
  is_active = models.BooleanField(default=False)
  is_admin = models.BooleanField(default=False)
  is_artist = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
#   is_email_verified = models.BooleanField(default=False)

  objects = UserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['name']

  def __str__(self):
      return self.email

  def has_perm(self, perm, obj=None):
      "Does the user have a specific permission?"
      # Simplest possible answer: Yes, always
      return self.is_admin

  def has_module_perms(self, app_label):
      "Does the user have permissions to view the app `app_label`?"
      # Simplest possible answer: Yes, always
      return True

  @property
  def is_staff(self):
      "Is the user a member of staff?"
      # Simplest possible answer: All admins are staff
      return self.is_admin

# class EmailConfirmationToken(models.Model):
#   user = models.ForeignKey(User, on_delete=models.CASCADE)
#   token = models.CharField(max_length=255)
#   created_at = models.DateTimeField(auto_now_add=True)
#   updated_at = models.DateTimeField(auto_now=True)

class OTP(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  otp_secret = models.CharField(max_length=255)
  is_verified = models.BooleanField(default=False)

  def __str__(self):
      return self.user.name
  
  def generate_otp(self):
     totp = pyotp.TOTP(self.otp_secret)
     return totp.now()
  
  def verify(self, entered_otp):
     totp = pyotp.TOTP(self.otp_secret)
     return totp.verify(entered_otp)

class Profile(models.Model):
    FontChoices = [
        ('Default', 'Default'),
        ('Open Sans', 'Open Sans'),
        ('Young Serif', 'Young Serif'),
        ('Roboto Slab', 'Roboto Slab'),
        ('Roboto Mono', 'Roboto Mono'),
        ('Noto Sans JP', 'Noto Sans JP'),
        ('Yuji Hentaigana Akari', 'Yuji Hentaigana Akari'),
        ('Agbalumo', 'Agbalumo'),
        ('Alegreya Sans', 'Alegreya Sans'),
        ('Montserrat', 'Montserrat'),
        ('Edu TAS Begginer', 'Edu TAS Begginer'),
        ('Playpen Sans', 'Playpen Sans'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics')
    color = ColorField(default='#FF0000')
    font = models.CharField(max_length=255, choices=FontChoices, default='Default')
  
    def __str__(self):
      return f'{self.user.name} Profile'
  
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    
@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

# class Color(models.Model):
#   user = models.ForeignKey(User, on_delete=models.CASCADE)
#   color = ColorField(default='#FF0000')

class Contact(models.Model):
#   user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
  name = models.CharField(max_length=255)
  email = models.EmailField(max_length=255)
  message = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
      return self.name
  
class ArtistRegister(models.Model):
  name = models.CharField(max_length=255)
  artist_name = models.CharField(max_length=255)
  email = models.EmailField(max_length=255)
  phone_number = models.IntegerField()
  youtube_link = models.URLField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
      return self.name  