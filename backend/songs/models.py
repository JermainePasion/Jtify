from django.db import models
from django.utils import timezone


class Song(models.Model):
    genreChoices = [
        ('Hip-Hop', 'Hip-Hop'),
        ('R&B', 'R&B'),
        ('Pop', 'Pop'),
        ('Rock', 'Rock'),
        ('Country', 'Country'),
        ('Jazz', 'Jazz'),
        ('Classical', 'Classical'),
        ('Blues', 'Blues'),
        ('Electronic', 'Electronic'),
        ('Reggae', 'Reggae'),
        ('Folk', 'Folk'),
        ('Punk', 'Punk'),
        ('Metal', 'Metal'),
        ('Soul', 'Soul'),
        ('Funk', 'Funk'),
        ('Disco', 'Disco'),
        ('Gospel', 'Gospel'),
        ('House', 'House'),
        ('Techno', 'Techno'),
        ('Dubstep', 'Dubstep'),
        ('Trap', 'Trap'),
        ('Drum & Bass', 'Drum & Bass'),
        ('Grime', 'Grime'),
        ('Garage', 'Garage'),
        ('Salsa', 'Salsa'),
        ('Afrobeat', 'Afrobeat'),
        ('Highlife', 'Highlife'),
    ]
    user = models.ForeignKey('account.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)  # Make it non-editable
    picture = models.ImageField(upload_to='song_pictures/')
    file = models.FileField(upload_to='song_files/')
    genre = models.CharField(max_length=255, choices=genreChoices)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name
