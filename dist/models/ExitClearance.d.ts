import mongoose, { Document, Types } from 'mongoose';
export interface IExitClearance extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    resignationId?: Types.ObjectId;
    departmentId: Types.ObjectId;
    clearanceBy?: Types.ObjectId;
    clearedAt?: Date;
    status?: string;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const ExitClearance: mongoose.Model<IExitClearance, {}, {}, {}, mongoose.Document<unknown, {}, IExitClearance, {}, {}> & IExitClearance & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ExitClearance;
//# sourceMappingURL=ExitClearance.d.ts.map