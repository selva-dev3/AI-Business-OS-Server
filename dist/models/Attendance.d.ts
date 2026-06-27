import mongoose, { Document, Types } from 'mongoose';
export interface IAttendance extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    workingHours?: number;
    status: string;
    source?: string;
    overtime?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Attendance: mongoose.Model<IAttendance, {}, {}, {}, mongoose.Document<unknown, {}, IAttendance, {}, {}> & IAttendance & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Attendance;
//# sourceMappingURL=Attendance.d.ts.map