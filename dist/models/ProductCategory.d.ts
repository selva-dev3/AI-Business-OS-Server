import mongoose, { Document, Types } from 'mongoose';
export interface IProductCategory extends Document {
    name: string;
    code: string;
    description?: string;
    image?: string;
    parentId?: Types.ObjectId;
    companyId: Types.ObjectId;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const ProductCategory: mongoose.Model<IProductCategory, {}, {}, {}, mongoose.Document<unknown, {}, IProductCategory, {}, {}> & IProductCategory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ProductCategory;
//# sourceMappingURL=ProductCategory.d.ts.map