from django.conf.urls import url

from . import views


urlpatterns = (
    url(r'tags/(?P<tag>[^/]+)/$', views.tags, name="tags"),
    url(r'^$', views.list, name="list"),
    url(r'^import/$', views.trigger_dropbox_sync, name='trigger_dropbox_sync'),
    url(r'^(?P<id>[^/]+)/$', views.detail, name='detail'),
)
