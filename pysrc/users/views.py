# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

import time
from urllib.parse import urlencode

from django.conf import settings
from django.core.signing import (
    TimestampSigner,
    BadSignature,
    SignatureExpired,
)
from django.urls import reverse
from django.views.generic import (
    DetailView,
    ListView,
    RedirectView,
    UpdateView,
)

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView

from braces.views import LoginRequiredMixin

from .authentication import BearerAuthentication
from .models import User


class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = 'username'
    slug_url_kwarg = 'username'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = context['user']
        context['is_self'] = self.request.user == user
        return context


class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        signer = TimestampSigner()
        uid = self.request.user.username
        token = signer.sign(uid)
        client = 'web'
        expiry = settings.AUTH_TOKEN_LIFETIME
        return '{}?{}'.format(
            reverse('home'),
            urlencode({
                'token': token,
                'uid': uid,
                'client': client,
                'expiry': expiry,
            }),
        )


class UserTokenView(APIView):
    authentication_classes = []
    auth = BearerAuthentication()

    def delete(self, request):
        try:
            user, _ = self.auth.authenticate(request)
            return Response({'success': True}, status=status.HTTP_200_OK)
        except AuthenticationFailed:
            return Response(
                {'errors': ['Not logged in.']},
                status=status.HTTP_403_FORBIDDEN,
            )

    def get(self, request):
        uid = request.META['HTTP_UID']
        _, token = request.META['HTTP_AUTHORIZATION'].split(' ')
        signer = TimestampSigner()
        try:
            token_valid = signer.unsign(
                token,
                max_age=settings.AUTH_TOKEN_LIFETIME,
            ) == uid
        except (SignatureExpired, BadSignature):
            try:
                token_valid = self.auth.authenticate(request)
            except AuthenticationFailed:
                token_valid = False
        if token_valid:
            payload = {
                'success': True,
                'data': {
                    'uid': uid,
                    'provider': 'dropbox',
                },
            }
            user = User.objects.get(username=uid)
            token, _ = Token.objects.get_or_create(user=user)
            client = 'web'
            expiry = round(time.time() + 60 * 60 * 24 * 30)
            headers = {
                'access-token': token,
                'client': client,
                'expiry': expiry,
                'uid': uid,
            }
            return Response(
                payload,
                status=status.HTTP_200_OK,
                headers=headers,
            )
        return Response(
            {'errors': ['Invalid token.']},
            status=status.HTTP_403_FORBIDDEN,
        )


class UserUpdateView(LoginRequiredMixin, UpdateView):
    fields = (
        'name',
    )

    # we already imported User in the view code above, remember?
    model = User

    # send the user back to their own page after a successful update
    def get_success_url(self):
        return reverse(
            'users:detail',
            kwargs={'username': self.request.user.username},
        )

    def get_object(self):
        # Only get the User record for the user making the request
        return User.objects.get(username=self.request.user.username)


class UserListView(LoginRequiredMixin, ListView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = 'username'
    slug_url_kwarg = 'username'
