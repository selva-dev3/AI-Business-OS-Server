import mongoose, { Document, Types } from 'mongoose';
export interface IInvoice extends Document {
    invoiceNumber: string;
    type: string;
    status: string;
    issueDate: Date;
    dueDate: Date;
    currency?: string;
    subtotal: number;
    taxAmount?: number;
    discount?: number;
    totalAmount: number;
    paidAmount?: number;
    balanceDue?: number;
    notes?: string;
    termsAndConditions?: string;
    companyId: Types.ObjectId;
    accountId: Types.ObjectId;
    sentAt?: Date;
    cancelledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Invoice: mongoose.Model<IInvoice, {}, {}, {}, mongoose.Document<unknown, {}, IInvoice, {}, {}> & IInvoice & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Invoice;
//# sourceMappingURL=Invoice.d.ts.map