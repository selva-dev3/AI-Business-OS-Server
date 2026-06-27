import mongoose, { Document, Types } from 'mongoose';

export interface IPromotion extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  fromDesignationId?: Types.ObjectId;
  toDesignationId: Types.ObjectId;
  fromDepartmentId?: Types.ObjectId;
  toDepartmentId?: Types.ObjectId;
  fromSalary?: number;
  toSalary?: number;
  effectiveDate: Date;
  reason?: string;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  status?: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const promotionSchema = new mongoose.Schema<IPromotion>(
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
    fromDesignationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
    },
    toDesignationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
      required: [true, 'To designation ID is required'],
    },
    fromDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    toDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    fromSalary: {
      type: Number,
    },
    toSalary: {
      type: Number,
    },
    effectiveDate: {
      type: Date,
      required: [true, 'Effective date is required'],
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [2000, 'Reason cannot exceed 2000 characters'],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        message: '{VALUE} is not a valid promotion status',
      },
      default: 'PENDING',
    },
    createdBy: {
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

promotionSchema.index({ employeeId: 1, companyId: 1 });

const Promotion = mongoose.model<IPromotion>('Promotion', promotionSchema);
export default Promotion;
