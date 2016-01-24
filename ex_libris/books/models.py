import datetime
from django.conf import settings
from django.db import models
from taggit.managers import TaggableManager


YEAR_CHOICES = []

for r in range(1980, (datetime.datetime.now().year+1)):
    YEAR_CHOICES.append((r, r))


class Author(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self):
        return "{s.name}".format(s=self)


class Publisher(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self):
        return "{s.name}".format(s=self)


class Series(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self):
        return "{s.name}".format(s=self)


class Book(models.Model):
    title = models.CharField(max_length=256)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    author = models.ForeignKey(Author, null=True)
    publisher = models.ForeignKey(Publisher, null=True)
    series = models.ForeignKey(Series, null=True)
    edition = models.CharField(max_length=128, blank=True)
    year = models.IntegerField(
        choices=YEAR_CHOICES,
        null=True,
    )

    dropbox_id = models.CharField(max_length=256, default='')
    dropbox_sharing_link = models.URLField(default='')

    tags = TaggableManager()

    def __str__(self):
        return "{s.title}".format(s=self)

    def dropbox_link(self):
        if self.dropbox_sharing_link:
            return self.dropbox_sharing_link
        import dropbox
        from django.contrib.auth import get_user_model
        User = get_user_model()
        from .utils import get_access_token_for_user
        user = User.objects.first()
        access_token = get_access_token_for_user(user)
        dbx = dropbox.Dropbox(access_token)
        path = dbx.files_get_metadata(self.dropbox_id).path_lower
        foo = dbx.sharing_create_shared_link(path).url
        self.dropbox_sharing_link = foo
        self.save()
        return foo
