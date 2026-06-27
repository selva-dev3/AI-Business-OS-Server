import mongoose, { Document, Types } from 'mongoose';
export interface IStock extends Document {
    productId: Types.ObjectId;
    warehouseId: Types.ObjectId;
    companyId: Types.ObjectId;
    quantity?: number;
    reservedQty?: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Stock: mongoose.Model<IStock, {}, {}, {}, mongoose.Document<unknown, {}, IStock, {}, {}> & IStock & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Stock;
//# sourceMappingURL=Stock.d.ts.map