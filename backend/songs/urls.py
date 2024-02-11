from django.urls import path
from .views import *

urlpatterns = [
    path('', SongListView.as_view(), name='song-list'),
    path('<int:pk>/', SongDetailView.as_view(), name='song-detail'),
    path('<int:pk>/like/', LikeSongView.as_view(), name='like-song'),
    path('<int:pk>/unlike/', UnlikeSongView.as_view(), name='unlike-song'),
    path('<int:pk>/likes/', SongLikesView.as_view(), name='song_likes'),
]