from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Song
from .serializers import SongSerializer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.utils.datastructures import MultiValueDictKeyError
import json
from django.views.decorators.csrf import csrf_exempt


class SongListView(APIView):

    def get(self, request):
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SongSerializer(data=request.data)
        if serializer.is_valid():
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
    try:
        song = Song.objects.get(id=pk)
    except Song.DoesNotExist as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        try:
            # Use request.data instead of json.loads(request.body)
            song.name = request.data.get('name', song.name)
            song.artist = request.data.get('artist', song.artist)

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