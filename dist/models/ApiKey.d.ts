import mongoose, { Document, Types } from 'mongoose';
export interface IApiKey extends Document {
    companyId: Types.ObjectId;
    name: string;
    key: string;
    keyPreview: string;
    lastUsedAt?: Date;
    expiresAt?: Date;
    permissions?: string[];
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const ApiKey: mongoose.Model<IApiKey, {}, {}, {}, mongoose.Document<unknown, {}, IApiKey, {}, {}> & IApiKey & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ApiKey;
//# sourceMappingURL=ApiKey.d.ts.map