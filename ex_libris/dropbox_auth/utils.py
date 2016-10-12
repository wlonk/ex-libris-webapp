import requests
from requests.auth import HTTPBasicAuth
from django.conf import settings


def get_dropbox_bearer_token(code, redirect_uri):
    """
    Arguments
    ---------
    code : str
        A code from the frontend's OAuth2 flow.
    redirect_uri : str
        The redirect_uri that the frontend used in its OAuth2 flow. This is used
        by dropbox to verify that we're part of the same request entity.

    Returns
    -------
    dict
        A decoded bit of JSON that looks like this:
        {
            'access_token': some_token,
            'account_id': some_account_id,
            'token_type': 'bearer',
            'uid': some_uid,
        }
    """
    auth = HTTPBasicAuth(
        settings.DROPBOX_API_KEY,
        settings.DROPBOX_API_SECRET,
    )
    url = 'https://api.dropboxapi.com/oauth2/token'
    data = {
        'code': code,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code',
    }
    resp = requests.post(url, data=data, auth=auth)
    resp.raise_for_status()
    return resp.json()
