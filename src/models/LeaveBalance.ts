import mongoose, { Document, Types } from 'mongoose';

export interface ILeaveBalance extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  leaveTypeId: Types.ObjectId;
  year: number;
  allocated: number;
  taken?: number;
  pending?: number;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const leaveBalanceSchema = new mongoose.Schema<ILeaveBalance>(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    leaveTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
      required: [true, 'Leave type ID is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be at least 1900'],
      max: [2100, 'Year cannot exceed 2100'],
    },
    allocated: {
      type: Number,
      required: [true, 'Allocated days is required'],
      min: [0, 'Allocated days cannot be negative'],
    },
    taken: {
      type: Number,
      default: 0,
      min: [0, 'Taken days cannot be negative'],
    },
    pending: {
      type: Number,
      default: 0,
      min: [0, 'Pending days cannot be negative'],
    },
    balance: {
      type: Number,
      required: [true, 'Balance is required'],
      min: [0, 'Balance cannot be negative'],
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

leaveBalanceSchema.index({ employeeId: 1, leaveTypeId: 1, year: 1 }, { unique: true });

const LeaveBalance = mongoose.model<ILeaveBalance>('LeaveBalance', leaveBalanceSchema);
export default LeaveBalance;
