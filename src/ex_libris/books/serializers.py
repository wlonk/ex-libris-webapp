from rest_framework import serializers

from .models import (
    Author,
    Publisher,
    Series,
    Book,
)


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = (
            'id',
            'name',
        )


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = (
            'id',
            'name',
        )


class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = (
            'id',
            'name',
        )


class BookSerializer(serializers.ModelSerializer):
    id = serializers.CharField()

    class Meta:
        model = Book
        fields = (
            'id',
            'title',
            'owner',
            'author',
            'publisher',
            'series',
            'edition',
            'year',
        )
        extra_kwargs = {
            'owner': {
                'read_only': True,
            },
        }
