const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    website: { type: String, default: '' },
    industry: { type: String, default: '' },
    size: { type: String, default: '' },
    revenue: { type: Number, default: 0 },
    phone: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zip: { type: String, default: '' },
    },
    tags: [{ type: String, trim: true }],
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
  },
  { timestamps: true }
);

accountSchema.index({ companyId: 1, name: 1 }, { unique: true });
accountSchema.index({ companyId: 1, industry: 1 });

accountSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Account', accountSchema);
