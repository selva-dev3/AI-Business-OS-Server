import mongoose, { Document, Types } from 'mongoose';
export interface IRegularizationRequest extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    reason: string;
    status?: string;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const RegularizationRequest: mongoose.Model<IRegularizationRequest, {}, {}, {}, mongoose.Document<unknown, {}, IRegularizationRequest, {}, {}> & IRegularizationRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default RegularizationRequest;
//# sourceMappingURL=RegularizationRequest.d.ts.map