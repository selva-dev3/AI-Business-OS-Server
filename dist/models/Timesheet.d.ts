import mongoose, { Document, Types } from 'mongoose';
export interface ITimesheet extends Document {
    projectId: Types.ObjectId;
    taskId?: Types.ObjectId;
    userId: Types.ObjectId;
    companyId: Types.ObjectId;
    date: Date;
    hours: number;
    description?: string;
    isBillable?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Timesheet: mongoose.Model<ITimesheet, {}, {}, {}, mongoose.Document<unknown, {}, ITimesheet, {}, {}> & ITimesheet & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Timesheet;
//# sourceMappingURL=Timesheet.d.ts.map