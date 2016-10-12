# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-01 21:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20160928_0033'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='dropbox_access_token',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='dropbox_account_id',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='dropbox_uid',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]