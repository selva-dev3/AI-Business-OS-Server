import mongoose, { Document, Types } from 'mongoose';
export interface IAuditLog extends Document {
    companyId: Types.ObjectId;
    userId: Types.ObjectId;
    action: string;
    module: string;
    entityType: string;
    entityId?: unknown;
    oldValues?: unknown;
    newValues?: unknown;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const AuditLog: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, {}> & IAuditLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default AuditLog;
//# sourceMappingURL=AuditLog.d.ts.map