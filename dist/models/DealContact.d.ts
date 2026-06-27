import mongoose, { Document, Types } from 'mongoose';
export interface IDealContact extends Document {
    dealId: Types.ObjectId;
    contactId: Types.ObjectId;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const DealContact: mongoose.Model<IDealContact, {}, {}, {}, mongoose.Document<unknown, {}, IDealContact, {}, {}> & IDealContact & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default DealContact;
//# sourceMappingURL=DealContact.d.ts.map