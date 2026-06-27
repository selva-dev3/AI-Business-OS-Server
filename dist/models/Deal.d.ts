import mongoose, { Document, Types } from 'mongoose';
export interface IDeal extends Document {
    title: string;
    value?: number;
    currency?: string;
    stage?: string;
    probability?: number;
    expectedCloseDate?: Date;
    actualCloseDate?: Date;
    finalValue?: number;
    status?: string;
    notes?: string;
    tags?: string[];
    position?: number;
    lostReason?: string;
    companyId: Types.ObjectId;
    accountId?: Types.ObjectId;
    leadId?: Types.ObjectId;
    ownerId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Deal: mongoose.Model<IDeal, {}, {}, {}, mongoose.Document<unknown, {}, IDeal, {}, {}> & IDeal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Deal;
//# sourceMappingURL=Deal.d.ts.map