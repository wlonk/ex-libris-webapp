from channels.routing import route


from . import tasks

channel_routing = [
    route("sync-all-users", tasks.sync_for_all_users),
    route("sync-dropbox", tasks.sync_dropbox),
]
