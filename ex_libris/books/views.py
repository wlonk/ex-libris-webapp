from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import (
    get_object_or_404,
    render,
)

from pure_pagination import (
    Paginator,
    PageNotAnInteger,
)

from . import tasks
from .filters import BookFilter
from .forms import (
    BookForm,
    BookFilterForm,
)
from .models import Book


@login_required
def list(request):
    try:
        page = request.GET.get('page', 1)
    except PageNotAnInteger:
        page = 1
    objects = BookFilter(
        request.GET,
        queryset=Book.objects.filter(owner=request.user),
    )
    p = Paginator(objects, 10, request=request)
    books = p.page(page)
    filter_form = BookFilterForm(request.GET)
    return render(
        request,
        "books/list.html",
        {
            "books": books,
            "filter_form": filter_form,
        }
    )


@login_required
def detail(request, id):
    book = get_object_or_404(Book, id=id)
    if request.method == 'POST':
        form = BookForm(request.POST, instance=book)
        if form.is_valid():
            form.save()
            messages.add_message(
                request,
                messages.INFO,
                "Success!",
            )
    else:
        form = BookForm(instance=book)
    return render(
        request,
        "books/detail.html",
        {
            "book": book,
            "form": form,
        }
    )


# TODO:
# This is begging to be done with CBVs, rather than being quite so hand-rolled.
@login_required
def trigger_dropbox_sync(request):
    if request.method == 'POST':
        tasks.sync_dropbox.delay(request.user)
        messages.add_message(
            request,
            messages.INFO,
            "We've kicked off your import! It'll take a while, be patient.",
        )
        response = HttpResponse('', status=302)
        response['Location'] = request.build_absolute_uri(
            reverse('books:list')
        )
    else:
        response = HttpResponse('', status=405)
        response['Allow'] = 'POST'
    return response
