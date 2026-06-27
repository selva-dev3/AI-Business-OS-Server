import mongoose, { Document, Types } from 'mongoose';
export interface IEmailTemplate extends Document {
    companyId: Types.ObjectId;
    type: string;
    subject: string;
    body: string;
    isCustomized?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const EmailTemplate: mongoose.Model<IEmailTemplate, {}, {}, {}, mongoose.Document<unknown, {}, IEmailTemplate, {}, {}> & IEmailTemplate & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default EmailTemplate;
//# sourceMappingURL=EmailTemplate.d.ts.map