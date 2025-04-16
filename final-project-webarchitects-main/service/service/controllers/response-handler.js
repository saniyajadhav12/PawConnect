// Send a success response with status 200 and the provided data
export const setSuccess = (data, response) => {
    response.status(200).json(data);  // Send a successful HTTP response with the data
};

// Send an error response with status 500 and the error message
export const setError = (error, response) => {
    console.error("Error:", error);  // Log the full error to the console for debugging

    // If it's a known error type, handle it appropriately
    let statusCode = 500;  // Default to internal server error
    let message = "An unexpected error occurred";

    if (error.name === 'ValidationError') {
        statusCode = 400; // Bad request for validation errors
        message = error.message || "Invalid data provided";
    } else if (error.name === 'MongoError') {
        statusCode = 500; // Database related error
        message = "Database error, please try again later";
    } else if (error.message) {
        message = error.message; // Use the error message if available
    }

    // Send back detailed error message and stack if needed
    response.status(statusCode).json({ 
        message: message, 
        stack: error.stack  // Include stack trace for debugging
    });
};
