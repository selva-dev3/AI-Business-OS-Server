import mongoose, { Document, Types } from 'mongoose';

export interface IDealContact extends Document {
  dealId: Types.ObjectId;
  contactId: Types.ObjectId;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

const dealContactSchema = new mongoose.Schema<IDealContact>(
  {
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    role: { type: String, default: '' },
  },
  { timestamps: true }
);

dealContactSchema.index({ dealId: 1, contactId: 1 }, { unique: true });

dealContactSchema.set('toJSON', {
      transform(_doc: any, ret: any) {
    delete ret.__v;
    return ret;
  },
});

const DealContact = mongoose.model<IDealContact>('DealContact', dealContactSchema);
export default DealContact;
