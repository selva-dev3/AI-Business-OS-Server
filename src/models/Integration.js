const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    type: {
      type: String,
      required: [true, 'Integration type is required'],
      enum: {
        values: ['slack', 'google', 'zapier'],
        message: '{VALUE} is not a valid integration type',
      },
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    connectedAt: {
      type: Date,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

integrationSchema.index({ companyId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Integration', integrationSchema);
