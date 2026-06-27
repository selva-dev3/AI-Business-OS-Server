import mongoose, { Document, Types } from 'mongoose';
export interface ITrainingEnrollment extends Document {
    courseId: Types.ObjectId;
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    enrolledAt?: Date;
    completionDate?: Date;
    status?: string;
    score?: number;
    feedback?: string;
    completedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const TrainingEnrollment: mongoose.Model<ITrainingEnrollment, {}, {}, {}, mongoose.Document<unknown, {}, ITrainingEnrollment, {}, {}> & ITrainingEnrollment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default TrainingEnrollment;
//# sourceMappingURL=TrainingEnrollment.d.ts.map