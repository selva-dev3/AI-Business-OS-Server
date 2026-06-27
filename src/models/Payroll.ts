import mongoose, { Document, Types } from 'mongoose';

export interface IPayroll extends Document {
  companyId: Types.ObjectId;
  month: number;
  year: number;
  status?: string;
  totalAmount?: number;
  totalEmployees?: number;
  processedBy?: Types.ObjectId;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const payrollSchema = new mongoose.Schema<IPayroll>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be at least 1900'],
      max: [2100, 'Year cannot exceed 2100'],
    },
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'PROCESSING', 'PROCESSED', 'FAILED'],
        message: '{VALUE} is not a valid payroll status',
      },
      default: 'DRAFT',
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Total amount cannot be negative'],
    },
    totalEmployees: {
      type: Number,
      default: 0,
      min: [0, 'Total employees cannot be negative'],
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
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

payrollSchema.index({ companyId: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model<IPayroll>('Payroll', payrollSchema);
export default Payroll;
