class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    if (data) this.data = data;
  }
}

// Success response
export const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
};
