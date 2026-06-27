import mongoose, { Document, Types } from 'mongoose';

export interface IPayment extends Document {
  invoiceId: Types.ObjectId;
  companyId: Types.ObjectId;
  amount: number;
  currency?: string;
  method: string;
  reference?: string;
  notes?: string;
  paidAt: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: [true, 'Invoice ID is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    method: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['BANK_TRANSFER', 'CASH', 'CHEQUE', 'CARD', 'ONLINE', 'OTHER'],
        message: 'Invalid payment method: {VALUE}',
      },
    },
    reference: {
      type: String,
      trim: true,
      maxlength: [500, 'Reference cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    paidAt: {
      type: Date,
      required: [true, 'Payment date is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

paymentSchema.index({ invoiceId: 1 });
paymentSchema.index({ companyId: 1, method: 1, paidAt: 1 });

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
