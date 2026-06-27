import Notification from '../models/Notification';
import AppError from '../utils/appError';
import { paginateQuery, buildMeta } from '../utils/helpers';

const list = async (userId: string, query: Record<string, unknown> = {}) => {
  const { page, limit, skip } = paginateQuery(query.page as string, Number(query.limit));
  const filter: Record<string, unknown> = { userId };

  if (query.isRead !== undefined) filter.isRead = query.isRead === 'true';
  if (query.type) filter.type = query.type;

  const [data, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);

  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return { data, meta: { ...buildMeta(total, page, limit), unreadCount } };
};

const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) throw new AppError(404, 'NOT_FOUND', 'Notification not found');
  return notification;
};

const markAllAsRead = async (userId: string) => {
  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  return { success: true };
};

const remove = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
  if (!notification) throw new AppError(404, 'NOT_FOUND', 'Notification not found');
  return { success: true };
};

const getUnreadCount = async (userId: string) => {
  const count = await Notification.countDocuments({ userId, isRead: false });
  return { count };
};

const create = async (data: Record<string, unknown>) => {
  const notification = await Notification.create(data);
  return notification;
};

export {
  list,
  markAsRead,
  markAllAsRead,
  remove,
  getUnreadCount,
  create,
};
