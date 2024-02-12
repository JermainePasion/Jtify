from typing import Any
from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
import pyotp
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework_simplejwt.tokens import RefreshToken
from colorfield.fields import ColorField
from songs.models import Song

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
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  image = models.ImageField(default='default.jpg', upload_to='profile_pics')
#   name = models.CharField(User.name, max_length=200, null=True, blank=True)
#  email = models.EmailField(User.email, max_length=255, null=True, blank=True)
  color = ColorField(default='#FF0000')
  

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
    
class LikedSong(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    songs = models.ManyToManyField(Song, related_name='liked_by_users')

    def __str__(self):
        return f"{self.user.email}'s liked songs"

    def remove_song(self, song_id):
        try:
            song_to_remove = self.songs.get(id=song_id)
            self.songs.remove(song_to_remove)
            return True
        except Song.DoesNotExist:
            return False