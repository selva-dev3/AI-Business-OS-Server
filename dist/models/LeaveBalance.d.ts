import mongoose, { Document, Types } from 'mongoose';
export interface ILeaveBalance extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    leaveTypeId: Types.ObjectId;
    year: number;
    allocated: number;
    taken?: number;
    pending?: number;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const LeaveBalance: mongoose.Model<ILeaveBalance, {}, {}, {}, mongoose.Document<unknown, {}, ILeaveBalance, {}, {}> & ILeaveBalance & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default LeaveBalance;
//# sourceMappingURL=LeaveBalance.d.ts.map