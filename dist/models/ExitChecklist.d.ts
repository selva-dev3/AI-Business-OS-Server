import mongoose, { Document, Types } from 'mongoose';
interface IChecklistTask {
    task?: string;
    assignedTo?: Types.ObjectId;
    isCompleted?: boolean;
    completedAt?: Date;
    comments?: string;
}
export interface IExitChecklist extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    resignationId?: Types.ObjectId;
    tasks?: IChecklistTask[];
    status?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const ExitChecklist: mongoose.Model<IExitChecklist, {}, {}, {}, mongoose.Document<unknown, {}, IExitChecklist, {}, {}> & IExitChecklist & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ExitChecklist;
//# sourceMappingURL=ExitChecklist.d.ts.map