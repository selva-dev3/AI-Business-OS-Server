import mongoose, { Document, Types } from 'mongoose';
export interface IAttendanceSummary extends Document {
    companyId: Types.ObjectId;
    date: Date;
    totalPresent?: number;
    totalAbsent?: number;
    totalLate?: number;
    totalHalfDay?: number;
    totalOnLeave?: number;
    departmentWise?: unknown[];
    createdAt: Date;
    updatedAt: Date;
}
declare const AttendanceSummary: mongoose.Model<IAttendanceSummary, {}, {}, {}, mongoose.Document<unknown, {}, IAttendanceSummary, {}, {}> & IAttendanceSummary & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default AttendanceSummary;
//# sourceMappingURL=AttendanceSummary.d.ts.map