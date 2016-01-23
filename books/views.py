from django.shortcuts import (
    get_object_or_404,
    render,
)

from .models import Book


def list(request):
    return render(
        request,
        "books/list.html",
        {
            "books": Book.objects.all(),
        }
    )


def detail(request, id):
    return render(
        request,
        "books/detail.html",
        {
            "book": get_object_or_404(Book, id=id),
        }
    )
