const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    source: {
      type: String,
      enum: ['WEBSITE', 'REFERRAL', 'SOCIAL', 'EMAIL', 'CALL', 'OTHER'],
      default: 'OTHER',
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'DISQUALIFIED'],
      default: 'NEW',
    },
    score: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    customFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    convertedAt: { type: Date },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      default: null,
    },
  },
  { timestamps: true }
);

leadSchema.index({ companyId: 1, status: 1 });
leadSchema.index({ email: 1 }, { unique: true, sparse: true });
leadSchema.index({ ownerId: 1, status: 1 });

leadSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Lead', leadSchema);
