import mongoose, { Document, Types } from 'mongoose';

export interface IDocumentFolder extends Document {
  name: string;
  description?: string;
  parentId?: Types.ObjectId;
  companyId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentFolderSchema = new mongoose.Schema<IDocumentFolder>(
  {
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: [200, 'Folder name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentFolder',
      default: null,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user ID is required'],
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

documentFolderSchema.index({ companyId: 1, parentId: 1 });

const DocumentFolder = mongoose.model<IDocumentFolder>('DocumentFolder', documentFolderSchema);
export default DocumentFolder;
