import mongoose, { Document, Types } from 'mongoose';
export interface IPayroll extends Document {
    companyId: Types.ObjectId;
    month: number;
    year: number;
    status?: string;
    totalAmount?: number;
    totalEmployees?: number;
    processedBy?: Types.ObjectId;
    processedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Payroll: mongoose.Model<IPayroll, {}, {}, {}, mongoose.Document<unknown, {}, IPayroll, {}, {}> & IPayroll & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Payroll;
//# sourceMappingURL=Payroll.d.ts.map