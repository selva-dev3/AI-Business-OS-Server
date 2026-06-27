import mongoose, { Document, Types } from 'mongoose';
interface IPermission {
    module: string;
    action: string;
    scope?: string;
}
export interface IRole extends Document {
    name: string;
    description?: string;
    isSystem?: boolean;
    companyId: Types.ObjectId;
    permissions?: IPermission[];
    createdAt: Date;
    updatedAt: Date;
}
declare const Role: mongoose.Model<IRole, {}, {}, {}, mongoose.Document<unknown, {}, IRole, {}, {}> & IRole & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Role;
//# sourceMappingURL=Role.d.ts.map