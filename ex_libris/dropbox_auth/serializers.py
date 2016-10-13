from uuid import uuid4

from dropbox.dropbox import Dropbox

from requests.exceptions import HTTPError
from rest_framework import (
    exceptions,
    serializers,
)

from .utils import get_dropbox_bearer_token

from django.contrib.auth import get_user_model
from django.utils.text import slugify
User = get_user_model()


def get_unique_username(username):
    ret = slugify(username)
    if User.objects.filter(username=ret).exists():
        ret = "{}:{}".format(ret, str(uuid4()))
    return ret


class DropboxAuthTokenSerializer(serializers.Serializer):
    code = serializers.CharField()
    redirect_uri = serializers.URLField()

    def validate(self, attrs):
        code = attrs.get('code')
        redirect_uri = attrs.get('redirect_uri')

        # Talk to Dropbox:
        try:
            data = get_dropbox_bearer_token(code, redirect_uri)
            # Rekey and drop unnecessary data:
            dropbox_data = {
                'dropbox_account_id': data['account_id'],
                'dropbox_uid': data['uid'],
            }
            dropbox = Dropbox(data['access_token'])
            account = dropbox.users_get_account(data['account_id'])
            username = get_unique_username(account.name.familiar_name)
            email = account.email
            name = account.name.display_name
            dropbox_data_defaults = {
                'username': username,
                'email': email,
                'name': name,
                'dropbox_access_token': data['access_token'],
            }
        except HTTPError:
            raise exceptions.ValidationError('Invalid Dropbox code')

        # Make appropriate user and return it:
        user, _ = User.objects.get_or_create(
            defaults=dropbox_data_defaults,
            **dropbox_data
        )
        user.dropbox_access_token = data['access_token']
        user.save()
        attrs['user'] = user
        return attrs
