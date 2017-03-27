Series
======

.. http:get:: /series/

   All series attached to books the current user owns.

   **Example request**:

   .. sourcecode:: http

      GET /series/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      [
        {
          "id": 1,
          "name": "The Incomplete Jane Austen"
        },
        {
          "id": 2,
          "name": "Works on Whaling"
        }
      ]

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:post:: /series/

   Create a new series.

   **Example request**:

   .. sourcecode:: http

      POST /book/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "name": "New York Society in the 1890's"
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 201 CREATED
      Content-Type: application/json

      {
        "id": 3,
        "name": "New York Society in the 1890's"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 201: created successfully

.. http:get:: /series/(int:series_id)/

   A particular series owned by the current user.

   **Example request**:

   .. sourcecode:: http

      GET /series/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "name": "The Incomplete Jane Austen"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:put:: /series/(int:series_id)/

   Update a particular series owned by the current user.

   **Example request**:

   .. sourcecode:: http

      PUT /series/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "name": "The Complete Jane Austen"
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "name": "The Complete Jane Austen"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:patch:: /series/(int:series_id)/

   Partial-update a particular series owned by the current user.

   **Example request**:

   .. sourcecode:: http

      PATCH /series/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "name": "Another Jane Austen Collection"
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "name": "Another Jane Austen Collection"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:delete:: /series/(int:series_id)/

   Remove a particular series owned by the current user.

   **Example request**:

   .. sourcecode:: http

      DELETE /series/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 204 No Content
      Content-Type: application/json

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 204: successfully deleted
