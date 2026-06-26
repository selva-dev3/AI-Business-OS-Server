const { v4: uuidv4 } = require('uuid');

class ApiResponse {
  static success(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    });
  }

  static paginated(res, data, meta) {
    return res.status(200).json({
      success: true,
      data: { data, meta },
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    });
  }

  static created(res, data) {
    return this.success(res, data, 201);
  }

  static error(res, statusCode, error, message, path) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      error,
      message,
      path: path || res.req?.originalUrl,
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    });
  }
}

module.exports = ApiResponse;
