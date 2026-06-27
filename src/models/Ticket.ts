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

const ticketSchema = new mongoose.Schema<ITicket>(
  {
    ticketNumber: {
      type: String,
      required: [true, 'Ticket number is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        message: '{VALUE} is not a valid ticket status',
      },
      default: 'OPEN',
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        message: '{VALUE} is not a valid priority level',
      },
      default: 'MEDIUM',
    },
    resolution: {
      type: String,
      trim: true,
      maxlength: [2000, 'Resolution cannot exceed 2000 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    attachments: {
      type: [String],
      default: [],
    },
    slaDeadline: {
      type: Date,
    },
    firstResponseAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketCategory',
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter ID is required'],
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

ticketSchema.index({ companyId: 1, status: 1 });

const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
export default Ticket;
