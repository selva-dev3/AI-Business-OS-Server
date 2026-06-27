import mongoose, { Document, Types } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  category: string;
  amount: number;
  currency?: string;
  date: Date;
  receipt?: string;
  notes?: string;
  status: string;
  companyId: Types.ObjectId;
  employeeId: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new mongoose.Schema<IExpense>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Travel', 'Accommodation', 'Food', 'Transport', 'Office', 'Software', 'Hardware', 'Other'],
        message: 'Invalid expense category: {VALUE}',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
    },
    receipt: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED', 'REIMBURSED'],
        message: 'Invalid expense status: {VALUE}',
      },
      default: 'PENDING',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

expenseSchema.index({ companyId: 1, status: 1 });
expenseSchema.index({ employeeId: 1 });

const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
export default Expense;
