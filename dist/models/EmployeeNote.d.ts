import mongoose, { Document, Types } from 'mongoose';
export interface IEmployeeNote extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    content: string;
    category: string;
    isPinned: boolean;
    visibility: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const EmployeeNote: mongoose.Model<IEmployeeNote, {}, {}, {}, mongoose.Document<unknown, {}, IEmployeeNote, {}, {}> & IEmployeeNote & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default EmployeeNote;
//# sourceMappingURL=EmployeeNote.d.ts.map