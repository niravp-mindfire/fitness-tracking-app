def successResponse(data, message):
    return {
        "status": "success",
        "message": message,
        "data": data,
    }

def errorResponse(message, error=None):
    return {
        "status": "error",
        "message": message,
        "error": error if error else None,
    }
