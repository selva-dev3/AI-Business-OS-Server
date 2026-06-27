import mongoose, { Document, Types } from 'mongoose';

export interface IAssetAssignment extends Document {
  assetId: Types.ObjectId;
  employeeId: Types.ObjectId;
  companyId: Types.ObjectId;
  assignedAt: Date;
  returnedAt?: Date;
  condition?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assetAssignmentSchema = new mongoose.Schema<IAssetAssignment>(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset ID is required'],
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
    assignedAt: {
      type: Date,
      required: [true, 'Assigned at date is required'],
    },
    returnedAt: {
      type: Date,
    },
    condition: {
      type: String,
      trim: true,
      maxlength: [500, 'Condition cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
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

assetAssignmentSchema.index({ assetId: 1, returnedAt: 1 });

const AssetAssignment = mongoose.model<IAssetAssignment>('AssetAssignment', assetAssignmentSchema);
export default AssetAssignment;
