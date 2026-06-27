import mongoose, { Document, Types } from 'mongoose';
export interface IProject extends Document {
    name: string;
    code: string;
    description?: string;
    status?: string;
    priority?: string;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    completionPercent?: number;
    tags?: string[];
    companyId: Types.ObjectId;
    ownerId: Types.ObjectId;
    clientId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Project;
//# sourceMappingURL=Project.d.ts.map