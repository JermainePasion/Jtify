# Generated by Django 5.0.1 on 2024-02-12 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0014_likedsong'),
        ('songs', '0003_remove_song_likes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='likedsong',
            name='song',
        ),
        migrations.AddField(
            model_name='likedsong',
            name='song',
            field=models.ManyToManyField(related_name='liked_by_users', to='songs.song'),
        ),
    ]
