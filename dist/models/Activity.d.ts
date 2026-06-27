import mongoose, { Document, Types } from 'mongoose';
export interface IActivity extends Document {
    type: string;
    subject?: string;
    description?: string;
    outcome?: string;
    scheduledAt?: Date;
    completedAt?: Date;
    dueAt?: Date;
    isCompleted?: boolean;
    companyId: Types.ObjectId;
    leadId?: Types.ObjectId;
    dealId?: Types.ObjectId;
    contactId?: Types.ObjectId;
    createdBy?: Types.ObjectId;
    assignedToId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Activity: mongoose.Model<IActivity, {}, {}, {}, mongoose.Document<unknown, {}, IActivity, {}, {}> & IActivity & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Activity;
//# sourceMappingURL=Activity.d.ts.map