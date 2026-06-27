import mongoose, { Document } from 'mongoose';

export interface IPermission extends Document {
  module: string;
  action: string;
  scope: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new mongoose.Schema<IPermission>(
  {
    module: {
      type: String,
      required: [true, 'Module name is required'],
      trim: true,
      maxlength: [100, 'Module name cannot exceed 100 characters'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      maxlength: [100, 'Action cannot exceed 100 characters'],
    },
    scope: {
      type: String,
      enum: {
        values: ['company', 'own'],
        message: '{VALUE} is not a valid scope',
      },
      required: [true, 'Scope is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

permissionSchema.index({ module: 1, action: 1 }, { unique: true });

const Permission = mongoose.model<IPermission>('Permission', permissionSchema);
export default Permission;
