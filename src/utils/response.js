export const sendResponse = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        result: data
    });
};