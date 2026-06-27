import mongoose, { Document, Types } from 'mongoose';

export interface IApiKey extends Document {
  companyId: Types.ObjectId;
  name: string;
  key: string;
  keyPreview: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
  permissions?: string[];
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const apiKeySchema = new mongoose.Schema<IApiKey>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    name: {
      type: String,
      required: [true, 'Key name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    key: {
      type: String,
      required: [true, 'Key is required'],
      unique: true,
    },
    keyPreview: {
      type: String,
      required: [true, 'Key preview is required'],
    },
    lastUsedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    permissions: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        delete ret.__v;
        delete ret.key;
        return ret;
      },
    },
  }
);

const ApiKey = mongoose.model<IApiKey>('ApiKey', apiKeySchema);
export default ApiKey;
