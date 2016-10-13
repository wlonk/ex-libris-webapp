import json

from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
)
from django.shortcuts import (
    get_object_or_404,
    render,
)
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from rest_framework import viewsets

from pure_pagination import (
    Paginator,
    PageNotAnInteger,
)

from . import tasks
from .filters import BookFilter
from .forms import BookForm
from .models import (
    Book,
    Author,
    Publisher,
    Series,
)
from .serializers import (
    BookSerializer,
    AuthorSerializer,
    PublisherSerializer,
    SeriesSerializer,
    UserSerializer,
)
from .permissions import ReadOnly
from .utils import build_args_for_sync_dropbox
User = get_user_model()


class LimitToOwnerMixin:
    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


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
    edit_form = BookForm()
    return render(
        request,
        "books/list.html",
        {
            "books": books,
            "filter": objects,
            "edit_form": edit_form,
        }
    )


def initial_helper(book, attr):
    related_model = getattr(book, attr, None)
    if related_model is not None:
        return '{}_name'.format(attr), related_model.name
    return None, None


@login_required
def detail(request, id):
    book = get_object_or_404(Book, id=id)
    if request.method == 'POST':
        # Horrible hack to deal with frontend framework mishegas:
        is_in_place_field_edit = request.is_ajax() and 'value' in request.POST
        if is_in_place_field_edit:
            form_dict = {
                request.POST.get('name', ''): request.POST.get('value', ''),
            }
        else:
            form_dict = request.POST
        form = BookForm(form_dict, instance=book)
        if form.is_valid():
            form.save()
            if not request.is_ajax():
                messages.add_message(
                    request,
                    messages.INFO,
                    "Success!",
                )
    else:
        form = BookForm(instance=book)
        # TODO: including this here, rather than in the BookForm, is tech debt.
        # However, due to some shenanigans (possibly involving metaclasses and
        # the crispy forms library's templatetags?), overriding __init__ caused
        # an exception to be raised. Until I figure out why, this is the
        # solution.
        for attr in ('author', 'publisher', 'series'):
            key, value = initial_helper(book, attr)
            if key is not None:
                field = form.fields.get(key)
                if field is not None:
                    field.initial = value
    if request.is_ajax():
        return HttpResponse(
            json.dumps(
                form.cleaned_data,
            ),
        )
    else:
        return render(
            request,
            "books/detail.html",
            {
                "book": book,
                "form": form,
            }
        )


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
                dropbox_uid=user_id,
            ).first()
            args = build_args_for_sync_dropbox(user)
            tasks.sync_dropbox.delay(*args)
        return HttpResponse('')


class TypeaheadDataViewSet(viewsets.ModelViewSet):
    permission_classes = (
        ReadOnly,
    )

    def get_queryset(self):
        return self.model.objects.filter(
            book__owner=self.request.user,
        )


class AuthorViewSet(TypeaheadDataViewSet):
    model = Author
    serializer_class = AuthorSerializer
    queryset = model.objects.all()

    def get_queryset(self):
        return self.model.objects.filter(
            book__owner=self.request.user,
        )


class PublisherViewSet(TypeaheadDataViewSet):
    model = Publisher
    serializer_class = PublisherSerializer
    queryset = model.objects.all()

    def get_queryset(self):
        return self.model.objects.filter(
            book__owner=self.request.user,
        )


class SeriesViewSet(TypeaheadDataViewSet):
    model = Series
    serializer_class = SeriesSerializer
    queryset = model.objects.all()

    def get_queryset(self):
        return self.model.objects.filter(
            book__owner=self.request.user,
        )


class BookViewSet(LimitToOwnerMixin, viewsets.ModelViewSet):
    model = Book
    serializer_class = BookSerializer
    queryset = model.objects.all()


class UserViewSet(viewsets.ModelViewSet):
    model = User
    serializer_class = UserSerializer
    queryset = User.objects.all()
