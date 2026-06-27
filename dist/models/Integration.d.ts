import mongoose, { Document, Types } from 'mongoose';
export interface IIntegration extends Document {
    companyId: Types.ObjectId;
    type: string;
    name: string;
    description?: string;
    isConnected?: boolean;
    connectedAt?: Date;
    config?: unknown;
    createdAt: Date;
    updatedAt: Date;
}
declare const Integration: mongoose.Model<IIntegration, {}, {}, {}, mongoose.Document<unknown, {}, IIntegration, {}, {}> & IIntegration & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Integration;
//# sourceMappingURL=Integration.d.ts.map