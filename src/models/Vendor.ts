import mongoose, { Document, Types } from 'mongoose';

interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface IVendor extends Document {
  name: string;
  code: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: IAddress;
  taxNumber?: string;
  paymentTerms?: number;
  currency?: string;
  rating?: number;
  tags?: string[];
  notes?: string;
  companyId: Types.ObjectId;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zip: { type: String },
}, { _id: false });

const vendorSchema = new mongoose.Schema<IVendor>({
  name: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true,
    maxlength: 200,
  },
  code: {
    type: String,
    required: [true, 'Vendor code is required'],
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  website: {
    type: String,
    trim: true,
  },
  address: { type: addressSchema },
  taxNumber: {
    type: String,
    trim: true,
  },
  paymentTerms: {
    type: Number,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
    trim: true,
    uppercase: true,
    maxlength: 3,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  tags: [{ type: String, trim: true }],
  notes: { type: String, trim: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
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

vendorSchema.index({ companyId: 1, code: 1 }, { unique: true });
vendorSchema.index({ companyId: 1, isActive: 1 });

const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema);
export default Vendor;
