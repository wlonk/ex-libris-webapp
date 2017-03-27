from django.conf.urls import url

from rest_framework import routers

from . import views


router = routers.DefaultRouter()
router.register(r'author', views.AuthorViewSet)
router.register(r'book', views.BookViewSet)
router.register(r'publisher', views.PublisherViewSet)
router.register(r'series', views.SeriesViewSet)
# Ugh, this is terrible cross-app stuff, but it'll do for now:
router.register(r'user', views.UserViewSet)
urlpatterns = router.urls

urlpatterns += [
    url(
        r'^dropbox-webhook/$',
        views.DropboxWebhookView.as_view(),
        name='dropbox_webhook',
    ),
]
