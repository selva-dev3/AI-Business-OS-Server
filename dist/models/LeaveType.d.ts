import mongoose, { Document, Types } from 'mongoose';
export interface ILeaveType extends Document {
    name: string;
    code: string;
    annualAllowance?: number;
    carryForward?: boolean;
    maxCarryForward?: number;
    isPaid?: boolean;
    requiresApproval?: boolean;
    description?: string;
    companyId: Types.ObjectId;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const LeaveType: mongoose.Model<ILeaveType, {}, {}, {}, mongoose.Document<unknown, {}, ILeaveType, {}, {}> & ILeaveType & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default LeaveType;
//# sourceMappingURL=LeaveType.d.ts.map