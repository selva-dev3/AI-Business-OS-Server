import mongoose, { Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  action: string;
  module: string;
  entityType: string;
  entityId?: unknown;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new mongoose.Schema<IAuditLog>(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: {
        values: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN'],
        message: '{VALUE} is not a valid action',
      },
      uppercase: true,
    },
    module: {
      type: String,
      required: [true, 'Module is required'],
      trim: true,
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      trim: true,
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed,
    },
    oldValues: {
      type: mongoose.Schema.Types.Mixed,
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

auditLogSchema.index({ companyId: 1, module: 1, action: 1, createdAt: -1 });

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
export default AuditLog;
