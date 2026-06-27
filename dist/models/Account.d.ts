import mongoose, { Document, Types } from 'mongoose';
export interface IAccount extends Document {
    name: string;
    website?: string;
    industry?: string;
    size?: string;
    revenue?: number;
    phone?: string;
    email?: string;
    address?: Record<string, unknown>;
    tags?: string[];
    companyId: Types.ObjectId;
    ownerId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Account: mongoose.Model<IAccount, {}, {}, {}, mongoose.Document<unknown, {}, IAccount, {}, {}> & IAccount & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Account;
//# sourceMappingURL=Account.d.ts.map