import mongoose, { Document, Types } from 'mongoose';
interface ITransferItem {
    productId: Types.ObjectId;
    quantity: number;
}
export interface IStockTransfer extends Document {
    fromWarehouseId: Types.ObjectId;
    toWarehouseId: Types.ObjectId;
    companyId: Types.ObjectId;
    status?: string;
    items?: ITransferItem[];
    notes?: string;
    requestedBy: Types.ObjectId;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const StockTransfer: mongoose.Model<IStockTransfer, {}, {}, {}, mongoose.Document<unknown, {}, IStockTransfer, {}, {}> & IStockTransfer & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default StockTransfer;
//# sourceMappingURL=StockTransfer.d.ts.map