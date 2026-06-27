import mongoose, { Document, Types } from 'mongoose';

export interface IActivity extends Document {
  type: string;
  subject?: string;
  description?: string;
  outcome?: string;
  scheduledAt?: Date;
  completedAt?: Date;
  dueAt?: Date;
  isCompleted?: boolean;
  companyId: Types.ObjectId;
  leadId?: Types.ObjectId;
  dealId?: Types.ObjectId;
  contactId?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  assignedToId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new mongoose.Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ['CALL', 'MEETING', 'EMAIL', 'TASK', 'NOTE'],
      required: true,
    },
    subject: { type: String, default: '' },
    description: { type: String, default: '' },
    outcome: { type: String, default: '' },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    dueAt: { type: Date },
    isCompleted: { type: Boolean, default: false },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      default: null,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

activitySchema.index({ companyId: 1, type: 1 });
activitySchema.index({ leadId: 1 });
activitySchema.index({ dealId: 1 });

activitySchema.set('toJSON', {
      transform(_doc: any, ret: any) {
    delete ret.__v;
    return ret;
  },
});

const Activity = mongoose.model<IActivity>('Activity', activitySchema);
export default Activity;
