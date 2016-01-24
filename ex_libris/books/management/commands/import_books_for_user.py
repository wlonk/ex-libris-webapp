from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from ex_libris.books.tasks import sync_dropbox

User = get_user_model()


class Command(BaseCommand):
    def add_arguments(self, parser):
        # Positional arguments
        parser.add_argument('username', nargs='+', type=str)

    def handle(self, *args, **options):
        for username in options['username']:
            try:
                user = User.objects.get(username=username)
                sync_dropbox(user)
            except User.DoesNotExist:
                self.stderr.write('No such user: {}'.format(username))
