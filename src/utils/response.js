class ApiResponse {
  constructor(statusCode, message, result = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    if (result) this.result = result;
  }
}

// Success response
export const sendResponse = (res, statusCode, message, result = null) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, message, result));
};
