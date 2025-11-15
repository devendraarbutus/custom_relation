export const sendResponse = (res, statusCode, message, data ) => {
    const response = {
        success: true,
        statusCode,
        message,
    };

    // Agar data defined aur empty object/string/array nahi hai to hi add karo
    if (data !== undefined && data !== null && 
        !(typeof data === 'object' && Object.keys(data).length === 0) &&
        !(Array.isArray(data) && data.length === 0)) {
        response.result = data;
    }

    return res.status(statusCode).json(response);
};