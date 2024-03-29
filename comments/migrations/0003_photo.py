# Generated by Django 3.2.16 on 2023-06-20 19:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0002_comment_picture'),
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('picture', models.FileField(null=True, upload_to='photo')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Creation time', verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Last updated time', verbose_name='updated at')),
                ('comment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='comments.comment')),
            ],
        ),
    ]
