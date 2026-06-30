import mongoose, { Document, Types } from 'mongoose';
export interface IEmployeeDocument extends Document {
    employeeId: Types.ObjectId;
    companyId: Types.ObjectId;
    documentType: string;
    documentName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
    isConfidential: boolean;
    expiryDate?: Date;
    uploadedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const EmployeeDocument: mongoose.Model<IEmployeeDocument, {}, {}, {}, mongoose.Document<unknown, {}, IEmployeeDocument, {}, {}> & IEmployeeDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default EmployeeDocument;
//# sourceMappingURL=EmployeeDocument.d.ts.map