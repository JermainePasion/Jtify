from django.db import models
from django.utils import timezone
from account.models import User

class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    songs = models.ManyToManyField('Song', related_name='songs_on_playlists')
    playlistCover = models.ImageField(upload_to='playlist_pictures/')
    created_at = models.DateTimeField(default=timezone.now)
    

    def __str__(self):
        return self.name

    def add_songs(self, song_ids):
        """
        Add songs to the playlist.
        :param song_ids: List of song ids to add to the playlist.
        """
        songs_to_add = Song.objects.filter(id__in=song_ids)
        self.songs.add(*songs_to_add)

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
    playlist = models.ForeignKey(Playlist, related_name='playlist_on_songs', on_delete=models.CASCADE)
    file = models.FileField(upload_to='song_files/')
    genre = models.CharField(max_length=255, choices=genreChoices)
    created_at = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return self.name
    
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  
    song = models.ForeignKey(Song, on_delete=models.CASCADE)  
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ['user', 'song']

