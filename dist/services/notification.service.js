"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.getUnreadCount = exports.remove = exports.markAllAsRead = exports.markAsRead = exports.list = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const list = async (userId, query = {}) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { userId };
    if (query.isRead !== undefined)
        filter.isRead = query.isRead === 'true';
    if (query.type)
        filter.type = query.type;
    const [data, total] = await Promise.all([
        Notification_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Notification_1.default.countDocuments(filter),
    ]);
    const unreadCount = await Notification_1.default.countDocuments({ userId, isRead: false });
    return { data, meta: { ...(0, helpers_1.buildMeta)(total, page, limit), unreadCount } };
};
exports.list = list;
const markAsRead = async (notificationId, userId) => {
    const notification = await Notification_1.default.findOneAndUpdate({ _id: notificationId, userId }, { isRead: true, readAt: new Date() }, { new: true });
    if (!notification)
        throw new appError_1.default(404, 'NOT_FOUND', 'Notification not found');
    return notification;
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (userId) => {
    await Notification_1.default.updateMany({ userId, isRead: false }, { isRead: true, readAt: new Date() });
    return { success: true };
};
exports.markAllAsRead = markAllAsRead;
const remove = async (notificationId, userId) => {
    const notification = await Notification_1.default.findOneAndDelete({ _id: notificationId, userId });
    if (!notification)
        throw new appError_1.default(404, 'NOT_FOUND', 'Notification not found');
    return { success: true };
};
exports.remove = remove;
const getUnreadCount = async (userId) => {
    const count = await Notification_1.default.countDocuments({ userId, isRead: false });
    return { count };
};
exports.getUnreadCount = getUnreadCount;
const create = async (data) => {
    const notification = await Notification_1.default.create(data);
    return notification;
};
exports.create = create;
//# sourceMappingURL=notification.service.js.map