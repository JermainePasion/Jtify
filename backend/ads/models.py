from django.db import models

class Ads(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='ads/', null=True, blank=True)
    # video = models.FileField(upload_to='ads/videos/', null=True, blank=True)
    audio = models.FileField(upload_to='ads/audio/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
