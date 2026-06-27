import mongoose, { Document, Types } from 'mongoose';

export interface IContact extends Document {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  department?: string;
  isPrimary?: boolean;
  address?: Record<string, unknown>;
  socialLinks?: Record<string, unknown>;
  tags?: string[];
  notes?: string;
  companyId: Types.ObjectId;
  accountId?: Types.ObjectId;
  ownerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new mongoose.Schema<IContact>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '' },
    mobile: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    department: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zip: { type: String, default: '' },
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    tags: [{ type: String, trim: true }],
    notes: { type: String, default: '' },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

contactSchema.index({ companyId: 1, email: 1 }, { unique: true, sparse: true });
contactSchema.index({ accountId: 1 });

contactSchema.set('toJSON', {
      transform(_doc: any, ret: any) {
    delete ret.__v;
    return ret;
  },
});

const Contact = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;
