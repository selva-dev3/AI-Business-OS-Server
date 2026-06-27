import mongoose, { Document, Types } from 'mongoose';

export interface IDocumentShare extends Document {
  documentId: Types.ObjectId;
  userId: Types.ObjectId;
  access?: string;
  sharedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const documentShareSchema = new mongoose.Schema<IDocumentShare>(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: [true, 'Document ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    access: {
      type: String,
      enum: {
        values: ['VIEW', 'EDIT'],
        message: '{VALUE} is not a valid access level',
      },
      default: 'VIEW',
    },
    sharedAt: {
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

documentShareSchema.index({ documentId: 1, userId: 1 }, { unique: true });

const DocumentShare = mongoose.model<IDocumentShare>('DocumentShare', documentShareSchema);
export default DocumentShare;
