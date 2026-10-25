// Send a success response with status 200 and the provided data
export const setSuccess = (data, response) => {
    response.status(200).json(data);  // Send a successful HTTP response with the data
};

// Send an error response; the full error is logged on the server only
export const setError = (error, response) => {
    console.error("Error:", error);  // Log the full error to the console for debugging

    // If it's a known error type, handle it appropriately
    let statusCode = 500;  // Default to internal server error
    let message = "An unexpected error occurred";

    if (error.name === 'ValidationError') {
        statusCode = 400; // Bad request for validation errors
        message = error.message || "Invalid data provided";
    } else if (error.name === 'CastError') {
        statusCode = 400; // Malformed ID or field value
        message = `Invalid value for ${error.path}`;
    } else if (error.code === 11000) {
        statusCode = 409; // Duplicate unique field (e.g. email)
        message = `A record with this ${Object.keys(error.keyValue || {}).join(", ") || "value"} already exists`;
    }

    response.status(statusCode).json({ message });
};
