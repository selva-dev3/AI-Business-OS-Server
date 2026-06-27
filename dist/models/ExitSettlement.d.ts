import mongoose, { Document, Types } from 'mongoose';
export interface IExitSettlement extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    resignationId?: Types.ObjectId;
    noticePeriodDays?: number;
    noticePeriodAmount?: number;
    unpaidLeaves?: number;
    unpaidLeaveDeduction?: number;
    pendingReimbursements?: number;
    bonusAmount?: number;
    otherEarnings?: number;
    otherDeductions?: number;
    totalAmount?: number;
    status?: string;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    paidAt?: Date;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const ExitSettlement: mongoose.Model<IExitSettlement, {}, {}, {}, mongoose.Document<unknown, {}, IExitSettlement, {}, {}> & IExitSettlement & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ExitSettlement;
//# sourceMappingURL=ExitSettlement.d.ts.map