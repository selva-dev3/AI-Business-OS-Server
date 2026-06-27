import mongoose, { Document } from 'mongoose';
export interface ICompany extends Document {
    name: string;
    slug: string;
    email?: string;
    phone?: string;
    logo?: string;
    website?: string;
    address?: Record<string, unknown>;
    timezone?: string;
    currency?: string;
    language?: string;
    plan?: string;
    isActive?: boolean;
    trialEndsAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Company: mongoose.Model<ICompany, {}, {}, {}, mongoose.Document<unknown, {}, ICompany, {}, {}> & ICompany & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Company;
//# sourceMappingURL=Company.d.ts.map