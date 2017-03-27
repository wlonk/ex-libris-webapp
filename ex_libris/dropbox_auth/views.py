from rest_framework import views
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .serializers import DropboxAuthTokenSerializer


class ExchangeDropboxTokensView(views.APIView):
    permission_classes = (
        AllowAny,
    )
    serializer_class = DropboxAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
