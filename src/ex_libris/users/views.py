# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

import time
from urllib.parse import urlencode

from django.core.urlresolvers import reverse
from django.views.generic import (
    DetailView,
    ListView,
    RedirectView,
    UpdateView,
)

from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from braces.views import LoginRequiredMixin

from .models import User


class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = "username"
    slug_url_kwarg = "username"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = context['user']
        context['is_self'] = self.request.user == user
        return context


class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        # TODO: better values here.
        token, _ = Token.objects.get_or_create(user=self.request.user)
        uid = self.request.user.username
        client = 'web'
        expiry = round(time.time() + 60 * 60 * 24)
        return '{}?{}'.format(
            reverse("home"),
            urlencode({
                'token': token,
                'uid': uid,
                'client': client,
                'expiry': expiry,
            }),
        )


class UserValidateTokenView(APIView):
    def get(self, request):
        # TODO: Better values here:
        if request.user.is_authenticated():
            payload = {
                "success": True,
                "data": {
                    "uid": request.user.email,
                    "provider": "dropbox",
                },
            }
            token, _ = Token.objects.get_or_create(user=self.request.user)
            uid = self.request.user.username
            client = 'web'
            expiry = round(time.time() + 60 * 60 * 24)
            headers = {
                "access-token": token,
                "client": client,
                "expiry": expiry,
                "uid": uid,
            }
            return Response(
                payload,
                status=status.HTTP_200_OK,
                headers=headers,
            )
        return Response('', status=status.HTTP_403_FORBIDDEN)


class UserUpdateView(LoginRequiredMixin, UpdateView):

    fields = ['name', ]

    # we already imported User in the view code above, remember?
    model = User

    # send the user back to their own page after a successful update
    def get_success_url(self):
        return reverse("users:detail",
                       kwargs={"username": self.request.user.username})

    def get_object(self):
        # Only get the User record for the user making the request
        return User.objects.get(username=self.request.user.username)


class UserListView(LoginRequiredMixin, ListView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = "username"
    slug_url_kwarg = "username"
