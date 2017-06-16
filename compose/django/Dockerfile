FROM python:3.6

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONPATH src

# Requirements have to be pulled and installed here, otherwise caching won't work
COPY ./requirements.txt /requirements.txt
COPY ./requirements/base.txt /requirements/base.txt
COPY ./requirements/local.txt /requirements/local.txt
RUN pip install --no-cache-dir -r /requirements/local.txt

COPY ./compose/django/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r//' /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY ./compose/django/start-dev.sh /start-dev.sh
RUN sed -i 's/\r//' /start-dev.sh
RUN chmod +x /start-dev.sh

WORKDIR /app

ENTRYPOINT ["/entrypoint.sh"]
