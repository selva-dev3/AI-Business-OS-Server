import mongoose, { Document, Types } from 'mongoose';
export interface IInvoiceItem extends Document {
    invoiceId: Types.ObjectId;
    productId?: Types.ObjectId;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    discount?: number;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const InvoiceItem: mongoose.Model<IInvoiceItem, {}, {}, {}, mongoose.Document<unknown, {}, IInvoiceItem, {}, {}> & IInvoiceItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default InvoiceItem;
//# sourceMappingURL=InvoiceItem.d.ts.map