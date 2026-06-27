import mongoose, { Document, Types } from 'mongoose';

export interface IExitResignation extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  resignationDate: Date;
  lastWorkingDay: Date;
  reason: string;
  remarks?: string;
  status?: string;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const exitResignationSchema = new mongoose.Schema<IExitResignation>(
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
    resignationDate: {
      type: Date,
      required: [true, 'Resignation date is required'],
    },
    lastWorkingDay: {
      type: Date,
      required: [true, 'Last working day is required'],
    },
    reason: {
      type: String,
      trim: true,
      required: [true, 'Reason is required'],
      maxlength: [2000, 'Reason cannot exceed 2000 characters'],
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [2000, 'Remarks cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
        message: '{VALUE} is not a valid resignation status',
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
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [2000, 'Rejection reason cannot exceed 2000 characters'],
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

exitResignationSchema.index({ employeeId: 1, companyId: 1 });
exitResignationSchema.index({ companyId: 1, status: 1 });

const ExitResignation = mongoose.model<IExitResignation>('ExitResignation', exitResignationSchema);
export default ExitResignation;
