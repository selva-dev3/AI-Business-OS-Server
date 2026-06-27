import mongoose, { Document, Types } from 'mongoose';

export interface IIntegration extends Document {
  companyId: Types.ObjectId;
  type: string;
  name: string;
  description?: string;
  isConnected?: boolean;
  connectedAt?: Date;
  config?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const integrationSchema = new mongoose.Schema<IIntegration>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    type: {
      type: String,
      required: [true, 'Integration type is required'],
      enum: {
        values: ['slack', 'google', 'zapier'],
        message: '{VALUE} is not a valid integration type',
      },
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    connectedAt: {
      type: Date,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
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

integrationSchema.index({ companyId: 1, type: 1 }, { unique: true });

const Integration = mongoose.model<IIntegration>('Integration', integrationSchema);
export default Integration;
