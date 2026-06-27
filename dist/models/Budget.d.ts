import mongoose, { Document, Types } from 'mongoose';
export interface IBudget extends Document {
    name: string;
    year: number;
    month?: number;
    department: string;
    category: string;
    amount: number;
    spent?: number;
    companyId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Budget: mongoose.Model<IBudget, {}, {}, {}, mongoose.Document<unknown, {}, IBudget, {}, {}> & IBudget & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Budget;
//# sourceMappingURL=Budget.d.ts.map