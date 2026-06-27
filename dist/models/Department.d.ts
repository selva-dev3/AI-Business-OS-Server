import mongoose, { Document, Types } from 'mongoose';
export interface IDepartment extends Document {
    name: string;
    code: string;
    description?: string;
    companyId: Types.ObjectId;
    parentId?: Types.ObjectId;
    headId?: Types.ObjectId;
    branchId?: Types.ObjectId;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Department: mongoose.Model<IDepartment, {}, {}, {}, mongoose.Document<unknown, {}, IDepartment, {}, {}> & IDepartment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Department;
//# sourceMappingURL=Department.d.ts.map