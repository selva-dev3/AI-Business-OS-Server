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

const transferItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
  },
  { _id: false }
);

const stockTransferSchema = new mongoose.Schema<IStockTransfer>(
  {
    fromWarehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Source warehouse ID is required'],
    },
    toWarehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Destination warehouse ID is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED'],
        message: 'Status must be one of: DRAFT, APPROVED, IN_TRANSIT, RECEIVED, CANCELLED',
      },
      default: 'DRAFT',
    },
    items: {
      type: [transferItemSchema],
      default: [],
      validate: {
        validator(v) {
          return v.length > 0;
        },
        message: 'At least one item is required',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requested by is required'],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
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

stockTransferSchema.index({ companyId: 1, status: 1 });

const StockTransfer = mongoose.model<IStockTransfer>('StockTransfer', stockTransferSchema);
export default StockTransfer;
