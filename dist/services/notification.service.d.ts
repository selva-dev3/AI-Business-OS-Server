declare const list: (userId: string, query?: Record<string, unknown>) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/Notification").INotification, {}, {}> & import("../models/Notification").INotification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: {
        unreadCount: number;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
declare const markAsRead: (notificationId: string, userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Notification").INotification, {}, {}> & import("../models/Notification").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const markAllAsRead: (userId: string) => Promise<{
    success: boolean;
}>;
declare const remove: (notificationId: string, userId: string) => Promise<{
    success: boolean;
}>;
declare const getUnreadCount: (userId: string) => Promise<{
    count: number;
}>;
declare const create: (data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Notification").INotification, {}, {}> & import("../models/Notification").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export { list, markAsRead, markAllAsRead, remove, getUnreadCount, create, };
//# sourceMappingURL=notification.service.d.ts.map