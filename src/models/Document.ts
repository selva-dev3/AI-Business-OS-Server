import mongoose, { Document as MongooseDocument, Types } from 'mongoose';

export interface IDocument extends MongooseDocument {
  name: string;
  description?: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  extension?: string;
  tags?: string[];
  isShared?: boolean;
  shareToken?: string;
  version?: number;
  companyId: Types.ObjectId;
  folderId?: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new mongoose.Schema<IDocument>(
  {
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
      maxlength: [255, 'Document name cannot exceed 255 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
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
    mimeType: {
      type: String,
      trim: true,
    },
    extension: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
      trim: true,
      sparse: true,
    },
    version: {
      type: Number,
      default: 1,
      min: [1, 'Version must be at least 1'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentFolder',
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploaded by user ID is required'],
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

documentSchema.index({ companyId: 1, folderId: 1 });

const Document = mongoose.model<IDocument>('Document', documentSchema);
export default Document;
