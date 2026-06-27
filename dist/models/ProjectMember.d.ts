import mongoose, { Document, Types } from 'mongoose';
export interface IProjectMember extends Document {
    projectId: Types.ObjectId;
    userId: Types.ObjectId;
    role: string;
    joinedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const ProjectMember: mongoose.Model<IProjectMember, {}, {}, {}, mongoose.Document<unknown, {}, IProjectMember, {}, {}> & IProjectMember & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ProjectMember;
//# sourceMappingURL=ProjectMember.d.ts.map