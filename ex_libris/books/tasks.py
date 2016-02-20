from django.contrib.auth import get_user_model

import dropbox
from celery import shared_task

import logging

from .models import Book
from .utils import (
    find_all_files_of_type,
    get_access_token_for_user,
)
User = get_user_model()

# Get an instance of a logger
logger = logging.getLogger(__name__)


@shared_task
def sync_dropbox(user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        logger.warn("No such user: {}".format(user_id))
        return
    access_token = get_access_token_for_user(user)
    dbx = dropbox.Dropbox(access_token)
    profile = user.bookprofile.import_root or '/ex-libris'
    entries = find_all_files_of_type(dbx, 'pdf', profile)
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
