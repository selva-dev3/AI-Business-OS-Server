import mongoose, { Document, Types } from 'mongoose';

export interface ITransferRequest extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  fromDepartmentId?: Types.ObjectId;
  toDepartmentId?: Types.ObjectId;
  fromDesignationId?: Types.ObjectId;
  toDesignationId?: Types.ObjectId;
  fromBranchId?: Types.ObjectId;
  toBranchId?: Types.ObjectId;
  reason: string;
  effectiveDate?: Date;
  status?: string;
  requestedBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transferRequestSchema = new mongoose.Schema<ITransferRequest>(
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
    fromDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    toDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    fromDesignationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
    },
    toDesignationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
    },
    fromBranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
    toBranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
    reason: {
      type: String,
      trim: true,
      required: [true, 'Reason is required'],
      maxlength: [2000, 'Reason cannot exceed 2000 characters'],
    },
    effectiveDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
        message: '{VALUE} is not a valid transfer status',
      },
      default: 'PENDING',
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      maxlength: [2000, 'Comments cannot exceed 2000 characters'],
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

transferRequestSchema.index({ employeeId: 1, companyId: 1 });
transferRequestSchema.index({ companyId: 1, status: 1 });

const TransferRequest = mongoose.model<ITransferRequest>('TransferRequest', transferRequestSchema);
export default TransferRequest;
