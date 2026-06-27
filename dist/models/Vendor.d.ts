import mongoose, { Document, Types } from 'mongoose';
interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
}
export interface IVendor extends Document {
    name: string;
    code: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: IAddress;
    taxNumber?: string;
    paymentTerms?: number;
    currency?: string;
    rating?: number;
    tags?: string[];
    notes?: string;
    companyId: Types.ObjectId;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Vendor: mongoose.Model<IVendor, {}, {}, {}, mongoose.Document<unknown, {}, IVendor, {}, {}> & IVendor & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Vendor;
//# sourceMappingURL=Vendor.d.ts.map