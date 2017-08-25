import json

from django.contrib.auth import get_user_model
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
)
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from channels import Channel

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import (
    Book,
    Author,
    Publisher,
    Series,
)
from .serializers import (
    AuthorSerializer,
    PublisherSerializer,
    SeriesSerializer,
    BookSerializer,
)
from .permissions import ReadOnly
from .utils import build_kwargs_for_sync_dropbox

User = get_user_model()


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
            right_user = (
                user is not None
                and user.socialaccount_set.first().extra_data.get(
                    'uid',
                    None,
                ) == user_id
            )
            if not right_user:
                # TODO log warning?
                continue
            kwargs = build_kwargs_for_sync_dropbox(user)
            Channel('sync-dropbox').send(kwargs)
        return HttpResponse('')


class TypeaheadDataViewSet(viewsets.ModelViewSet):
    permission_classes = (ReadOnly)

    def get_queryset(self):
        return self.model.objects.filter(book__owner=self.request.user)


class AuthorViewSet(TypeaheadDataViewSet):
    model = Author
    serializer_class = AuthorSerializer
    permission_classes = (IsAuthenticated,)


class PublisherViewSet(TypeaheadDataViewSet):
    model = Publisher
    serializer_class = PublisherSerializer
    permission_classes = (IsAuthenticated,)


class SeriesViewSet(TypeaheadDataViewSet):
    model = Series
    serializer_class = SeriesSerializer
    permission_classes = (IsAuthenticated,)


class BookViewSet(viewsets.ModelViewSet):
    model = Book
    serializer_class = BookSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.model.objects.filter(owner=self.request.user)
