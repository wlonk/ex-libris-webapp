from collections import OrderedDict

import django_filters

from .models import Book


class BookFilter(django_filters.FilterSet):
    class Meta:
        model = Book
        fields = OrderedDict((
            ('title', ('icontains',)),
            ('edition', ('icontains',)),
            ('author__name', ('icontains',)),
            ('publisher__name', ('icontains',)),
            ('series__name', ('icontains',)),
        ))
        order_by = (
            ('title', 'Title'),
            ('edition', 'Edition'),
            ('author__name', 'Author'),
            ('publisher__name', 'Publisher'),
            ('series__name', 'Series'),
        )
