import mongoose, { Document } from 'mongoose';
export interface IPermission extends Document {
    module: string;
    action: string;
    scope: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Permission: mongoose.Model<IPermission, {}, {}, {}, mongoose.Document<unknown, {}, IPermission, {}, {}> & IPermission & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Permission;
//# sourceMappingURL=Permission.d.ts.map