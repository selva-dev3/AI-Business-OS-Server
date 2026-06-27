import mongoose, { Document, Types } from 'mongoose';
interface IQuoteItem {
    rfqItemId?: Types.ObjectId;
    unitPrice: number;
    quantity: number;
    totalAmount: number;
    leadTime?: number;
}
export interface IQuote extends Document {
    rfqId: Types.ObjectId;
    vendorId: Types.ObjectId;
    companyId: Types.ObjectId;
    status?: string;
    totalAmount: number;
    validUntil?: Date;
    terms?: string;
    items?: IQuoteItem[];
    submittedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Quote: mongoose.Model<IQuote, {}, {}, {}, mongoose.Document<unknown, {}, IQuote, {}, {}> & IQuote & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Quote;
//# sourceMappingURL=Quote.d.ts.map