const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    type: {
      type: String,
      required: [true, 'Template type is required'],
      enum: {
        values: [
          'welcome',
          'leave_approved',
          'leave_rejected',
          'password_reset',
          'invitation',
          'invoice',
          'expense_approved',
          'expense_rejected',
        ],
        message: '{VALUE} is not a valid email template type',
      },
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
    },
    isCustomized: {
      type: Boolean,
      default: false,
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

emailTemplateSchema.index({ companyId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
