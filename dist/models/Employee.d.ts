import mongoose, { Document, Types } from 'mongoose';
export interface IEmployee extends Document {
    employeeCode: string;
    firstName: string;
    lastName?: string;
    email: string;
    personalEmail?: string;
    phone?: string;
    alternatePhone?: string;
    dob?: Date;
    gender?: string;
    bloodGroup?: string;
    maritalStatus?: string;
    avatar?: string;
    employmentType?: string;
    status?: string;
    joiningDate?: Date;
    confirmationDate?: Date;
    exitDate?: Date;
    exitReason?: string;
    address?: Record<string, unknown>;
    emergencyContact?: Record<string, unknown>;
    bankDetails?: Record<string, unknown>;
    panNumber?: string;
    aadharNumber?: string;
    companyId: Types.ObjectId;
    departmentId?: Types.ObjectId;
    designationId?: Types.ObjectId;
    branchId?: Types.ObjectId;
    userId?: Types.ObjectId;
    reportingManagerId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Employee: mongoose.Model<IEmployee, {}, {}, {}, mongoose.Document<unknown, {}, IEmployee, {}, {}> & IEmployee & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Employee;
//# sourceMappingURL=Employee.d.ts.map