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
declare const DocumentVersion: mongoose.Model<IDocumentVersion, {}, {}, {}, mongoose.Document<unknown, {}, IDocumentVersion, {}, {}> & IDocumentVersion & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default DocumentVersion;
//# sourceMappingURL=DocumentVersion.d.ts.map