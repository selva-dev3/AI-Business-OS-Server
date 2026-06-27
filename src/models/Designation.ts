import mongoose, { Document, Types } from 'mongoose';

export interface IDesignation extends Document {
  name: string;
  designationCode: string;
  description?: string;
  level?: number;
  hierarchyOrder?: number;
  employmentTypes?: string[];
  color?: string;
  isDefault?: boolean;
  companyId: Types.ObjectId;
  departmentId?: Types.ObjectId;
  status?: 'ACTIVE' | 'INACTIVE';
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedAt?: Date;
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
    designationCode: {
      type: String,
      trim: true,
      maxlength: [50, 'Code cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    level: {
      type: Number,
      min: [0, 'Level must be at least 0'],
    },
    hierarchyOrder: {
      type: Number,
      min: [0, 'Hierarchy order must be at least 0'],
    },
    employmentTypes: {
      type: [String],
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'FREELANCE'],
    },
    color: {
      type: String,
      trim: true,
      maxlength: [7, 'Color must be a hex code'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: unknown, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

designationSchema.index({ companyId: 1, name: 1 }, { unique: true });
designationSchema.index({ companyId: 1, departmentId: 1 });
designationSchema.index({ companyId: 1, status: 1 });
designationSchema.index({ companyId: 1, isActive: 1, deletedAt: 1 });

const Designation = mongoose.model<IDesignation>('Designation', designationSchema);
export default Designation;
