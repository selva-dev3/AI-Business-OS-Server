import mongoose, { Document, Types } from 'mongoose';
export interface IReportSchedule extends Document {
    companyId: Types.ObjectId;
    reportType: string;
    frequency: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    recipients?: string[];
    format: string;
    modules?: string[];
    nextRunAt?: Date;
    lastRunAt?: Date;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const ReportSchedule: mongoose.Model<IReportSchedule, {}, {}, {}, mongoose.Document<unknown, {}, IReportSchedule, {}, {}> & IReportSchedule & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ReportSchedule;
//# sourceMappingURL=ReportSchedule.d.ts.map