import mongoose, { Document, Types } from 'mongoose';
export interface IProduct extends Document {
    name: string;
    description?: string;
    sku: string;
    barcode?: string;
    unit: string;
    type: string;
    costPrice?: number;
    sellingPrice?: number;
    taxRate?: number;
    minStockLevel?: number;
    maxStockLevel?: number;
    reorderPoint?: number;
    reorderQty?: number;
    tags?: string[];
    images?: string[];
    isActive?: boolean;
    companyId: Types.ObjectId;
    categoryId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Product;
//# sourceMappingURL=Product.d.ts.map