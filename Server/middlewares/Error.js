import ExpressError from "../classes/ExpressError.js";

const ErrorMiddleware = (err, req, res, next) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;

  if (err instanceof ExpressError) {
    res.status(statusCode).send({ statusCode, message });
  } else {
    console.error("Unexpected error:", err);
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

export default ErrorMiddleware;
