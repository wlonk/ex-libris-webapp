from rest_framework import serializers

from .models import (
    Author,
    Publisher,
    Series,
    Book,
)


class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Author
        fields = (
            'id',
            'name',
        )


class PublisherSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Publisher
        fields = (
            'id',
            'name',
        )


class SeriesSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Series
        fields = (
            'id',
            'name',
        )


class BookSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    author = AuthorSerializer()
    publisher = PublisherSerializer()
    series = SeriesSerializer()

    def handle_nested_attribute(self, instance, validated_data, name, klass):
        # We want to always create a new related obj, so as not to
        # surprise-modify other books.
        data = validated_data.pop(name)
        nested_obj = klass.objects.filter(**data).first()
        if not nested_obj:
            nested_obj = klass.objects.create(**data)
        setattr(instance, name, nested_obj)

    def update(self, instance, validated_data):
        self.handle_nested_attribute(
            instance,
            validated_data,
            'author',
            Author,
        )
        self.handle_nested_attribute(
            instance,
            validated_data,
            'publisher',
            Publisher,
        )
        self.handle_nested_attribute(
            instance,
            validated_data,
            'series',
            Series,
        )
        return super().update(instance, validated_data)

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
