from rest_framework import serializers
from .models import Song
from account.models import User

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'name', 'artist', 'picture', 'file']

class LikeSerializer(serializers.ModelSerializer):
    # Assuming your User model has a field named 'full_name' to identify users
    full_name = serializers.CharField(source='name')

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email']  # Adjust fields as per your User model

class UnlikeSongSerializer(serializers.Serializer):
    song_id = serializers.IntegerField()
    user_id = serializers.IntegerField()

    def validate(self, data):
        # You can add additional validation logic here if needed
        return data