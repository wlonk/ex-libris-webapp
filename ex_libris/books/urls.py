from django.conf.urls import url

from rest_framework import routers

from . import views


urlpatterns = [
    url(r'^$', views.list, name="list"),
    url(r'^tags/(?P<tag>[^/]+)/$', views.tags, name="tags"),
    url(
        r'^dropbox-webhook/$',
        views.DropboxWebhookView.as_view(),
        name='dropbox_webhook',
    ),
]

router = routers.SimpleRouter()
router.register(
    r'api/authors',
    views.AuthorViewSet,
    base_name='author',
)
router.register(
    r'api/publishers',
    views.PublisherViewSet,
    base_name='publisher',
)
router.register(
    r'api/series',
    views.SeriesViewSet,
    base_name='series',
)

urlpatterns += router.urls

urlpatterns += [
    url(r'^(?P<id>[^/]+)/$', views.detail, name='detail'),
]
