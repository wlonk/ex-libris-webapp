from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.sites.models import Site

from allauth.socialaccount.models import SocialApp


class Command(BaseCommand):
    def handle(self, *args, **options):
        SocialApp.objects.all().delete()
        sa = SocialApp.objects.create(
            provider='custom_dropbox_oauth2',
            name='Dropbox',
            client_id=settings.DROPBOX_API_KEY,
            secret=settings.DROPBOX_API_SECRET,
        )
        site = Site.objects.first()
        sa.sites.add(site)
