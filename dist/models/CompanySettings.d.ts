import mongoose, { Document, Types } from 'mongoose';
export interface ICompanySettings extends Document {
    companyId: Types.ObjectId;
    attendance?: Record<string, unknown>;
    leave?: Record<string, unknown>;
    payroll?: Record<string, unknown>;
    notifications?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
declare const CompanySettings: mongoose.Model<ICompanySettings, {}, {}, {}, mongoose.Document<unknown, {}, ICompanySettings, {}, {}> & ICompanySettings & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default CompanySettings;
//# sourceMappingURL=CompanySettings.d.ts.map