import os.path

import dropbox


def extension_matches(extension, name):
    name, ext = os.path.splitext(name)
    return ".{}".format(extension) == ext


def find_all_files_of_type(dbx, extension):
    return [
        entry
        for entry
        in dbx.files_list_folder('', recursive=True).entries
        if extension_matches(extension, entry.name)
    ]


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


def build_kwargs_for_sync_dropbox(user):
    access_token = get_access_token_for_user(user)
    return {
        'access_token': access_token,
        'user_id': user.pk,
    }
