web: daphne ex_libris.asgi:channel_layer --port $PORT --bind 0.0.0.0 -v2
worker: python pysrc/manage.py runworker -v2
