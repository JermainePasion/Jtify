from django.db import models
from account.models import User

class Song(models.Model):
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    picture = models.ImageField(upload_to='song_pictures/')
    file = models.FileField(upload_to='song_files/')
    likes = models.ManyToManyField(User, related_name='liked_songs', blank=True)

    def __str__(self):
        return self.name