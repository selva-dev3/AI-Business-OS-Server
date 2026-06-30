import mongoose, { Document, Types } from 'mongoose';
export interface IDesignation extends Document {
    name: string;
    designationCode: string;
    description?: string;
    level?: number;
    hierarchyOrder?: number;
    employmentTypes?: string[];
    color?: string;
    isDefault?: boolean;
    companyId: Types.ObjectId;
    departmentId?: Types.ObjectId;
    status?: 'ACTIVE' | 'INACTIVE';
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    deletedAt?: Date;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Designation: mongoose.Model<IDesignation, {}, {}, {}, mongoose.Document<unknown, {}, IDesignation, {}, {}> & IDesignation & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Designation;
//# sourceMappingURL=Designation.d.ts.map