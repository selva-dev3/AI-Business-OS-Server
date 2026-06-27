import mongoose, { Document, Types } from 'mongoose';

export interface IEmployeeHistory extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  changeType: string;
  oldValue?: string;
  newValue?: string;
  oldDepartmentId?: Types.ObjectId;
  newDepartmentId?: Types.ObjectId;
  oldDesignationId?: Types.ObjectId;
  newDesignationId?: Types.ObjectId;
  effectiveDate?: Date;
  changedBy?: Types.ObjectId;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeHistorySchema = new mongoose.Schema<IEmployeeHistory>(
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
    changeType: {
      type: String,
      required: [true, 'Change type is required'],
      enum: {
        values: [
          'DESIGNATION_CHANGE',
          'DEPARTMENT_CHANGE',
          'BRANCH_CHANGE',
          'PROMOTION',
          'TRANSFER',
          'STATUS_CHANGE',
          'SALARY_CHANGE',
          'OTHER',
        ],
        message: '{VALUE} is not a valid change type',
      },
    },
    oldValue: {
      type: String,
      trim: true,
    },
    newValue: {
      type: String,
      trim: true,
    },
    oldDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    newDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    oldDesignationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
    },
    newDesignationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
    },
    effectiveDate: {
      type: Date,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [2000, 'Reason cannot exceed 2000 characters'],
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

employeeHistorySchema.index({ employeeId: 1, companyId: 1 });

const EmployeeHistory = mongoose.model<IEmployeeHistory>('EmployeeHistory', employeeHistorySchema);
export default EmployeeHistory;
