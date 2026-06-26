const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
      transform(doc, ret) {
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

module.exports = mongoose.model('Payment', paymentSchema);
