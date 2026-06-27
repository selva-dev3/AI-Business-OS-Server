import mongoose, { Document, Types } from 'mongoose';

export interface IMilestone extends Document {
  projectId: Types.ObjectId;
  name: string;
  description?: string;
  dueDate?: Date;
  status?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const milestoneSchema = new mongoose.Schema<IMilestone>(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Milestone name is required'],
      trim: true,
      maxlength: [200, 'Milestone name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        message: '{VALUE} is not a valid milestone status',
      },
      default: 'PENDING',
    },
    completedAt: {
      type: Date,
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

milestoneSchema.index({ projectId: 1 });

const Milestone = mongoose.model<IMilestone>('Milestone', milestoneSchema);
export default Milestone;
