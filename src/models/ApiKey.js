const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    name: {
      type: String,
      required: [true, 'Key name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    key: {
      type: String,
      required: [true, 'Key is required'],
      unique: true,
    },
    keyPreview: {
      type: String,
      required: [true, 'Key preview is required'],
    },
    lastUsedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    permissions: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret.key;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('ApiKey', apiKeySchema);
