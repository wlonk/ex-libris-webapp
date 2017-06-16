from allauth.socialaccount.providers.oauth.urls import default_urlpatterns

from .provider import CustomDropboxOAuth2Provider

urlpatterns = default_urlpatterns(CustomDropboxOAuth2Provider)
