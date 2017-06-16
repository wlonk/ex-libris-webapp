User
====

.. http:get:: /user/

   All users.

   **Example request**:

   .. sourcecode:: http

      GET /user/ HTTP/1.1
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
          "username": "17f2554e-bb8a-43ca-9b1c-11c3daf450d8"
        },
        {
          "id": 2,
          "username": "eb661b31-a894-4fa4-a847-89bbcb842dea"
        }
      ]

   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: required bearer token for authentication
   :statuscode 200: no error
