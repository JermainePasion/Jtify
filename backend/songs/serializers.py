from rest_framework import serializers
from .models import Song, Like, Playlist
from account.models import User 

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'name', 'user', 'playlist','picture', 'file', 'artist', 'genre', 'created_at']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['user', 'song', 'created_at']

    def create(self, validated_data):
        # Extract the request from the context
        # request = self.context.get('request')
        
        # Get the authenticated user from the request
        # user = request.user.id if request and request.user.is_authenticated else None
        # print(validated_data['user'])
        # print(request.user.is_authenticated)
        # Modify validated_data to ensure the 'user' field is set correctly
        # validated_data['user'] = user
        
        # Pass the modified validated_data to the Like model creation
        like_instance = Like.objects.create(**validated_data)
        return like_instance
    
class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    class Meta:
        model = Playlist
        fields = ['id', 'name',  'songs', 'playlistCover', 'created_at', ]
