import mongoose, { Document, Types } from 'mongoose';
export interface ITicketReply extends Document {
    ticketId: Types.ObjectId;
    content: string;
    isInternal?: boolean;
    attachments?: string[];
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const TicketReply: mongoose.Model<ITicketReply, {}, {}, {}, mongoose.Document<unknown, {}, ITicketReply, {}, {}> & ITicketReply & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default TicketReply;
//# sourceMappingURL=TicketReply.d.ts.map