const mongoose = require('mongoose');

const attendanceSummarySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    totalPresent: {
      type: Number,
      default: 0,
      min: [0, 'Total present cannot be negative'],
    },
    totalAbsent: {
      type: Number,
      default: 0,
      min: [0, 'Total absent cannot be negative'],
    },
    totalLate: {
      type: Number,
      default: 0,
      min: [0, 'Total late cannot be negative'],
    },
    totalHalfDay: {
      type: Number,
      default: 0,
      min: [0, 'Total half day cannot be negative'],
    },
    totalOnLeave: {
      type: Number,
      default: 0,
      min: [0, 'Total on leave cannot be negative'],
    },
    departmentWise: {
      type: [
        {
          department: { type: String, trim: true },
          present: { type: Number, min: 0 },
          absent: { type: Number, min: 0 },
          late: { type: Number, min: 0 },
        },
      ],
      default: [],
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

attendanceSummarySchema.index({ companyId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceSummary', attendanceSummarySchema);
