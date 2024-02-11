from django.contrib import admin
from django import forms
from .models import Song
from account.models import User

class SongAdminForm(forms.ModelForm):
    # Define a field to select users for liking a song
    users_liked = forms.ModelMultipleChoiceField(
        queryset=User.objects.all(),
        required=False,
        label='Users Liked',
        help_text='Select users who have liked this song'
    )

    class Meta:
        model = Song
        fields = '__all__'


class SongAdmin(admin.ModelAdmin):
    form = SongAdminForm
    filter_horizontal = ('likes',)  # Allows a horizontal filter interface for the 'likes' field

admin.site.register(Song, SongAdmin)