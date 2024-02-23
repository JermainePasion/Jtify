from django.urls import path
from .views import *

urlpatterns = [
    path('', SongListView.as_view(), name='song-list'),
    path('<int:pk>/like/', LikeSong.as_view(), name='like-song'),
    path('<int:pk>/deleteLike/', unlikeSong.as_view(), name='unlike-song'),
    path('liked/<int:user_id>/', LikeSongList.as_view(), name='like-song-list'),
    path('<int:pk>/', SongDetailView.as_view(), name='song-detail'),
    path('<int:pk>/edit/', edit_songs, name='edit-song'),
    path('upload/', upload_songs, name='upload-song'),
    path('<int:pk>/delete/', delete_songs, name='delete-song'),
    path('genres/<str:genre>/', GenreSongListView.as_view(), name='genre-song-list'),
    path('search/', SearchSongListView.as_view(), name='search-song-list'),
    path('playlist/', PlaylistListView.as_view(), name='playlist-list'),
]