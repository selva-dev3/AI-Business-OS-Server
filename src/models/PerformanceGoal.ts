import mongoose, { Document, Types } from 'mongoose';

export interface IPerformanceGoal extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  title: string;
  description?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  targetValue?: number;
  currentValue?: number;
  measurementUnit?: string;
  weightage?: number;
  status?: string;
  createdBy?: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const performanceGoalSchema = new mongoose.Schema<IPerformanceGoal>(
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
    title: {
      type: String,
      trim: true,
      required: [true, 'Title is required'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    targetValue: {
      type: Number,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    measurementUnit: {
      type: String,
      trim: true,
      maxlength: [50, 'Measurement unit cannot exceed 50 characters'],
    },
    weightage: {
      type: Number,
      min: [0, 'Weightage cannot be less than 0'],
      max: [100, 'Weightage cannot exceed 100'],
    },
    status: {
      type: String,
      enum: {
        values: ['NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'NOT_ACHIEVED'],
        message: '{VALUE} is not a valid goal status',
      },
      default: 'NOT_STARTED',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
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

performanceGoalSchema.index({ employeeId: 1, companyId: 1 });
performanceGoalSchema.index({ companyId: 1, status: 1 });

const PerformanceGoal = mongoose.model<IPerformanceGoal>('PerformanceGoal', performanceGoalSchema);
export default PerformanceGoal;
