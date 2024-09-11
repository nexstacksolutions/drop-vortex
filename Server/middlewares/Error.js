import ExpressError from "../classes/ExpressError.js";

const ErrorMiddleware = (err, req, res, next) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;

  if (err instanceof ExpressError) {
    res.status(statusCode).send({ statusCode, message });
  } else {
    console.error("Unexpected error:", err);
    res.status(statusCode).send({
      statusCode,
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
};

export default ErrorMiddleware;
