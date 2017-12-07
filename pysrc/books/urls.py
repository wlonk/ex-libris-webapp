from django.conf.urls import url

from rest_framework import routers

from . import views


app_name = 'books'
urlpatterns = [
    # TODO: something about this:
    url(
        r'^dropbox-webhook/$',
        views.DropboxWebhookView.as_view(),
        name='dropbox_webhook',
    ),
]

router = routers.DefaultRouter()
router.register(
    r'authors',
    views.AuthorViewSet,
    base_name='author',
)
router.register(
    r'publishers',
    views.PublisherViewSet,
    base_name='publisher',
)
router.register(
    r'series',
    views.SeriesViewSet,
    base_name='series',
)
router.register(
    r'books',
    views.BookViewSet,
    base_name='books',
)

urlpatterns += router.urls
