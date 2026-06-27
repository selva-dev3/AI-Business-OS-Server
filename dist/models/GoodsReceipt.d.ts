import mongoose, { Document, Types } from 'mongoose';
interface IGrItem {
    poItemId: Types.ObjectId;
    productId: Types.ObjectId;
    quantity: number;
}
export interface IGoodsReceipt extends Document {
    poId: Types.ObjectId;
    purchaseOrderId: Types.ObjectId;
    grNumber: string;
    companyId: Types.ObjectId;
    warehouseId: Types.ObjectId;
    receivedAt?: Date;
    notes?: string;
    items?: IGrItem[];
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const GoodsReceipt: mongoose.Model<IGoodsReceipt, {}, {}, {}, mongoose.Document<unknown, {}, IGoodsReceipt, {}, {}> & IGoodsReceipt & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default GoodsReceipt;
//# sourceMappingURL=GoodsReceipt.d.ts.map