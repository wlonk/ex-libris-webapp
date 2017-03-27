# -*- coding: utf-8 -*-
from __future__ import unicode_literals, absolute_import

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _

from rest_framework.authtoken.models import Token


@python_2_unicode_compatible
class User(AbstractUser):

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_("Name of User"), blank=True, max_length=255)

    # Dropbox data:
    dropbox_access_token = models.CharField(max_length=255, blank=True)
    dropbox_account_id = models.CharField(max_length=255, blank=True)
    dropbox_uid = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.username

    def get_absolute_url(self):
        return ""


@receiver(post_save, sender=User)
def init_new_user(sender, instance, signal, created, **kwargs):
    """
    Create an authentication token for newly created users.
    """
    if created:
        Token.objects.create(user=instance)
