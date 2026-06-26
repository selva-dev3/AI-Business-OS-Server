const mongoose = require('mongoose');

const deliveryAddressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zip: { type: String },
}, { _id: false });

const poItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Item quantity is required'],
    min: 1,
  },
  receivedQty: {
    type: Number,
    default: 0,
    min: 0,
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: 0,
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: [true, 'Item total amount is required'],
    min: 0,
  },
}, { _id: false });

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: [true, 'PO number is required'],
    unique: true,
    trim: true,
    maxlength: 50,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: [true, 'Vendor is required'],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required'],
  },
  status: {
    type: String,
    enum: {
      values: [
        'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED',
        'SENT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED',
      ],
      message: 'Invalid PO status: {VALUE}',
    },
    default: 'DRAFT',
  },
  orderDate: { type: Date },
  expectedDate: { type: Date },
  deliveryAddress: { type: deliveryAddressSchema },
  items: [poItemSchema],
  subtotal: {
    type: Number,
    min: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalAmount: {
    type: Number,
    min: 0,
  },
  notes: { type: String, trim: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String, trim: true },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

purchaseOrderSchema.index({ companyId: 1, status: 1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
