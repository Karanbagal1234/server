class CustomError extends Error {
    constructor(message, statusCode, details = null) {
        super(message); // Call the parent Error class's constructor
        this.statusCode = statusCode;
        this.details = details; // Additional metadata (optional)

        // Capture the stack trace (only in non-production environments)
        if (process.env.NODE_ENV !== "production") {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Error Factory Function
export default  (message, statusCode = 500, details = null) => {
    return new CustomError(message, statusCode, details);
};