import mongoose, { Document, Types } from 'mongoose';

export interface IBudget extends Document {
  name: string;
  year: number;
  month?: number;
  department: string;
  category: string;
  amount: number;
  spent?: number;
  companyId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new mongoose.Schema<IBudget>(
  {
    name: {
      type: String,
      required: [true, 'Budget name is required'],
      trim: true,
      maxlength: [500, 'Name cannot exceed 500 characters'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be at least 1900'],
      max: [2100, 'Year cannot exceed 2100'],
    },
    month: {
      type: Number,
      default: null,
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [200, 'Department cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [200, 'Category cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget amount cannot be negative'],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
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

budgetSchema.index({ companyId: 1, year: 1, department: 1 });

const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
export default Budget;
