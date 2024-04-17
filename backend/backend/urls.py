
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include # new
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView, # new
#     TokenRefreshView, # new
# )
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('admin/', admin.site.urls),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # new
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # new
    path('api/user/', include('account.urls')), # new
    path('api/songs/', include('songs.urls')),
    path('api/ads/', include('ads.urls')),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
