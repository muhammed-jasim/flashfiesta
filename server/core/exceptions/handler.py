from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    # Validation errors
    if isinstance(exc, ValidationError):
        first_error = "Validation error"

        if isinstance(response.data, dict):
            first_key = next(iter(response.data))
            first_error = response.data[first_key][0]

        return Response(
            {
                "Status": 6001,
                "message": first_error,
            },
            status=response.status_code,
        )

    return response