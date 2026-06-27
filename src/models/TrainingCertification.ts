import mongoose, { Document, Types } from 'mongoose';

export interface ITrainingCertification extends Document {
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  courseId?: Types.ObjectId;
  name: string;
  issuedBy?: string;
  issueDate: Date;
  expiryDate?: Date;
  certificateUrl?: string;
  credentialId?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const trainingCertificationSchema = new mongoose.Schema<ITrainingCertification>(
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
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingCourse',
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    issuedBy: {
      type: String,
      trim: true,
      maxlength: [200, 'Issued by cannot exceed 200 characters'],
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required'],
    },
    expiryDate: {
      type: Date,
    },
    certificateUrl: {
      type: String,
      trim: true,
    },
    credentialId: {
      type: String,
      trim: true,
      maxlength: [100, 'Credential ID cannot exceed 100 characters'],
    },
    skills: {
      type: [String],
      default: [],
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

trainingCertificationSchema.index({ employeeId: 1, companyId: 1 });

const TrainingCertification = mongoose.model<ITrainingCertification>('TrainingCertification', trainingCertificationSchema);
export default TrainingCertification;
