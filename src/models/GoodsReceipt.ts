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

const grItemSchema = new mongoose.Schema({
  poItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'PO item reference is required'],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Received quantity is required'],
    min: 1,
  },
}, { _id: false });

const goodsReceiptSchema = new mongoose.Schema<IGoodsReceipt>({
  poId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
    required: [true, 'Purchase order reference is required'],
  },
  purchaseOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
    required: [true, 'Purchase order reference is required'],
  },
  grNumber: {
    type: String,
    required: [true, 'GR number is required'],
    unique: true,
    trim: true,
    maxlength: 50,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required'],
  },
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required'],
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
  notes: { type: String, trim: true },
  items: [grItemSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: {
    transform(_doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

const GoodsReceipt = mongoose.model<IGoodsReceipt>('GoodsReceipt', goodsReceiptSchema);
export default GoodsReceipt;
