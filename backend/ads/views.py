from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import generics
from .models import Ads
from .serializers import AdSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

class AdList(generics.ListAPIView):
    queryset = Ads.objects.all()
    serializer_class = AdSerializer

@api_view(['GET'])
def get_ads(request):
    qs = Ads.objects.all()
    serializer = AdSerializer(qs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def uploadAds(request):
    serializer = AdSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@parser_classes([MultiPartParser, FormParser])
def ad_detail(request, pk):
    """
    Retrieve, update, or delete an ad.
    """
    try:
        ad = Ads.objects.get(pk=pk)
    except Ads.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AdSerializer(ad)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AdSerializer(ad, data=request.data)
        if serializer.is_valid():
            # Check if files are present in the request data
            if 'image' in request.data and request.data['image'] is not None:
                serializer.validated_data['image'] = request.data['image']
            else:
                serializer.validated_data['image'] = ad.image  # Use the existing image

            if 'audio' in request.data and request.data['audio'] is not None:
                serializer.validated_data['audio'] = request.data['audio']
            else:
                serializer.validated_data['audio'] = ad.audio  # Use the existing audio

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        ad.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
