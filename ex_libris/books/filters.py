import django_filters

from .models import Book


class BookFilter(django_filters.FilterSet):
    class Meta:
        model = Book
        fields = {
            'title': ('icontains',),
            'year': ('icontains',),
            'edition': ('icontains',),
            'author__name': ('icontains',),
            'publisher__name': ('icontains',),
            'series__name': ('icontains',),
        }
