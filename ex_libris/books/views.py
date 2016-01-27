from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import (
    get_object_or_404,
    render,
)


from .models import Book
from .forms import BookForm


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
        from . import tasks
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
