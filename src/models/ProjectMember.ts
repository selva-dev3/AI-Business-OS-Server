import mongoose, { Document, Types } from 'mongoose';

export interface IProjectMember extends Document {
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  role: string;
  joinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectMemberSchema = new mongoose.Schema<IProjectMember>(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    role: {
      type: String,
      enum: {
        values: ['PROJECT_MANAGER', 'DEVELOPER', 'DESIGNER', 'TESTER', 'STAKEHOLDER'],
        message: '{VALUE} is not a valid project member role',
      },
      required: [true, 'Role is required'],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
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

projectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

const ProjectMember = mongoose.model<IProjectMember>('ProjectMember', projectMemberSchema);
export default ProjectMember;
