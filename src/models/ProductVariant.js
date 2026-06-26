const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      trim: true,
      uppercase: true,
      unique: true,
      maxlength: [100, 'SKU cannot exceed 100 characters'],
    },
    name: {
      type: String,
      required: [true, 'Variant name is required'],
      trim: true,
      maxlength: [200, 'Variant name cannot exceed 200 characters'],
    },
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    sellingPrice: {
      type: Number,
      min: [0, 'Selling price cannot be negative'],
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model('ProductVariant', productVariantSchema);
