import mongoose, { Document, Types } from 'mongoose';
export interface IHoliday extends Document {
    name: string;
    date: Date;
    type?: string;
    isOptional?: boolean;
    companyId: Types.ObjectId;
    branchId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Holiday: mongoose.Model<IHoliday, {}, {}, {}, mongoose.Document<unknown, {}, IHoliday, {}, {}> & IHoliday & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Holiday;
//# sourceMappingURL=Holiday.d.ts.map