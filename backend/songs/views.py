from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework import filters
from .models import Song, Like
from .serializers import *
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.utils.datastructures import MultiValueDictKeyError
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny


class SongListView(APIView):

    def get(self, request):
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SongSerializer(data=request.data)
        if serializer.is_valid():
            # Associate the song with the authenticated user
            serializer.validated_data['user'] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SongDetailView(APIView):


    def get_object(self, pk):
        return get_object_or_404(Song, pk=pk)

    def get(self, request, pk):
        song = self.get_object(pk)
        serializer = SongSerializer(song)
        return Response(serializer.data)

    def put(self, request, pk):
        song = self.get_object(pk)
        serializer = SongSerializer(song, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        song = self.get_object(pk)
        song.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@csrf_exempt
@api_view(['PUT'])
def edit_songs(request, pk):
    permission_classes = [IsAuthenticated]
    try:
        song = Song.objects.get(id=pk)
    except Song.DoesNotExist as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        try:
            # Use request.data instead of json.loads(request.body)
            song.name = request.data.get('name', song.name)
            song.artist = request.data.get('artist', song.artist)
            song.genre = request.data.get('genre', song.genre)

            # Handle file upload if present
            if 'picture' in request.FILES:
                song.picture = request.FILES['picture']
            
            if 'file' in request.FILES:
                song.file = request.FILES['file']

            song.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"error": "Invalid request body."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['POST'])
def upload_songs(request):
    permission_classes = [IsAuthenticated]
    try:
        name = request.data.get('name')
        artist = request.data.get('artist')
        picture = request.FILES.get('picture')
        genre = request.data.get('genre')
        file = request.FILES.get('file')

        if name is None or artist is None or picture is None or file is None:
            return Response({"error": "Missing required fields in the request."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user

        song = Song(name=name, artist=artist, picture=picture, file=file, genre=genre, user=user)
        song.save()
        return Response(status=status.HTTP_201_CREATED)

    except MultiValueDictKeyError as e:
        return Response({"error": "Invalid request body."}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
def delete_songs(request, pk):
    permission_classes = [IsAuthenticated]
    try:
        song = Song.objects.get(id=pk)
    except Song.DoesNotExist as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    song.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

class LikeSong(APIView):
    def post(self, request, pk, format=None):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get the song object
        try:
            song = Song.objects.get(pk=pk)  # Corrected line
        except Song.DoesNotExist:
            return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Create a new like for the song and the authenticated user
        like_data = {'user': request.user.id, 'song': song.id}
        serializer = LikeSerializer(data=like_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, pk, format=None):
        # Retrieve liked songs for the given song_id
        liked_songs = Like.objects.filter(song_id=pk)  # Corrected line
        serializer = LikeSerializer(liked_songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LikeSongList(APIView):
    permission_classes = [AllowAny]  # Set permission_classes to AllowAny

    def get(self, request, user_id, format=None):
        # Retrieve liked songs for the specified user_id
        liked_songs = Like.objects.filter(user_id=user_id)
        
        # Serialize the liked songs using the modified LikeSerializer
        serializer = LikeSerializer(liked_songs, many=True)
        
        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class unlikeSong(APIView):
    permission_classes = [IsAuthenticated]  # Require authentication to access this endpoint

    def delete(self, request, pk, format=None):
        try:
            song = Song.objects.get(pk=pk)
        except Song.DoesNotExist:
            return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            like = Like.objects.get(user=request.user.id, song=song.id)
        except Like.DoesNotExist:
            print("Like not found.")
            return Response({"error": "Like not found"}, status=status.HTTP_404_NOT_FOUND)

        like.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class GenreSongListView(APIView):
    def get(self, request, genre):
        songs = Song.objects.filter(genre=genre)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)
    
class SearchSongListView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        songs = Song.objects.filter(name__icontains=query) | Song.objects.filter(artist__icontains=query)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)
    
class PlaylistListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        playlists = Playlist.objects.filter(user=request.user)
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['user'] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)