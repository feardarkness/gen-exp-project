class ValidationError extends Error {
  errorStatusCode = 400;

  constructor(message) {
    super(message);
  }
}

module.exports = ValidationError;
