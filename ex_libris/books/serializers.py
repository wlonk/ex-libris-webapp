from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import (
    Author,
    Book,
    Publisher,
    Series,
)
User = get_user_model()


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
    author = AuthorSerializer()
    publisher = PublisherSerializer()
    series = SeriesSerializer()
    owner = serializers.ReadOnlyField(source='owner.username')

    def create(self, validated_data):
        author, _ = Author.objects.get_or_create(
            name=validated_data.pop('author')['name'],
        )
        validated_data['author'] = author

        publisher, _ = Publisher.objects.get_or_create(
            name=validated_data.pop('publisher')['name'],
        )
        validated_data['publisher'] = publisher

        series, _ = Series.objects.get_or_create(
            name=validated_data.pop('series')['name'],
        )
        validated_data['series'] = series

        return Book.objects.create(**validated_data)

    def update(self, instance, validated_data):
        author = instance.author
        author_name = validated_data.pop('author', {}).get('name')
        if author_name:
            author.name = author_name
            author.save()

        publisher = instance.publisher
        publisher_name = validated_data.pop('publisher', {}).get('name')
        if publisher_name:
            publisher.name = publisher_name
            publisher.save()

        series = instance.series
        series_name = validated_data.pop('series', {}).get('name')
        if series_name:
            series.name = series_name
            series.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
        )
