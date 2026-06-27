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

const ticketCategorySchema = new mongoose.Schema<ITicketCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    color: {
      type: String,
      trim: true,
      match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid color hex code'],
    },
    slaHours: {
      type: Number,
      min: [0, 'SLA hours cannot be negative'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
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

ticketCategorySchema.index({ companyId: 1, name: 1 }, { unique: true });

const TicketCategory = mongoose.model<ITicketCategory>('TicketCategory', ticketCategorySchema);
export default TicketCategory;
