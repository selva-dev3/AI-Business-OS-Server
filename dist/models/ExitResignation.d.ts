import mongoose, { Document, Types } from 'mongoose';
export interface IExitResignation extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    resignationDate: Date;
    lastWorkingDay: Date;
    reason: string;
    remarks?: string;
    status?: string;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const ExitResignation: mongoose.Model<IExitResignation, {}, {}, {}, mongoose.Document<unknown, {}, IExitResignation, {}, {}> & IExitResignation & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ExitResignation;
//# sourceMappingURL=ExitResignation.d.ts.map