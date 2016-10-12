Author
======

.. http:get:: /author/

   All authors attached to books the current user owns.

   **Example request**:

   .. sourcecode:: http

      GET /author/ HTTP/1.1
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
          "name": "Jane Austen"
        },
        {
          "id": 2,
          "name": "Herman Melville"
        }
      ]

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:post:: /author/

   Create a new author.

   **Example request**:

   .. sourcecode:: http

      POST /book/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "name": "Edith Wharton"
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 201 CREATED
      Content-Type: application/json

      {
        "id": 3,
        "name": "Edith Wharton"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 201: created successfully

.. http:get:: /author/(int:author_id)/

   A particular author owned by the current user.

   **Example request**:

   .. sourcecode:: http

      GET /author/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "name": "Jane Austen"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:put:: /author/(int:author_id)/

   Update a particular author owned by the current user.

   **Example request**:

   .. sourcecode:: http

      PUT /author/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "name": "The Incomparable Jane Austen"
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "name": "The Incomparable Jane Austen"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:patch:: /author/(int:author_id)/

   Partial-update a particular author owned by the current user.

   **Example request**:

   .. sourcecode:: http

      PATCH /author/1/ HTTP/1.1
      Host: api.exlibris.ink
      Accept: application/json
      Authorization: Token 01234567-89ab-cdef-0123-456789abcdef

      {
        "name": "Another Jane Austen"
      }

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Content-Type: application/json

      {
        "id": 1,
        "name": "Another Jane Austen"
      }

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error

.. http:delete:: /author/(int:author_id)/

   Remove a particular author owned by the current user.

   **Example request**:

   .. sourcecode:: http

      DELETE /author/1/ HTTP/1.1
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
