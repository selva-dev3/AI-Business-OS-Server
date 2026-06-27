import mongoose, { Document, Types } from 'mongoose';
export interface IPerformanceFeedback extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    fromEmployeeId: Types.ObjectId;
    category?: string;
    rating?: number;
    comments: string;
    submittedAt?: Date;
    isAnonymous?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const PerformanceFeedback: mongoose.Model<IPerformanceFeedback, {}, {}, {}, mongoose.Document<unknown, {}, IPerformanceFeedback, {}, {}> & IPerformanceFeedback & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default PerformanceFeedback;
//# sourceMappingURL=PerformanceFeedback.d.ts.map