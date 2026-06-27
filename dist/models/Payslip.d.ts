import mongoose, { Document, Types } from 'mongoose';
export interface IPayslip extends Document {
    payrollId: Types.ObjectId;
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    basicSalary?: number;
    hra?: number;
    ta?: number;
    da?: number;
    otherAllowances?: unknown[];
    deductions?: unknown[];
    pf?: number;
    esi?: number;
    tds?: number;
    grossSalary?: number;
    netSalary?: number;
    status?: string;
    pdfUrl?: string;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Payslip: mongoose.Model<IPayslip, {}, {}, {}, mongoose.Document<unknown, {}, IPayslip, {}, {}> & IPayslip & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Payslip;
//# sourceMappingURL=Payslip.d.ts.map