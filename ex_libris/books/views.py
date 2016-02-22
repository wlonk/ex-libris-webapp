import json

from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed,
    HttpResponseRedirect,
)
from django.shortcuts import (
    get_object_or_404,
    render,
)
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from pure_pagination import (
    Paginator,
    PageNotAnInteger,
)

from . import tasks
from .filters import BookFilter
from .forms import (
    BookForm,
    BookProfileForm,
)
from .models import Book
from .utils import build_args_for_sync_dropbox
User = get_user_model()


# TODO this is code duplicationtastic. Abstract these two into a CBV, override a
# queryset attribute as appropriate.
@login_required
def tags(request, tag):
    try:
        page = request.GET.get('page', 1)
    except PageNotAnInteger:
        page = 1
    objects = BookFilter(
        request.GET,
        queryset=Book.objects.filter(owner=request.user).filter(tags__name=tag),
    )
    p = Paginator(objects, 10, request=request)
    books = p.page(page)
    return render(
        request,
        "books/list.html",
        {
            "books": books,
            "filter": objects,
        }
    )


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
    return render(
        request,
        "books/list.html",
        {
            "books": books,
            "filter": objects,
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
        form = BookProfileForm(request.POST, instance=request.user.bookprofile)
        if form.is_valid():
            form.save()
            args = build_args_for_sync_dropbox(request.user)
            tasks.sync_dropbox.delay(*args)
            messages.add_message(
                request,
                messages.INFO,
                "We've kicked off your import! It'll take a while, be patient.",
            )
            response = HttpResponseRedirect(
                request.build_absolute_uri(
                    reverse('books:list')
                )
            )
        else:
            response = HttpResponseBadRequest(
                json.dumps(form.errors),
                content_type='application/json',
            )
    else:
        response = HttpResponseNotAllowed(['POST'])
    return response


class DropboxWebhookView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        return HttpResponse(request.GET.get('challenge'))

    def post(self, request):
        try:
            body = request.body.decode()
        except UnicodeDecodeError:
            return HttpResponseBadRequest()
        users = json.loads(body).get('delta', {}).get('users', [])
        for user_id in users:
            user = User.objects.filter(
                socialaccount__extra_data__contains=user_id,
            ).first()
            # Just make sure we didn't get a false match on some other
            # attribute:
            right_user = user is not None and user.socialaccount_set.first(
            ).extra_data.get(
                'uid',
                None,
            ) == user_id
            if not right_user:
                # TODO log warning?
                continue
            args = build_args_for_sync_dropbox(user)
            tasks.sync_dropbox.delay(*args)
        return HttpResponse('')
