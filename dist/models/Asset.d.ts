import mongoose, { Document, Types } from 'mongoose';
export interface IAsset extends Omit<Document, 'model'> {
    name: string;
    code: string;
    category?: string;
    brand?: string;
    model?: string;
    serialNumber?: string;
    purchaseDate?: Date;
    purchaseValue?: number;
    status?: string;
    location?: string;
    description?: string;
    companyId: Types.ObjectId;
    currentAssigneeId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Asset: mongoose.Model<IAsset, {}, {}, {}, mongoose.Document<unknown, {}, IAsset, {}, {}> & IAsset & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Asset;
//# sourceMappingURL=Asset.d.ts.map