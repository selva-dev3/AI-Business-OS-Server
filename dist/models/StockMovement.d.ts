import mongoose, { Document, Types } from 'mongoose';
export interface IStockMovement extends Document {
    productId: Types.ObjectId;
    warehouseId: Types.ObjectId;
    companyId: Types.ObjectId;
    type: string;
    quantity: number;
    quantityBefore: number;
    quantityAfter: number;
    reason?: string;
    reference?: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const StockMovement: mongoose.Model<IStockMovement, {}, {}, {}, mongoose.Document<unknown, {}, IStockMovement, {}, {}> & IStockMovement & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default StockMovement;
//# sourceMappingURL=StockMovement.d.ts.map