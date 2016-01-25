from django.contrib.auth.decorators import login_required
from django.shortcuts import (
    get_object_or_404,
    render,
)


from .models import Book


@login_required
def list(request):
    return render(
        request,
        "books/list.html",
        {
            "books": Book.objects.all(),
        }
    )


@login_required
def detail(request, id):
    return render(
        request,
        "books/detail.html",
        {
            "book": get_object_or_404(Book, id=id),
        }
    )
