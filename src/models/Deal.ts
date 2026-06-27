import mongoose, { Document, Types } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  value?: number;
  currency?: string;
  stage?: string;
  probability?: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  finalValue?: number;
  status?: string;
  notes?: string;
  tags?: string[];
  position?: number;
  lostReason?: string;
  companyId: Types.ObjectId;
  accountId?: Types.ObjectId;
  leadId?: Types.ObjectId;
  ownerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const dealSchema = new mongoose.Schema<IDeal>(
  {
    title: { type: String, required: true },
    value: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'INR' },
    stage: {
      type: String,
      enum: ['QUALIFICATION', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'],
      default: 'QUALIFICATION',
    },
    probability: { type: Number, default: 0, min: 0, max: 100 },
    expectedCloseDate: { type: Date },
    actualCloseDate: { type: Date },
    finalValue: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['OPEN', 'WON', 'LOST'],
      default: 'OPEN',
    },
    notes: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    position: { type: Number, default: 0 },
    lostReason: { type: String, default: '' },
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
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
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

dealSchema.index({ companyId: 1, stage: 1, status: 1 });
dealSchema.index({ accountId: 1 });
dealSchema.index({ ownerId: 1 });

dealSchema.set('toJSON', {
      transform(_doc: any, ret: any) {
    delete ret.__v;
    return ret;
  },
});

const Deal = mongoose.model<IDeal>('Deal', dealSchema);
export default Deal;
