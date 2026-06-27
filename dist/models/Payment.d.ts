import mongoose, { Document, Types } from 'mongoose';
export interface IPayment extends Document {
    invoiceId: Types.ObjectId;
    companyId: Types.ObjectId;
    amount: number;
    currency?: string;
    method: string;
    reference?: string;
    notes?: string;
    paidAt: Date;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Payment: mongoose.Model<IPayment, {}, {}, {}, mongoose.Document<unknown, {}, IPayment, {}, {}> & IPayment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Payment;
//# sourceMappingURL=Payment.d.ts.map