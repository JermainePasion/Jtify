from rest_framework import serializers
from .models import Ads

class AdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ads
        fields = '__all__'