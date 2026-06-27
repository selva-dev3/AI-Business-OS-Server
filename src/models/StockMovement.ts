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

const stockMovementSchema = new mongoose.Schema<IStockMovement>(
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
    type: {
      type: String,
      enum: {
        values: ['PURCHASE_IN', 'SALE_OUT', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT', 'RETURN'],
        message: 'Type must be one of: PURCHASE_IN, SALE_OUT, TRANSFER_IN, TRANSFER_OUT, ADJUSTMENT, RETURN',
      },
      required: [true, 'Movement type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    quantityBefore: {
      type: Number,
      required: [true, 'Quantity before is required'],
    },
    quantityAfter: {
      type: Number,
      required: [true, 'Quantity after is required'],
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    reference: {
      type: String,
      trim: true,
      maxlength: [200, 'Reference cannot exceed 200 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
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

stockMovementSchema.index({ productId: 1, warehouseId: 1, createdAt: 1 });

const StockMovement = mongoose.model<IStockMovement>('StockMovement', stockMovementSchema);
export default StockMovement;
