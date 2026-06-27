import mongoose, { Document, Types } from 'mongoose';

export interface IHoliday extends Document {
  name: string;
  date: Date;
  type?: string;
  isOptional?: boolean;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const holidaySchema = new mongoose.Schema<IHoliday>(
  {
    name: {
      type: String,
      required: [true, 'Holiday name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['PUBLIC', 'RESTRICTED', 'OPTIONAL'],
        message: '{VALUE} is not a valid holiday type',
      },
      default: 'PUBLIC',
    },
    isOptional: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

holidaySchema.index({ companyId: 1, date: 1 }, { unique: true });

const Holiday = mongoose.model<IHoliday>('Holiday', holidaySchema);
export default Holiday;
