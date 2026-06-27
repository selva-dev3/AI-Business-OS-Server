import mongoose, { Document, Types } from 'mongoose';
export interface ITask extends Document {
    projectId: Types.ObjectId;
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    position?: number;
    dueDate?: Date;
    estimatedHours?: number;
    loggedHours?: number;
    tags?: string[];
    attachments?: string[];
    assigneeId?: Types.ObjectId;
    reporterId: Types.ObjectId;
    milestoneId?: Types.ObjectId;
    parentTaskId?: Types.ObjectId;
    companyId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Task;
//# sourceMappingURL=Task.d.ts.map