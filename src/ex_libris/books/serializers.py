from rest_framework import serializers

from .models import (
    Author,
    Publisher,
    Series,
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
