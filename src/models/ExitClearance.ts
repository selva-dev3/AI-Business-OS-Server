import mongoose, { Document, Types } from 'mongoose';

export interface IExitClearance extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  resignationId?: Types.ObjectId;
  departmentId: Types.ObjectId;
  clearanceBy?: Types.ObjectId;
  clearedAt?: Date;
  status?: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const exitClearanceSchema = new mongoose.Schema<IExitClearance>(
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
    resignationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExitResignation',
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department ID is required'],
    },
    clearanceBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    clearedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'CLEARED', 'NOT_CLEARED'],
        message: '{VALUE} is not a valid clearance status',
      },
      default: 'PENDING',
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

exitClearanceSchema.index({ employeeId: 1, departmentId: 1 }, { unique: true });
exitClearanceSchema.index({ companyId: 1 });

const ExitClearance = mongoose.model<IExitClearance>('ExitClearance', exitClearanceSchema);
export default ExitClearance;
