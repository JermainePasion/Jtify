from celery import shared_task
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import User

# User = get_user_model()

@shared_task
def check_subscription_expiration():
    today = timezone.now().date()
    expired_subscriptions = User.objects.filter(
        is_subscriber=True, subscription_end_date__lte=today
    )
    for user in expired_subscriptions:
        user.is_subscriber = False
        user.save()