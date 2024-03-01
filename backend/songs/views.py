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
            # Extract the current playlist of the song
            current_playlist = song.playlist

            # Update the Song object directly with values from request data
            song.name = request.data.get('name', song.name)
            song.artist = request.data.get('artist', song.artist)
            song.genre = request.data.get('genre', song.genre)

            # Use the provided playlist_id to update the playlist
            playlist_id = request.data.get('playlist')

            # Check if playlist_id is provided and exists
            if playlist_id:
                try:
                    new_playlist = Playlist.objects.get(id=playlist_id)
                    # Switch the song to the new playlist
                    song.playlist = new_playlist
                    new_playlist.songs.add(song)
                    
                    # Remove the song from the current playlist
                    if current_playlist:
                        current_playlist.songs.remove(song)
                except Playlist.DoesNotExist:
                    return Response({"error": "Playlist does not exist."}, status=status.HTTP_400_BAD_REQUEST)
                

            # Handle file upload if present
            if 'picture' in request.FILES:
                song.picture = request.FILES['picture']
            
            if 'file' in request.FILES:
                song.file = request.FILES['file']

            # Save the changes
            song.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"error": "Invalid request body."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


    
    
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
        query = request.query_params.get('query', '')  # Change 'q' to 'query'
        
        # Filter songs based on the search query
        songs = Song.objects.filter(name__icontains=query) | Song.objects.filter(artist__icontains=query)
        song_serializer = SongSerializer(songs, many=True)
    
        # Filter playlists based on the search query
        playlists = Playlist.objects.filter(name__icontains=query)
        playlist_serializer = PlaylistSerializer(playlists, many=True)
        
        return Response({'songs': song_serializer.data, 'playlists': playlist_serializer.data})
    
class PlaylistListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        playlists = Playlist.objects.all()
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['user'] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PlaylistDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Playlist, pk=pk)

    def get(self, request, pk):
        playlist = self.get_object(pk)
        serializer = PlaylistSerializer(playlist)
        return Response(serializer.data)

    def put(self, request, pk):
        playlist = self.get_object(pk)
        serializer = PlaylistSerializer(playlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        playlist = self.get_object(pk)
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class addPlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:

            if Playlist.objects.filter(name=request.data['name'], user=request.user).exists():
                return Response({"error": "Playlist already exists."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = PlaylistSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class MySongListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        songs = Song.objects.filter(user=request.user)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)


class MyPlaylistListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        playlists = Playlist.objects.filter(user=request.user)
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)
    
@api_view(['POST'])
def upload_song_with_specific_playlist(request, playlist_id):
    try:
        # print("Request Data:", request.data)  # Debugging statement

        # Extract data from the request
        song_data = {
            'user': request.user.id,  # Changed 'user' to 'user_id
            'name': request.data.get('name'),
            'artist': request.data.get('artist'),
            'genre': request.data.get('genre'),
            'playlist': request.data.get('playlist'),
            'file': request.FILES.get('file'),
            'picture': request.FILES.get('picture')
        }

        # print("Song Data:", song_data)  # Debugging statement

        # Get the file and picture data from the request.FILES dictionary
        file = request.FILES.get('file')
        picture = request.FILES.get('picture')
        print("File:", request.FILES.get('file'), request.FILES.get('picture'))  # Debugging statement

        # Create the song object
        song_serializer = SongSerializer(data=song_data)
        if song_serializer.is_valid():
            song = song_serializer.save()
        else:
            return Response(song_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Save the file and picture data to the song object
        song.file.save(file.name, file, save=False)
        song.picture.save(picture.name, picture, save=False)
        song.save()

        # Get the playlist ID from the request data
        playlist_id = request.data.get('playlist')  # Corrected the variable name

        print("Playlist ID:", playlist_id)  # Debugging statement

        # Retrieve the playlist object
        playlist = Playlist.objects.get(id=playlist_id)

        # Add the song to the playlist
        playlist.songs.add(song)

        return Response({'message': 'Song uploaded and added to playlist successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("Error:", e)  # Debugging statement
        return Response({'error': 'An error occurred while uploading the song'}, status=status.HTTP_400_BAD_REQUEST)