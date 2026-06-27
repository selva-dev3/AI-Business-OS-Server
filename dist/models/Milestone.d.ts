import mongoose, { Document, Types } from 'mongoose';
export interface IMilestone extends Document {
    projectId: Types.ObjectId;
    name: string;
    description?: string;
    dueDate?: Date;
    status?: string;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Milestone: mongoose.Model<IMilestone, {}, {}, {}, mongoose.Document<unknown, {}, IMilestone, {}, {}> & IMilestone & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Milestone;
//# sourceMappingURL=Milestone.d.ts.map