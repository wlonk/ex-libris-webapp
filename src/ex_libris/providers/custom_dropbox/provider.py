from allauth.socialaccount import providers
from allauth.socialaccount.providers.base import ProviderAccount
from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider


class CustomDropboxOAuth2Account(ProviderAccount):
    pass


class CustomDropboxOAuth2Provider(OAuth2Provider):
    id = 'custom_dropbox_oauth2'
    name = 'Custom Dropbox'
    package = 'ex_libris.providers.custom_dropbox'
    account_class = CustomDropboxOAuth2Account

    def extract_uid(self, data):
        return data['uid']

    def extract_common_fields(self, data):
        return dict(name=data.get('display_name'),
                    email=data.get('email'))

providers.registry.register(CustomDropboxOAuth2Provider)
