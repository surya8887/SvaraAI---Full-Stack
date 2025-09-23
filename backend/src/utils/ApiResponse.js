export default class ApiResponse {
  constructor(status = 200, data = {}, message = "") {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}
