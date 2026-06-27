import mongoose, { Document, Types } from 'mongoose';

export interface ITrainingEnrollment extends Document {
  courseId: Types.ObjectId;
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  enrolledAt?: Date;
  completionDate?: Date;
  status?: string;
  score?: number;
  feedback?: string;
  completedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const trainingEnrollmentSchema = new mongoose.Schema<ITrainingEnrollment>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingCourse',
      required: [true, 'Course ID is required'],
    },
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
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED'],
        message: '{VALUE} is not a valid enrollment status',
      },
      default: 'ENROLLED',
    },
    score: {
      type: Number,
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
    },
    completedBy: {
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

trainingEnrollmentSchema.index({ courseId: 1, employeeId: 1 }, { unique: true });
trainingEnrollmentSchema.index({ employeeId: 1, companyId: 1 });

const TrainingEnrollment = mongoose.model<ITrainingEnrollment>('TrainingEnrollment', trainingEnrollmentSchema);
export default TrainingEnrollment;
