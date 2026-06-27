import mongoose, { Document, Types } from 'mongoose';
export interface IBranch extends Document {
    name: string;
    code: string;
    address?: Record<string, unknown>;
    phone?: string;
    isHQ?: boolean;
    isActive?: boolean;
    companyId: Types.ObjectId;
    employeeCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Branch: mongoose.Model<IBranch, {}, {}, {}, mongoose.Document<unknown, {}, IBranch, {}, {}> & IBranch & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Branch;
//# sourceMappingURL=Branch.d.ts.map