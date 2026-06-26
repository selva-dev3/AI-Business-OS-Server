const ApiResponse = require('../utils/apiResponse');
const notificationService = require('../services/notification.service');

const list = async (req, res, next) => {
  try {
    const result = await notificationService.list(req.user._id, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    return ApiResponse.success(res, notification);
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await notificationService.remove(req.params.id, req.user._id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const result = await notificationService.getUnreadCount(req.user._id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  markAsRead,
  markAllAsRead,
  remove,
  getUnreadCount,
};
