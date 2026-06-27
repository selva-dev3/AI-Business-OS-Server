import mongoose, { Document, Types } from 'mongoose';

interface IPermission {
  module: string;
  action: string;
  scope?: string;
}

export interface IRole extends Document {
  name: string;
  description?: string;
  isSystem?: boolean;
  companyId: Types.ObjectId;
  permissions?: IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    scope: {
      type: String,
      enum: ['ALL', 'DEPARTMENT', 'OWN'],
      default: 'OWN',
    },
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
      maxlength: [50, 'Role name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    permissions: {
      type: [permissionSchema],
      default: [],
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

roleSchema.index({ companyId: 1, name: 1 }, { unique: true });

const Role = mongoose.model<IRole>('Role', roleSchema);
export default Role;
