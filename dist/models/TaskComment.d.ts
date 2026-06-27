import mongoose, { Document, Types } from 'mongoose';
export interface ITaskComment extends Document {
    taskId: Types.ObjectId;
    projectId: Types.ObjectId;
    content: string;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const TaskComment: mongoose.Model<ITaskComment, {}, {}, {}, mongoose.Document<unknown, {}, ITaskComment, {}, {}> & ITaskComment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default TaskComment;
//# sourceMappingURL=TaskComment.d.ts.map