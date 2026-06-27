import mongoose, { Document, Types } from 'mongoose';

export interface ITimesheet extends Document {
  projectId: Types.ObjectId;
  taskId?: Types.ObjectId;
  userId: Types.ObjectId;
  companyId: Types.ObjectId;
  date: Date;
  hours: number;
  description?: string;
  isBillable?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const timesheetSchema = new mongoose.Schema<ITimesheet>(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
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
    hours: {
      type: Number,
      required: [true, 'Hours is required'],
      min: [0.25, 'Minimum hours is 0.25'],
      max: [24, 'Maximum hours is 24'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    isBillable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

timesheetSchema.index({ userId: 1, date: 1 });
timesheetSchema.index({ projectId: 1 });

const Timesheet = mongoose.model<ITimesheet>('Timesheet', timesheetSchema);
export default Timesheet;
