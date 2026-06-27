import mongoose, { Document } from 'mongoose';
export interface IPlan extends Document {
    name: string;
    description?: string;
    price: number;
    currency?: string;
    billingCycle: string;
    features?: Record<string, unknown>;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Plan: mongoose.Model<IPlan, {}, {}, {}, mongoose.Document<unknown, {}, IPlan, {}, {}> & IPlan & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Plan;
//# sourceMappingURL=Plan.d.ts.map