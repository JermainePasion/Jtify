from django.urls import path
from .views import *

urlpatterns = [
    path('', SongListView.as_view(), name='song-list'),
    path('<int:pk>/', SongDetailView.as_view(), name='song-detail'),
    path('<int:pk>/edit/', edit_songs, name='edit-song'),
    path('upload/', upload_songs, name='upload-song'),
    path('<int:pk>/delete/', delete_songs, name='delete-song')
]