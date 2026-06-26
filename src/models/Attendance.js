const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    workingHours: {
      type: Number,
      min: [0, 'Working hours cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'],
        message: '{VALUE} is not a valid attendance status',
      },
      required: [true, 'Status is required'],
    },
    source: {
      type: String,
      enum: {
        values: ['APP', 'MANUAL', 'BIOMETRIC'],
        message: '{VALUE} is not a valid source',
      },
      default: 'MANUAL',
    },
    overtime: {
      type: Number,
      default: 0,
      min: [0, 'Overtime cannot be negative'],
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

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ companyId: 1, date: 1, status: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
