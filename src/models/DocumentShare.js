const mongoose = require('mongoose');

const documentShareSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: [true, 'Document ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    access: {
      type: String,
      enum: {
        values: ['VIEW', 'EDIT'],
        message: '{VALUE} is not a valid access level',
      },
      default: 'VIEW',
    },
    sharedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

documentShareSchema.index({ documentId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('DocumentShare', documentShareSchema);
