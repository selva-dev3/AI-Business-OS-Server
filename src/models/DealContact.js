const mongoose = require('mongoose');

const dealContactSchema = new mongoose.Schema(
  {
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    role: { type: String, default: '' },
  },
  { timestamps: true }
);

dealContactSchema.index({ dealId: 1, contactId: 1 }, { unique: true });

dealContactSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('DealContact', dealContactSchema);
