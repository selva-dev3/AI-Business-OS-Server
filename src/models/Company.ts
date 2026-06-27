import mongoose, { Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  logo?: string;
  website?: string;
  address?: Record<string, unknown>;
  timezone?: string;
  currency?: string;
  language?: string;
  plan?: string;
  isActive?: boolean;
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new mongoose.Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      zip: { type: String, trim: true },
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    language: {
      type: String,
      default: 'en',
      lowercase: true,
    },
    plan: {
      type: String,
      enum: {
        values: ['FREE', 'PROFESSIONAL', 'ENTERPRISE'],
        message: '{VALUE} is not a valid plan',
      },
      default: 'FREE',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    trialEndsAt: {
      type: Date,
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

const Company = mongoose.model<ICompany>('Company', companySchema);
export default Company;
