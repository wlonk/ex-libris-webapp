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
            dropbox_data = get_dropbox_bearer_token(code, redirect_uri)
            # Rekey and drop unnecessary data:
            dropbox_data = {
                'dropbox_access_token': dropbox_data['access_token'],
                'dropbox_account_id': dropbox_data['account_id'],
                'dropbox_uid': dropbox_data['uid'],
            }
        except HTTPError:
            raise exceptions.ValidationError('Invalid Dropbox code')

        # Make appropriate user and return it:
        user = User.objects.filter(**dropbox_data).first()
        if user is None:
            user = User.objects.create(
                username=str(uuid4()),
                **dropbox_data,
            )
        attrs['user'] = user
        return attrs
