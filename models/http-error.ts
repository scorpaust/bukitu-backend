class HttpError extends Error {
  code: number;

  constructor(message, errorCode) {
    super(message);

    this.code = errorCode;
  }
}

module.exports = HttpError;
