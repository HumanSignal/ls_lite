# Generated by Django 3.2.16 on 2023-04-03 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(blank=True, default='', help_text='Reviewer or annotator comment', null=True, verbose_name='text')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Creation time', verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Last updated time', verbose_name='updated at')),
                ('is_resolved', models.BooleanField(default=False, help_text='True if the comment is resolved', verbose_name='is_resolved')),
                ('resolved_at', models.DateTimeField(default=None, help_text='Resolving time', null=True, verbose_name='resolved at')),
            ],
        ),
    ]
