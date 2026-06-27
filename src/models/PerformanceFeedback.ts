import mongoose, { Document, Types } from 'mongoose';

export interface IPerformanceFeedback extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  fromEmployeeId: Types.ObjectId;
  category?: string;
  rating?: number;
  comments: string;
  submittedAt?: Date;
  isAnonymous?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const performanceFeedbackSchema = new mongoose.Schema<IPerformanceFeedback>(
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
    fromEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'From employee ID is required'],
    },
    category: {
      type: String,
      enum: {
        values: ['PEER', 'MANAGER', 'SUBORDINATE', 'SELF'],
        message: '{VALUE} is not a valid feedback category',
      },
      default: 'PEER',
    },
    rating: {
      type: Number,
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comments: {
      type: String,
      trim: true,
      required: [true, 'Comments are required'],
      maxlength: [2000, 'Comments cannot exceed 2000 characters'],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
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

performanceFeedbackSchema.index({ employeeId: 1, companyId: 1 });
performanceFeedbackSchema.index({ fromEmployeeId: 1 });

const PerformanceFeedback = mongoose.model<IPerformanceFeedback>('PerformanceFeedback', performanceFeedbackSchema);
export default PerformanceFeedback;
