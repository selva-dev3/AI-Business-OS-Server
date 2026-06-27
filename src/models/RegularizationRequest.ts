import mongoose, { Document, Types } from 'mongoose';

export interface IRegularizationRequest extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  reason: string;
  status?: string;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const regularizationRequestSchema = new mongoose.Schema<IRegularizationRequest>(
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
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    reason: {
      type: String,
      trim: true,
      required: [true, 'Reason is required'],
      maxlength: [1000, 'Reason cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        message: '{VALUE} is not a valid regularization status',
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
    comments: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comments cannot exceed 1000 characters'],
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

regularizationRequestSchema.index({ employeeId: 1, date: 1 });
regularizationRequestSchema.index({ companyId: 1, status: 1 });

const RegularizationRequest = mongoose.model<IRegularizationRequest>('RegularizationRequest', regularizationRequestSchema);
export default RegularizationRequest;
