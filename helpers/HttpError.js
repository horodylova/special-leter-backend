const messageList = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error"  
};

const HttpError = (status, message = messageList[status]) => {
    return {
        status,
        message
    };
};

module.exports = HttpError;
