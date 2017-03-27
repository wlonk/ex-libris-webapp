import django_filters

from .models import Book


class BookFilter(django_filters.FilterSet):
    class Meta:
        model = Book
        fields = (
            'title',
            'edition',
            'author__name',
            'publisher__name',
            'series__name',
        )
        order_by = (
            ('title', 'Title'),
            ('edition', 'Edition'),
            ('author__name', 'Author'),
            ('publisher__name', 'Publisher'),
            ('series__name', 'Series'),
        )
