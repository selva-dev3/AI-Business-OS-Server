const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: [true, 'Module name is required'],
      trim: true,
      maxlength: [100, 'Module name cannot exceed 100 characters'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      maxlength: [100, 'Action cannot exceed 100 characters'],
    },
    scope: {
      type: String,
      enum: {
        values: ['company', 'own'],
        message: '{VALUE} is not a valid scope',
      },
      required: [true, 'Scope is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
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

permissionSchema.index({ module: 1, action: 1 }, { unique: true });

module.exports = mongoose.model('Permission', permissionSchema);
