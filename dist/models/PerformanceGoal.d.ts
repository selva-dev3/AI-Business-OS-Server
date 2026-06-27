import mongoose, { Document, Types } from 'mongoose';
export interface IPerformanceGoal extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    title: string;
    description?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    targetValue?: number;
    currentValue?: number;
    measurementUnit?: string;
    weightage?: number;
    status?: string;
    createdBy?: Types.ObjectId;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const PerformanceGoal: mongoose.Model<IPerformanceGoal, {}, {}, {}, mongoose.Document<unknown, {}, IPerformanceGoal, {}, {}> & IPerformanceGoal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default PerformanceGoal;
//# sourceMappingURL=PerformanceGoal.d.ts.map