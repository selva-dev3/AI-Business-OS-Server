import mongoose, { Document, Types } from 'mongoose';

export interface ILead extends Document {
  title: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
  status?: string;
  score?: number;
  notes?: string;
  tags?: string[];
  customFields?: unknown;
  convertedAt?: Date;
  companyId: Types.ObjectId;
  ownerId?: Types.ObjectId;
  dealId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new mongoose.Schema<ILead>(
  {
    title: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    source: {
      type: String,
      enum: ['WEBSITE', 'REFERRAL', 'SOCIAL', 'EMAIL', 'CALL', 'OTHER'],
      default: 'OTHER',
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'DISQUALIFIED'],
      default: 'NEW',
    },
    score: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    customFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    convertedAt: { type: Date },
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
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      default: null,
    },
  },
  { timestamps: true }
);

leadSchema.index({ companyId: 1, status: 1 });
leadSchema.index({ email: 1 }, { unique: true, sparse: true });
leadSchema.index({ ownerId: 1, status: 1 });

leadSchema.set('toJSON', {
      transform(_doc: any, ret: any) {
    delete ret.__v;
    return ret;
  },
});

const Lead = mongoose.model<ILead>('Lead', leadSchema);
export default Lead;
