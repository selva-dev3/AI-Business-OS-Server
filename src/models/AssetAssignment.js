const mongoose = require('mongoose');

const assetAssignmentSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset ID is required'],
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    assignedAt: {
      type: Date,
      required: [true, 'Assigned at date is required'],
    },
    returnedAt: {
      type: Date,
    },
    condition: {
      type: String,
      trim: true,
      maxlength: [500, 'Condition cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

assetAssignmentSchema.index({ assetId: 1, returnedAt: 1 });

module.exports = mongoose.model('AssetAssignment', assetAssignmentSchema);
