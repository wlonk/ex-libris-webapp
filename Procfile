web: gunicorn config.wsgi:application
worker: celery worker --app=ex_libris.taskapp --loglevel=info
