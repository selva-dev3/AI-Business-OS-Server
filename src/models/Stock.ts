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

const stockSchema = new mongoose.Schema<IStock>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Warehouse ID is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
      index: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
    reservedQty: {
      type: Number,
      default: 0,
      min: [0, 'Reserved quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Reserved quantity must be an integer',
      },
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

stockSchema.index({ productId: 1, warehouseId: 1 }, { unique: true });
stockSchema.index({ warehouseId: 1 });

const Stock = mongoose.model<IStock>('Stock', stockSchema);
export default Stock;
