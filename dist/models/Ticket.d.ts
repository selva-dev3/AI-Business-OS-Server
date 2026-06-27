import mongoose, { Document, Types } from 'mongoose';
export interface ITicket extends Document {
    ticketNumber: string;
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    resolution?: string;
    tags?: string[];
    attachments?: string[];
    slaDeadline?: Date;
    firstResponseAt?: Date;
    resolvedAt?: Date;
    closedAt?: Date;
    companyId: Types.ObjectId;
    categoryId?: Types.ObjectId;
    reporterId: Types.ObjectId;
    assigneeId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Ticket: mongoose.Model<ITicket, {}, {}, {}, mongoose.Document<unknown, {}, ITicket, {}, {}> & ITicket & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Ticket;
//# sourceMappingURL=Ticket.d.ts.map