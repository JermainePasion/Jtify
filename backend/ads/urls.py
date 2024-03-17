from django.urls import path
from .views import *


urlpatterns = [
    path('list/', get_ads, name='ad-list'),
    path('upload_ads/', uploadAds, name='ad-upload'),
    path('<int:pk>/', ad_detail, name='ad-detail'),
]