import mongoose, { Document, Types } from 'mongoose';
export interface IDocumentShare extends Document {
    documentId: Types.ObjectId;
    userId: Types.ObjectId;
    access?: string;
    sharedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const DocumentShare: mongoose.Model<IDocumentShare, {}, {}, {}, mongoose.Document<unknown, {}, IDocumentShare, {}, {}> & IDocumentShare & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default DocumentShare;
//# sourceMappingURL=DocumentShare.d.ts.map