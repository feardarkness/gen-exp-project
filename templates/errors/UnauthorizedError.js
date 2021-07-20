class UnauthorizedError extends Error {
  errorStatusCode = 401;

  constructor(message) {
    super(message);
  }
}

module.exports = UnauthorizedError;
