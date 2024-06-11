class ApiErrors extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiErrors(401, 'Ползователь не авторизован')
  }
  static BadRequest(message, errors = []) {
    return new ApiErrors(400, message, errors)
  }
  static NotFound(message, errors = []) {
    return new ApiErrors(404, message, errors)
  }
}

export default ApiErrors;