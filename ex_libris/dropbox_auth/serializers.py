from uuid import uuid4

from requests.exceptions import HTTPError
from rest_framework import (
    exceptions,
    serializers,
)

from .utils import get_dropbox_bearer_token

from django.contrib.auth import get_user_model
User = get_user_model()


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
            dropbox_data_defaults = {
                'username': str(uuid4()),
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
