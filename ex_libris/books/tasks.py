from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

import dropbox
from dropbox.exceptions import ApiError
from celery import shared_task

import logging

from .models import Book
from .utils import (
    find_all_files_of_type,
    build_args_for_sync_dropbox,
)
User = get_user_model()

# Get an instance of a logger
logger = logging.getLogger(__name__)


@shared_task
def sync_dropbox(access_token, user_id):
    dbx = dropbox.Dropbox(access_token)
    try:
        entries = find_all_files_of_type(dbx, 'pdf')
    except ApiError:
        # TODO log error: no such import root
        return
    for entry in entries:
        try:
            Book.objects.get_or_create(
                dropbox_id=entry.id,
                owner_id=user_id,
                defaults=dict(
                    title=entry.name,
                ),
            )
        except IntegrityError as e:
            logger.error(e)
        except Book.MultipleObjectsReturned as e:
            logger.error(e)
    Book.objects.filter(
        owner_id=user_id,
    ).exclude(
        dropbox_id__in=[entry.id for entry in entries],
    ).delete()
    Book.objects.filter(
        owner_id=user_id,
    ).update(
        dropbox_sharing_link='',
    )


@shared_task
def update_all_users():
    for user in User.objects.all():
        args = build_args_for_sync_dropbox(user)
        sync_dropbox(*args)
