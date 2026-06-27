import mongoose, { Document, Types } from 'mongoose';

export interface ILeaveRequest extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  leaveTypeId: Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  days: number;
  reason?: string;
  status?: string;
  comments?: string;
  attachments?: string[];
  approvedBy?: Types.ObjectId;
  rejectedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const leaveRequestSchema = new mongoose.Schema<ILeaveRequest>(
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
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
    },
    days: {
      type: Number,
      required: [true, 'Number of days is required'],
      min: [0.5, 'Minimum leave is 0.5 days'],
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [2000, 'Reason cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
        message: '{VALUE} is not a valid leave status',
      },
      default: 'PENDING',
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [2000, 'Comments cannot exceed 2000 characters'],
    },
    attachments: {
      type: [String],
      default: [],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
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

leaveRequestSchema.index({ employeeId: 1, status: 1 });
leaveRequestSchema.index({ companyId: 1, status: 1, createdAt: 1 });

const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;
