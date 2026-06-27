import mongoose, { Document, Types } from 'mongoose';
export interface ITrainingCourse extends Document {
    companyId: Types.ObjectId;
    title: string;
    description?: string;
    provider?: string;
    duration?: string;
    mode?: string;
    category?: string;
    skills?: string[];
    isMandatory?: boolean;
    maxParticipants?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const TrainingCourse: mongoose.Model<ITrainingCourse, {}, {}, {}, mongoose.Document<unknown, {}, ITrainingCourse, {}, {}> & ITrainingCourse & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default TrainingCourse;
//# sourceMappingURL=TrainingCourse.d.ts.map