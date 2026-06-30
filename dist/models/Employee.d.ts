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
    suspensionDetails?: {
        reason: string;
        suspendedBy: Types.ObjectId;
        suspendedAt: Date;
        expectedReinstatement?: Date;
        notes?: string;
    } | null;
    suspensionHistory?: Array<{
        reason: string;
        suspendedBy: Types.ObjectId;
        suspendedAt: Date;
        reinstatedBy: Types.ObjectId;
        reinstatedAt: Date;
        expectedReinstatement?: Date;
        notes?: string;
    }>;
    terminationDetails?: {
        lastWorkingDate?: Date;
        reason?: string;
        reasonDetails?: string;
        exitChecklist?: {
            laptopReturned?: boolean;
            accessRevoked?: boolean;
            fnfSettled?: boolean;
            relievingLetterIssued?: boolean;
            exitInterviewDone?: boolean;
        };
        noticePeriodServed?: boolean;
        finalSalaryProcessed?: boolean;
        terminatedBy?: Types.ObjectId;
        terminatedAt?: Date;
    } | null;
    roleHistory?: Array<{
        designation?: string;
        departmentId?: Types.ObjectId;
        employmentType?: string;
        reportingManagerId?: Types.ObjectId;
        changedAt?: Date;
        changedBy?: Types.ObjectId;
        reason?: string;
    }>;
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