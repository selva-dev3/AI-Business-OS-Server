import mongoose, { Document, Types } from 'mongoose';

export interface ITask extends Document {
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  position?: number;
  dueDate?: Date;
  estimatedHours?: number;
  loggedHours?: number;
  tags?: string[];
  attachments?: string[];
  assigneeId?: Types.ObjectId;
  reporterId: Types.ObjectId;
  milestoneId?: Types.ObjectId;
  parentTaskId?: Types.ObjectId;
  companyId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
        message: '{VALUE} is not a valid task status',
      },
      default: 'TODO',
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        message: '{VALUE} is not a valid priority level',
      },
      default: 'MEDIUM',
    },
    position: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      min: [0, 'Estimated hours cannot be negative'],
    },
    loggedHours: {
      type: Number,
      default: 0,
      min: [0, 'Logged hours cannot be negative'],
    },
    tags: {
      type: [String],
      default: [],
    },
    attachments: {
      type: [String],
      default: [],
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter ID is required'],
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
    },
    parentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
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

taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;
