# Generated by Django 5.0.1 on 2024-03-18 14:05

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0026_remove_artistregister_artist_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artistregister',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]