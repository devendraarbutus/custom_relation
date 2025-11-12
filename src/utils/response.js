class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    if (data) this.data = data;
  }
}

class ApiError {
  constructor(statusCode, message) {
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
  }
}

// Success response
export const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
};
