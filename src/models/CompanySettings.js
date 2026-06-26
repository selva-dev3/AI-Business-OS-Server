const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
      unique: true,
    },
    attendance: {
      workStartTime: {
        type: String,
        default: '09:00',
        match: [/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'],
      },
      workEndTime: {
        type: String,
        default: '18:00',
        match: [/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'],
      },
      workingDays: {
        type: [String],
        enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
        default: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      },
      lateThresholdMinutes: {
        type: Number,
        default: 15,
        min: 0,
      },
    },
    leave: {
      autoApproveAfterDays: {
        type: Number,
        default: 0,
        min: 0,
      },
      maxConsecutiveDays: {
        type: Number,
        default: 30,
        min: 1,
      },
    },
    payroll: {
      payDay: {
        type: Number,
        default: 1,
        min: 1,
        max: 31,
      },
      pfPercentage: {
        type: Number,
        default: 12,
        min: 0,
        max: 100,
      },
      esiPercentage: {
        type: Number,
        default: 0.75,
        min: 0,
        max: 100,
      },
    },
    notifications: {
      emailEnabled: {
        type: Boolean,
        default: true,
      },
      inAppEnabled: {
        type: Boolean,
        default: true,
      },
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

module.exports = mongoose.model('CompanySettings', companySettingsSchema);
