class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // Pass message to Error constructor
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}

export default ExpressError;
