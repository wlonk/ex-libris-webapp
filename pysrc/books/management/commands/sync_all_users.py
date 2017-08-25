from django.core.management.base import BaseCommand

from ...tasks import sync_for_all_users

class Command(BaseCommand):
    def handle(self, *args, **options):
        sync_for_all_users()
