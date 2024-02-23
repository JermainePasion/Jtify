from django.contrib import admin
from .models import Song, Like, Playlist


    
admin.site.register(Song)
admin.site.register(Like)
admin.site.register(Playlist)