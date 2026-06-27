import mongoose, { Document, Types } from 'mongoose';
export interface IEmployeeHistory extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    changeType: string;
    oldValue?: string;
    newValue?: string;
    oldDepartmentId?: Types.ObjectId;
    newDepartmentId?: Types.ObjectId;
    oldDesignationId?: Types.ObjectId;
    newDesignationId?: Types.ObjectId;
    effectiveDate?: Date;
    changedBy?: Types.ObjectId;
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const EmployeeHistory: mongoose.Model<IEmployeeHistory, {}, {}, {}, mongoose.Document<unknown, {}, IEmployeeHistory, {}, {}> & IEmployeeHistory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default EmployeeHistory;
//# sourceMappingURL=EmployeeHistory.d.ts.map