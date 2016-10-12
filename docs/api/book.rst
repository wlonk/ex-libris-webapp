Book
====

.. http:get:: /book/

   All books owned by the current user.

   **Example request**:

   .. sourcecode:: http

      GET /book/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json, application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      [
        {
          "id": 1,
          "title": "Emma",
          "owner": "example_user",
          "author": {
            "id": 1,
            "name": "Jane Austen"
          },
          "publisher": {
            "id": 1,
            "name": "John Murray"
          },
          "series": {
            "id": 1,
            "name": "The Complete Jane Austen"
          },
          "edition": "1st",
          "year": 1815
        }
      ]

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:post:: /book/

   Create a new book owned by the current user

   **Example request**:

   .. sourcecode:: http

      GET /book/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json, application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "title": "Moby-Dick; or, the Whale",
        "author": {
          "name": "Herman Melville"
        },
        "publisher": {
          "name": "Richard Bentley"
        },
        "series": {
          "name": "Works on Whaling"
        },
        "edition": "1st",
        "year": 1851
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 201 CREATED
      Content-Type: application/json

      {
        "id": 2,
        "title": "Moby-Dick; or, the Whale",
        "owner": "example_user",
        "author": {
          "id": 2,
          "name": "Herman Melville"
        },
        "publisher": {
          "id": 2,
          "name": "Richard Bentley"
        },
        "series": {
          "id": 2,
          "name": "Works on Whaling"
        },
        "edition": "1st",
        "year": 1851
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 201: created successfully

.. http:get:: /book/(int:book_id)/

   A particular book owned by the current user.

   **Example request**:

   .. sourcecode:: http

      GET /book/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json, application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "title": "Emma",
        "owner": "example_user",
        "author": {
          "id": 1,
          "name": "Jane Austen"
        },
        "publisher": {
          "id": 1,
          "name": "John Murray"
        },
        "series": {
          "id": 1,
          "name": "The Complete Jane Austen"
        },
        "edition": "1st",
        "year": 1815
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:put:: /book/(int:book_id)/

   Update a particular book owned by the current user.

   **Example request**:

   .. sourcecode:: http

      PUT /book/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json, application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "title": "Emma: a Novel in Three Volumes",
        "author": {
          "name": "Jane Austen"
        },
        "publisher": {
          "name": "John Murray"
        },
        "series": {
          "name": "The Incomplete Jane Austen"
        },
        "edition": "1st",
        "year": 1815
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "title": "Emma: a Novel in Three Volumes",
        "owner": "example_user",
        "author": {
          "id": 1,
          "name": "Jane Austen"
        },
        "publisher": {
          "id": 1,
          "name": "John Murray"
        },
        "series": {
          "id": 1,
          "name": "The Incomplete Jane Austen"
        },
        "edition": "1st",
        "year": 1815
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:patch:: /book/(int:book_id)/

   Partial-update a particular book owned by the current user.

   **Example request**:

   .. sourcecode:: http

      PUT /book/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json, application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "title": "Emma: my favorite book",
        "series": {
          "name": "Yet more Jane Austen"
        }
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "title": "Emma: my favorite book",
        "owner": "example_user",
        "author": {
          "id": 1,
          "name": "Jane Austen"
        },
        "publisher": {
          "id": 1,
          "name": "John Murray"
        },
        "series": {
          "id": 1,
          "name": "Yet more Jane Austen"
        },
        "edition": "1st",
        "year": 1815
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:delete:: /book/(int:book_id)/

   Remove a particular book owned by the current user.

   **Example request**:

   .. sourcecode:: http

      DELETE /book/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json, application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 204 No Content
      Content-Type: application/json

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 204: successfully deleted
