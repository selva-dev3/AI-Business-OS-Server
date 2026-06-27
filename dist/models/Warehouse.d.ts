import mongoose, { Document, Types } from 'mongoose';
interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
}
export interface IWarehouse extends Document {
    name: string;
    code: string;
    address?: IAddress;
    companyId: Types.ObjectId;
    branchId?: Types.ObjectId;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Warehouse: mongoose.Model<IWarehouse, {}, {}, {}, mongoose.Document<unknown, {}, IWarehouse, {}, {}> & IWarehouse & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Warehouse;
//# sourceMappingURL=Warehouse.d.ts.map