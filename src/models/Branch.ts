import mongoose, { Document, Types } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  code: string;
  address?: Record<string, unknown>;
  phone?: string;
  isHQ?: boolean;
  isActive?: boolean;
  companyId: Types.ObjectId;
  employeeCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const branchSchema = new mongoose.Schema<IBranch>(
  {
    name: {
      type: String,
      required: [true, 'Branch name is required'],
      trim: true,
      maxlength: [100, 'Branch name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Branch code is required'],
      trim: true,
      uppercase: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      zip: { type: String, trim: true },
    },
    phone: {
      type: String,
      trim: true,
    },
    isHQ: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    employeeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

branchSchema.index({ companyId: 1, code: 1 }, { unique: true });

const Branch = mongoose.model<IBranch>('Branch', branchSchema);
export default Branch;
