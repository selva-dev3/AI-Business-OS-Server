import mongoose, { Document, Types } from 'mongoose';

export interface ILeaveType extends Document {
  name: string;
  code: string;
  annualAllowance?: number;
  carryForward?: boolean;
  maxCarryForward?: number;
  isPaid?: boolean;
  requiresApproval?: boolean;
  description?: string;
  companyId: Types.ObjectId;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const leaveTypeSchema = new mongoose.Schema<ILeaveType>(
  {
    name: {
      type: String,
      required: [true, 'Leave type name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    code: {
      type: String,
      required: [true, 'Leave type code is required'],
      trim: true,
      maxlength: [50, 'Code cannot exceed 50 characters'],
    },
    annualAllowance: {
      type: Number,
      min: [0, 'Annual allowance cannot be negative'],
      default: 0,
    },
    carryForward: {
      type: Boolean,
      default: false,
    },
    maxCarryForward: {
      type: Number,
      min: [0, 'Max carry forward cannot be negative'],
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    requiresApproval: {
      type: Boolean,
      default: true,
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

leaveTypeSchema.index({ companyId: 1, code: 1 }, { unique: true });

const LeaveType = mongoose.model<ILeaveType>('LeaveType', leaveTypeSchema);
export default LeaveType;
