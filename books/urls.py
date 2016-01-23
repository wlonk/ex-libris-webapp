from django.conf.urls import url

from . import views


urlpatterns = (
    url(r'^$', views.list, name="list"),
    url(r'^(?P<id>[^/]+)/$', views.detail, name='detail'),
)
