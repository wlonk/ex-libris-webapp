import os.path

import dropbox


def extension_matches(extension, name):
    name, ext = os.path.splitext(name)
    return ".{}".format(extension) == ext


def find_all_files_of_type(dbx, extension):
    results = []
    entries = dbx.files_list_folder(
        '',
        recursive=True,
    ).entries
    for entry in entries:
        if extension_matches(extension, entry.name):
            results.append(entry)
    return results


def get_access_token_for_user(user):
    return user.dropbox_access_token


def get_dropbox_sharing_link(user, dropbox_id):
    access_token = get_access_token_for_user(user)
    dbx = dropbox.Dropbox(access_token)
    path = dbx.files_get_metadata(dropbox_id).path_lower
    return dbx.sharing_create_shared_link(path).url


def build_args_for_sync_dropbox(user):
    access_token = get_access_token_for_user(user)
    return (
        access_token,
        user.pk,
    )
