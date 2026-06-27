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

const ticketReplySchema = new mongoose.Schema<ITicketReply>(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Ticket ID is required'],
    },
    content: {
      type: String,
      required: [true, 'Reply content is required'],
      trim: true,
      maxlength: [10000, 'Reply cannot exceed 10000 characters'],
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
    attachments: {
      type: [String],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

ticketReplySchema.index({ ticketId: 1 });

const TicketReply = mongoose.model<ITicketReply>('TicketReply', ticketReplySchema);
export default TicketReply;
