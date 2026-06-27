import mongoose, { Document, Types } from 'mongoose';

export interface ITaskComment extends Document {
  taskId: Types.ObjectId;
  projectId: Types.ObjectId;
  content: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskCommentSchema = new mongoose.Schema<ITaskComment>(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task ID is required'],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
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

taskCommentSchema.index({ taskId: 1 });

const TaskComment = mongoose.model<ITaskComment>('TaskComment', taskCommentSchema);
export default TaskComment;
