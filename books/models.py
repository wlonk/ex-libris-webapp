import datetime
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
    author = models.ForeignKey(Author)
    publisher = models.ForeignKey(Publisher)
    series = models.ForeignKey(Series)
    edition = models.CharField(max_length=128)
    year = models.IntegerField(
        choices=YEAR_CHOICES,
        default=datetime.datetime.now().year,
    )
    tags = TaggableManager()

    def __str__(self):
        return "{s.title}".format(s=self)
