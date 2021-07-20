class NotFoundError extends Error {
  errorStatusCode = 404;

  constructor(message) {
    super(message);
  }
}

module.exports = NotFoundError;
