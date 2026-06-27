import mongoose, { Document, Types } from 'mongoose';
export interface ILeaveRequest extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    leaveTypeId: Types.ObjectId;
    fromDate: Date;
    toDate: Date;
    days: number;
    reason?: string;
    status?: string;
    comments?: string;
    attachments?: string[];
    approvedBy?: Types.ObjectId;
    rejectedBy?: Types.ObjectId;
    approvedAt?: Date;
    rejectedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const LeaveRequest: mongoose.Model<ILeaveRequest, {}, {}, {}, mongoose.Document<unknown, {}, ILeaveRequest, {}, {}> & ILeaveRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default LeaveRequest;
//# sourceMappingURL=LeaveRequest.d.ts.map