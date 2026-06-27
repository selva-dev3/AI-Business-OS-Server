import mongoose, { Document, Types } from 'mongoose';

interface IQuoteItem {
  rfqItemId?: Types.ObjectId;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  leadTime?: number;
}

export interface IQuote extends Document {
  rfqId: Types.ObjectId;
  vendorId: Types.ObjectId;
  companyId: Types.ObjectId;
  status?: string;
  totalAmount: number;
  validUntil?: Date;
  terms?: string;
  items?: IQuoteItem[];
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const quoteItemSchema = new mongoose.Schema({
  rfqItemId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: 0,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 1,
  },
  totalAmount: {
    type: Number,
    required: [true, 'Item total amount is required'],
    min: 0,
  },
  leadTime: {
    type: Number,
    min: 0,
  },
}, { _id: false });

const quoteSchema = new mongoose.Schema<IQuote>({
  rfqId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RFQ',
    required: [true, 'RFQ reference is required'],
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: [true, 'Vendor reference is required'],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED'],
      message: 'Invalid quote status: {VALUE}',
    },
    default: 'DRAFT',
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: 0,
  },
  validUntil: {
    type: Date,
  },
  terms: {
    type: String,
    trim: true,
  },
  items: [quoteItemSchema],
  submittedAt: {
    type: Date,
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

quoteSchema.index({ rfqId: 1, vendorId: 1 }, { unique: true });

const Quote = mongoose.model<IQuote>('Quote', quoteSchema);
export default Quote;
