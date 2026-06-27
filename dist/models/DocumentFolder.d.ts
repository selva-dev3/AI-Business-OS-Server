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
declare const DocumentFolder: mongoose.Model<IDocumentFolder, {}, {}, {}, mongoose.Document<unknown, {}, IDocumentFolder, {}, {}> & IDocumentFolder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default DocumentFolder;
//# sourceMappingURL=DocumentFolder.d.ts.map