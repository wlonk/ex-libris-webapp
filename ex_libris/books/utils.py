import os.path

from django.contrib.auth import get_user_model

import dropbox

def extension_matches(extension, name):
    name, ext = os.path.splitext(name)
    return ".{}".format(extension) == ext


def is_folder(entry):
    return isinstance(entry, dropbox.files.FolderMetadata)


def find_all_files_of_type(dbx, extension, root=''):
    results = []
    entries = dbx.files_list_folder(root).entries
    for entry in entries:
        if extension_matches(extension, entry.name):
            results.append(entry)
        elif is_folder(entry):
            results.extend(
                find_all_files_of_type(dbx, extension, entry.path_lower)
            )
    return results


def get_access_token_for_user(user):
    return (
        user
        .socialaccount_set
        .filter(provider='custom_dropbox_oauth2',)
        .first()
        .socialtoken_set
        .first()
        .token
    )


def get_dropbox_sharing_link(user, dropbox_id):
    access_token = get_access_token_for_user(user)
    dbx = dropbox.Dropbox(access_token)
    path = dbx.files_get_metadata(dropbox_id).path_lower
    return dbx.sharing_create_shared_link(path).url
