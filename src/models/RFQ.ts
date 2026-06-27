import mongoose, { Document, Types } from 'mongoose';

interface IRfqItem {
  description: string;
  productId?: Types.ObjectId;
  quantity: number;
  unit: string;
}

export interface IRFQ extends Document {
  rfqNumber: string;
  title: string;
  description?: string;
  deadline: Date;
  status?: string;
  companyId: Types.ObjectId;
  items?: IRfqItem[];
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const rfqItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: [true, 'Item quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  unit: {
    type: String,
    required: [true, 'Item unit is required'],
    trim: true,
  },
}, { _id: false });

const rfqSchema = new mongoose.Schema<IRFQ>({
  rfqNumber: {
    type: String,
    required: [true, 'RFQ number is required'],
    unique: true,
    trim: true,
    maxlength: 50,
  },
  title: {
    type: String,
    required: [true, 'RFQ title is required'],
    trim: true,
    maxlength: 300,
  },
  description: {
    type: String,
    trim: true,
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['DRAFT', 'SENT', 'QUOTES_RECEIVED', 'CLOSED', 'CANCELLED'],
      message: 'Invalid RFQ status: {VALUE}',
    },
    default: 'DRAFT',
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required'],
  },
  items: [rfqItemSchema],
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

rfqSchema.index({ companyId: 1, status: 1 });

const RFQ = mongoose.model<IRFQ>('RFQ', rfqSchema);
export default RFQ;
