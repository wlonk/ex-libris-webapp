ex-libris
==============================

Manage your RPG PDFs.

LICENSE: BSD

Settings
------------

Moved to settings_.

.. _settings: http://cookiecutter-django.readthedocs.org/en/latest/settings.html

Basic Commands
--------------

Set up initial database contents
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You have to create the database::

    $ createdb ex_libris

And then set up the tables::

    $ python manage.py migrate

And then populate the database with the Dropbox OAuth configuration::

    $ python manage.py create_social_auth_provider

Test coverage
^^^^^^^^^^^^^

To run the tests, check your test coverage, and generate an HTML coverage
report::

    $ fab test
    $ open htmlcov/index.html

Live reloading and Sass CSS compilation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We have Sass we need to compile on changes, so we wrap ``manage.py runserver``
in some ``grunt`` magic::

    $ npm install
    $ npm install -g grunt-cli
    $ grunt serve

Running end to end integration tests
------------------------------------

N.B. The integration tests will not run on Windows.

To install the test runner::

  $ pip install hitch

To run the tests, enter the ``ex_libris/tests`` directory and run the
following commands::

  $ hitch init

Then run the stub test::

  $ hitch test stub.test

This will download and compile python, postgres and redis and install all
python requirements so the first time it runs it may take a while.

Subsequent test runs will be much quicker.

The testing framework runs Django, Postgres, HitchSMTP (a mock SMTP
server), Firefox/Selenium and Redis.

Deployment
----------

We providing tools and instructions for deploying using Docker and Heroku.

Heroku
^^^^^^

.. image:: https://www.herokucdn.com/deploy/button.png
    :target: https://heroku.com/deploy

See detailed `cookiecutter-django Heroku documentation`_.

.. _`cookiecutter-django Heroku documentation`: http://cookiecutter-django.readthedocs.org/en/latest/deployment-on-heroku.html

Docker
^^^^^^

See detailed `cookiecutter-django Docker documentation`_.

.. _`cookiecutter-django Docker documentation`: http://cookiecutter-django.readthedocs.org/en/latest/deployment-with-docker.html
