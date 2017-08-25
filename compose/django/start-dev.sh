#!/bin/sh
python pysrc/manage.py migrate
# Replace this line with a gulp task:
# python pysrc/manage.py collectstatic --noinput
python pysrc/manage.py runserver 0.0.0.0:8000
