import mongoose, { Document, Types } from 'mongoose';

export interface IDocumentVersion extends Document {
  documentId: Types.ObjectId;
  version: number;
  fileUrl: string;
  fileSize?: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentVersionSchema = new mongoose.Schema<IDocumentVersion>(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: [true, 'Document ID is required'],
    },
    version: {
      type: Number,
      required: [true, 'Version number is required'],
      min: [1, 'Version must be at least 1'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true,
    },
    fileSize: {
      type: Number,
      min: [0, 'File size cannot be negative'],
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

documentVersionSchema.index({ documentId: 1, version: 1 }, { unique: true });

const DocumentVersion = mongoose.model<IDocumentVersion>('DocumentVersion', documentVersionSchema);
export default DocumentVersion;
