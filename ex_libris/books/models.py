from django.conf import settings
from django.db import models

from taggit.managers import TaggableManager
from allauth.account.signals import user_signed_up

from .utils import (
    get_dropbox_sharing_link,
    build_args_for_sync_dropbox,
)


class Author(models.Model):
    name = models.CharField(
        max_length=256,
        verbose_name='Author Name',
    )

    def __str__(self):
        return "{s.name}".format(s=self)


class Publisher(models.Model):
    name = models.CharField(
        max_length=256,
        verbose_name='Publisher Name',
    )

    def __str__(self):
        return "{s.name}".format(s=self)


class Series(models.Model):
    name = models.CharField(
        max_length=256,
        verbose_name='Series Name',
    )

    def __str__(self):
        return "{s.name}".format(s=self)


class Book(models.Model):
    class Meta:
        ordering = (
            'series__name',
            'title',
            'year',
        )

    title = models.CharField(max_length=256)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    author = models.ForeignKey(Author, null=True)
    publisher = models.ForeignKey(Publisher, null=True)
    series = models.ForeignKey(Series, null=True)
    edition = models.CharField(max_length=128, blank=True)
    year = models.CharField(max_length=128, blank=True)

    dropbox_id = models.CharField(max_length=256, unique=True, null=True)
    dropbox_sharing_link = models.URLField(default='')

    tags = TaggableManager()

    def __str__(self):
        return "{s.title}".format(s=self)

    def dropbox_link(self):
        if self.dropbox_sharing_link:
            return self.dropbox_sharing_link
        sharing_link = get_dropbox_sharing_link(self.owner, self.dropbox_id)
        self.dropbox_sharing_link = sharing_link
        self.save()
        return sharing_link


def initial_import(request, user, **kwargs):
    from . import tasks
    tasks.sync_dropbox.delay(*build_args_for_sync_dropbox(user))


user_signed_up.connect(initial_import)
