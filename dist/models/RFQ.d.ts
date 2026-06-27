import mongoose, { Document, Types } from 'mongoose';
interface IRfqItem {
    description: string;
    productId?: Types.ObjectId;
    quantity: number;
    unit: string;
}
export interface IRFQ extends Document {
    rfqNumber: string;
    title: string;
    description?: string;
    deadline: Date;
    status?: string;
    companyId: Types.ObjectId;
    items?: IRfqItem[];
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const RFQ: mongoose.Model<IRFQ, {}, {}, {}, mongoose.Document<unknown, {}, IRFQ, {}, {}> & IRFQ & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default RFQ;
//# sourceMappingURL=RFQ.d.ts.map