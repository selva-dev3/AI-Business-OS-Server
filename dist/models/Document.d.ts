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
declare const Document: mongoose.Model<IDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocument, {}, {}> & IDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Document;
//# sourceMappingURL=Document.d.ts.map