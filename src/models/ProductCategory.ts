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

const productCategorySchema = new mongoose.Schema<IProductCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Category code is required'],
      trim: true,
      uppercase: true,
      maxlength: [50, 'Category code cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      type: String,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
      default: null,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

productCategorySchema.index({ companyId: 1, code: 1 }, { unique: true });

const ProductCategory = mongoose.model<IProductCategory>('ProductCategory', productCategorySchema);
export default ProductCategory;
