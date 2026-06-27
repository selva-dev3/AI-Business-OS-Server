import mongoose, { Document, Types } from 'mongoose';
export interface ITransferRequest extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    fromDepartmentId?: Types.ObjectId;
    toDepartmentId?: Types.ObjectId;
    fromDesignationId?: Types.ObjectId;
    toDesignationId?: Types.ObjectId;
    fromBranchId?: Types.ObjectId;
    toBranchId?: Types.ObjectId;
    reason: string;
    effectiveDate?: Date;
    status?: string;
    requestedBy?: Types.ObjectId;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const TransferRequest: mongoose.Model<ITransferRequest, {}, {}, {}, mongoose.Document<unknown, {}, ITransferRequest, {}, {}> & ITransferRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default TransferRequest;
//# sourceMappingURL=TransferRequest.d.ts.map