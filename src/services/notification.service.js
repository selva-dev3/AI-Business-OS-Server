const Notification = require('../models/Notification');
const AppError = require('../utils/appError');
const { paginateQuery, buildMeta } = require('../utils/helpers');

const list = async (userId, query = {}) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { userId };

  if (query.isRead !== undefined) filter.isRead = query.isRead === 'true';
  if (query.type) filter.type = query.type;

  const [data, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);

  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return { data, meta: { ...buildMeta(total, page, limit), unreadCount } };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) throw new AppError(404, 'NOT_FOUND', 'Notification not found');
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  return { success: true };
};

const remove = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
  if (!notification) throw new AppError(404, 'NOT_FOUND', 'Notification not found');
  return { success: true };
};

const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ userId, isRead: false });
  return { count };
};

const create = async (data) => {
  const notification = await Notification.create(data);
  return notification;
};

module.exports = {
  list,
  markAsRead,
  markAllAsRead,
  remove,
  getUnreadCount,
  create,
};
