import mongoose, { Document, Types } from 'mongoose';
export interface ILead extends Document {
    title: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    source?: string;
    status?: string;
    score?: number;
    notes?: string;
    tags?: string[];
    customFields?: unknown;
    convertedAt?: Date;
    companyId: Types.ObjectId;
    ownerId?: Types.ObjectId;
    dealId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Lead: mongoose.Model<ILead, {}, {}, {}, mongoose.Document<unknown, {}, ILead, {}, {}> & ILead & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Lead;
//# sourceMappingURL=Lead.d.ts.map