import mongoose, { Document, Types } from 'mongoose';
interface IGoalRating {
    goalId: Types.ObjectId;
    rating?: number;
    comments?: string;
}
export interface IPerformanceAppraisal extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    reviewPeriod: string;
    startDate?: Date;
    endDate?: Date;
    rating?: number;
    reviewerId?: Types.ObjectId;
    reviewDate?: Date;
    strengths?: string;
    areasOfImprovement?: string;
    overallComments?: string;
    status?: string;
    goals?: IGoalRating[];
    createdAt: Date;
    updatedAt: Date;
}
declare const PerformanceAppraisal: mongoose.Model<IPerformanceAppraisal, {}, {}, {}, mongoose.Document<unknown, {}, IPerformanceAppraisal, {}, {}> & IPerformanceAppraisal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default PerformanceAppraisal;
//# sourceMappingURL=PerformanceAppraisal.d.ts.map