export default class ApiError extends Error {
  constructor(statusCode = 500, message = "Something went wrong", data = {}) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}
