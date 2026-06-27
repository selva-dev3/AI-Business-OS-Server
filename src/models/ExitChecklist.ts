import mongoose, { Document, Types } from 'mongoose';

interface IChecklistTask {
  task?: string;
  assignedTo?: Types.ObjectId;
  isCompleted?: boolean;
  completedAt?: Date;
  comments?: string;
}

export interface IExitChecklist extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  resignationId?: Types.ObjectId;
  tasks?: IChecklistTask[];
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const exitChecklistSchema = new mongoose.Schema<IExitChecklist>(
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
    tasks: {
      type: [
        {
          task: { type: String, trim: true },
          assignedTo: { type: mongoose.Schema.Types.ObjectId },
          isCompleted: { type: Boolean, default: false },
          completedAt: { type: Date },
          comments: { type: String, trim: true },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        message: '{VALUE} is not a valid checklist status',
      },
      default: 'PENDING',
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

exitChecklistSchema.index({ employeeId: 1, companyId: 1 });

const ExitChecklist = mongoose.model<IExitChecklist>('ExitChecklist', exitChecklistSchema);
export default ExitChecklist;
