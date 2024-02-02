from django.db import models

class Song(models.Model):
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    picture = models.ImageField(upload_to='song_pictures/')
    file = models.FileField(upload_to='song_files/')

    def __str__(self):
        return self.name