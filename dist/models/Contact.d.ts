import mongoose, { Document, Types } from 'mongoose';
export interface IContact extends Document {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    jobTitle?: string;
    department?: string;
    isPrimary?: boolean;
    address?: Record<string, unknown>;
    socialLinks?: Record<string, unknown>;
    tags?: string[];
    notes?: string;
    companyId: Types.ObjectId;
    accountId?: Types.ObjectId;
    ownerId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Contact: mongoose.Model<IContact, {}, {}, {}, mongoose.Document<unknown, {}, IContact, {}, {}> & IContact & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Contact;
//# sourceMappingURL=Contact.d.ts.map