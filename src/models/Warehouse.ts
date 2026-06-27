import mongoose, { Document, Types } from 'mongoose';

interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface IWarehouse extends Document {
  name: string;
  code: string;
  address?: IAddress;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zip: { type: String, trim: true },
  },
  { _id: false }
);

const warehouseSchema = new mongoose.Schema<IWarehouse>(
  {
    name: {
      type: String,
      required: [true, 'Warehouse name is required'],
      trim: true,
      maxlength: [200, 'Warehouse name cannot exceed 200 characters'],
    },
    code: {
      type: String,
      required: [true, 'Warehouse code is required'],
      trim: true,
      uppercase: true,
      maxlength: [50, 'Warehouse code cannot exceed 50 characters'],
    },
    address: {
      type: addressSchema,
      default: {},
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
      index: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
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

warehouseSchema.index({ companyId: 1, code: 1 }, { unique: true });

const Warehouse = mongoose.model<IWarehouse>('Warehouse', warehouseSchema);
export default Warehouse;
