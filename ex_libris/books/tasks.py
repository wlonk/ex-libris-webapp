from django.contrib.auth import get_user_model

import dropbox
from celery import shared_task

from .models import Book
from .utils import (
    find_all_files_of_type,
    get_access_token_for_user,
)
User = get_user_model()


@shared_task
def sync_dropbox(user):
    access_token = get_access_token_for_user(user)
    dbx = dropbox.Dropbox(access_token)
    profile = user.bookprofile.import_root or 'ex-libris'
    entries = find_all_files_of_type(dbx, 'pdf', profile.import_root)
    for entry in entries:
        Book.objects.get_or_create(
            dropbox_id=entry.id,
            owner=user,
            defaults=dict(
                title=entry.name,
            ),
        )


@shared_task
def update_all_users():
    for user in User.objects.all():
        sync_dropbox(user)
