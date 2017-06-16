Publisher
=========

.. http:get:: /publisher/

   All publishers attached to books the current user owns.

   **Example request**:

   .. sourcecode:: http

      GET /publisher/ HTTP/1.1
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
          "name": "John Murray"
        },
        {
          "id": 2,
          "name": "Richard Bentley"
        }
      ]

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:post:: /publisher/

   Create a new publisher.

   **Example request**:

   .. sourcecode:: http

      POST /book/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "name": "D. Appleton & Co."
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 201 CREATED
      Content-Type: application/json

      {
        "id": 3,
        "name": "D. Appleton & Co."
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 201: created successfully

.. http:get:: /publisher/(int:publisher_id)/

   A particular publisher owned by the current user.

   **Example request**:

   .. sourcecode:: http

      GET /publisher/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "name": "John Murray"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:put:: /publisher/(int:publisher_id)/

   Update a particular publisher owned by the current user.

   **Example request**:

   .. sourcecode:: http

      PUT /publisher/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "name": "John Murray Co."
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "name": "John Murray Co."
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:patch:: /publisher/(int:publisher_id)/

   Partial-update a particular publisher owned by the current user.

   **Example request**:

   .. sourcecode:: http

      PATCH /publisher/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "name": "Another John Murray"
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "name": "Another John Murray"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:delete:: /publisher/(int:publisher_id)/

   Remove a particular publisher owned by the current user.

   **Example request**:

   .. sourcecode:: http

      DELETE /publisher/1/ HTTP/1.1
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
