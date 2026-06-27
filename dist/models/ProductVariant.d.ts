import mongoose, { Document, Types } from 'mongoose';
export interface IProductVariant extends Document {
    productId: Types.ObjectId;
    sku: string;
    name: string;
    attributes?: unknown;
    sellingPrice?: number;
    costPrice?: number;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const ProductVariant: mongoose.Model<IProductVariant, {}, {}, {}, mongoose.Document<unknown, {}, IProductVariant, {}, {}> & IProductVariant & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ProductVariant;
//# sourceMappingURL=ProductVariant.d.ts.map