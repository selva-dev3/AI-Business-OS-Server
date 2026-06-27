import mongoose, { Document, Types } from 'mongoose';
export interface INotification extends Document {
    companyId: Types.ObjectId;
    userId: Types.ObjectId;
    type: string;
    title: string;
    message?: string;
    link?: string;
    isRead?: boolean;
    readAt?: Date;
    metadata?: unknown;
    createdAt: Date;
    updatedAt: Date;
}
declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Notification;
//# sourceMappingURL=Notification.d.ts.map