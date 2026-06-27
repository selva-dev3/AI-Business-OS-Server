import mongoose, { Document, Types } from 'mongoose';
export interface IAssetAssignment extends Document {
    assetId: Types.ObjectId;
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    assignedAt: Date;
    returnedAt?: Date;
    condition?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const AssetAssignment: mongoose.Model<IAssetAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IAssetAssignment, {}, {}> & IAssetAssignment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default AssetAssignment;
//# sourceMappingURL=AssetAssignment.d.ts.map