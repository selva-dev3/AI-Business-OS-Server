import mongoose, { Document, Types } from 'mongoose';
export interface ISalaryStructure extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    effectiveFrom: Date;
    basicSalary: number;
    hra?: number;
    ta?: number;
    da?: number;
    pf?: number;
    esi?: number;
    otherAllowances?: unknown[];
    deductions?: unknown[];
    grossSalary: number;
    netSalary: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const SalaryStructure: mongoose.Model<ISalaryStructure, {}, {}, {}, mongoose.Document<unknown, {}, ISalaryStructure, {}, {}> & ISalaryStructure & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default SalaryStructure;
//# sourceMappingURL=SalaryStructure.d.ts.map