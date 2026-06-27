import mongoose, { Document, Types } from 'mongoose';
export interface ITicketCategory extends Document {
    name: string;
    description?: string;
    color?: string;
    slaHours?: number;
    companyId: Types.ObjectId;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const TicketCategory: mongoose.Model<ITicketCategory, {}, {}, {}, mongoose.Document<unknown, {}, ITicketCategory, {}, {}> & ITicketCategory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default TicketCategory;
//# sourceMappingURL=TicketCategory.d.ts.map