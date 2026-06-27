import mongoose, { Document, Types } from 'mongoose';

export interface IDesignation extends Document {
  name: string;
  level?: number;
  description?: string;
  companyId: Types.ObjectId;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const designationSchema = new mongoose.Schema<IDesignation>(
  {
    name: {
      type: String,
      required: [true, 'Designation name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    level: {
      type: Number,
      min: [0, 'Level must be at least 0'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
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
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

designationSchema.index({ companyId: 1, name: 1 }, { unique: true });

const Designation = mongoose.model<IDesignation>('Designation', designationSchema);
export default Designation;
