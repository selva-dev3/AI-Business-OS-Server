import mongoose, { Document, Types } from 'mongoose';
export interface ITrainingCertification extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    courseId?: Types.ObjectId;
    name: string;
    issuedBy?: string;
    issueDate: Date;
    expiryDate?: Date;
    certificateUrl?: string;
    credentialId?: string;
    skills?: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const TrainingCertification: mongoose.Model<ITrainingCertification, {}, {}, {}, mongoose.Document<unknown, {}, ITrainingCertification, {}, {}> & ITrainingCertification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default TrainingCertification;
//# sourceMappingURL=TrainingCertification.d.ts.map