import mongoose, { Document, Types } from 'mongoose';
export interface IPromotion extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    fromDesignationId?: Types.ObjectId;
    toDesignationId: Types.ObjectId;
    fromDepartmentId?: Types.ObjectId;
    toDepartmentId?: Types.ObjectId;
    fromSalary?: number;
    toSalary?: number;
    effectiveDate: Date;
    reason?: string;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    status?: string;
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Promotion: mongoose.Model<IPromotion, {}, {}, {}, mongoose.Document<unknown, {}, IPromotion, {}, {}> & IPromotion & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Promotion;
//# sourceMappingURL=Promotion.d.ts.map