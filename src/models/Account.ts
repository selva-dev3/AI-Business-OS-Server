import mongoose, { Document, Types } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  revenue?: number;
  phone?: string;
  email?: string;
  address?: Record<string, unknown>;
  tags?: string[];
  companyId: Types.ObjectId;
  ownerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new mongoose.Schema<IAccount>(
  {
    name: { type: String, required: true },
    website: { type: String, default: '' },
    industry: { type: String, default: '' },
    size: { type: String, default: '' },
    revenue: { type: Number, default: 0 },
    phone: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zip: { type: String, default: '' },
    },
    tags: [{ type: String, trim: true }],
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

accountSchema.index({ companyId: 1, name: 1 }, { unique: true });
accountSchema.index({ companyId: 1, industry: 1 });

accountSchema.set('toJSON', {
      transform(_doc: any, ret: any) {
    delete ret.__v;
    return ret;
  },
});

const Account = mongoose.model<IAccount>('Account', accountSchema);
export default Account;
