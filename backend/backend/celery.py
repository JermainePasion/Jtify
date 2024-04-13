import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'check_subscription_expiration': {
        'task': 'account.tasks.check_subscription_expiration',
        'schedule': crontab(hour=16, minute=10),
    },
}