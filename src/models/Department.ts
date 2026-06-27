import mongoose, { Document, Types } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  code: string;
  description?: string;
  companyId: Types.ObjectId;
  parentId?: Types.ObjectId;
  headId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new mongoose.Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      trim: true,
      maxlength: [50, 'Code cannot exceed 50 characters'],
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
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    headId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
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

departmentSchema.index({ companyId: 1, code: 1 }, { unique: true });

const Department = mongoose.model<IDepartment>('Department', departmentSchema);
export default Department;
