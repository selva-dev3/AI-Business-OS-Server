import mongoose, { Document, Types } from 'mongoose';

export interface IExitSettlement extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  resignationId?: Types.ObjectId;
  noticePeriodDays?: number;
  noticePeriodAmount?: number;
  unpaidLeaves?: number;
  unpaidLeaveDeduction?: number;
  pendingReimbursements?: number;
  bonusAmount?: number;
  otherEarnings?: number;
  otherDeductions?: number;
  totalAmount?: number;
  status?: string;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  paidAt?: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const exitSettlementSchema = new mongoose.Schema<IExitSettlement>(
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
    resignationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExitResignation',
    },
    noticePeriodDays: {
      type: Number,
    },
    noticePeriodAmount: {
      type: Number,
    },
    unpaidLeaves: {
      type: Number,
    },
    unpaidLeaveDeduction: {
      type: Number,
    },
    pendingReimbursements: {
      type: Number,
    },
    bonusAmount: {
      type: Number,
    },
    otherEarnings: {
      type: Number,
      default: 0,
    },
    otherDeductions: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'PAID'],
        message: '{VALUE} is not a valid settlement status',
      },
      default: 'PENDING',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    paidAt: {
      type: Date,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [2000, 'Remarks cannot exceed 2000 characters'],
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

exitSettlementSchema.index({ employeeId: 1, companyId: 1 });

const ExitSettlement = mongoose.model<IExitSettlement>('ExitSettlement', exitSettlementSchema);
export default ExitSettlement;
