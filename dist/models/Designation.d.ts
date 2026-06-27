import mongoose, { Document, Types } from 'mongoose';
export interface IDesignation extends Document {
    name: string;
    level?: number;
    description?: string;
    companyId: Types.ObjectId;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Designation: mongoose.Model<IDesignation, {}, {}, {}, mongoose.Document<unknown, {}, IDesignation, {}, {}> & IDesignation & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Designation;
//# sourceMappingURL=Designation.d.ts.map