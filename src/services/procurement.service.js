const Vendor = require('../models/Vendor');
const RFQ = require('../models/RFQ');
const Quote = require('../models/Quote');
const PurchaseOrder = require('../models/PurchaseOrder');
const GoodsReceipt = require('../models/GoodsReceipt');
const Stock = require('../models/Stock');
const StockMovement = require('../models/StockMovement');
const AppError = require('../utils/appError');
const { paginateQuery, buildMeta, generateCode } = require('../utils/helpers');

// ---------- VENDORS ----------

const listVendors = async (companyId, query) => {
  const { search, isActive, tags, page = 1, limit = 20 } = query;
  const filter = { companyId };
  if (isActive !== undefined) filter.isActive = isActive;
  if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { code: regex }, { email: regex }, { taxNumber: regex }];
  }
  const { skip, limit: l, page: p } = paginateQuery(query.page, query.limit);
  const [data, total] = await Promise.all([
    Vendor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l),
    Vendor.countDocuments(filter),
  ]);
  return { data, meta: buildMeta(total, p, l) };
};

const createVendor = async (companyId, data) => {
  const existing = await Vendor.findOne({ companyId, code: data.code });
  if (existing) throw new AppError(409, 'CONFLICT', 'Vendor code already exists');
  return Vendor.create({ ...data, companyId });
};

const getVendorById = async (companyId, vendorId) => {
  const vendor = await Vendor.findOne({ _id: vendorId, companyId });
  if (!vendor) throw new AppError(404, 'NOT_FOUND', 'Vendor not found');
  const recentOrders = await PurchaseOrder.find({ vendorId, companyId })
    .sort({ createdAt: -1 }).limit(10);
  return { ...vendor.toJSON(), recentOrders };
};

const updateVendor = async (companyId, vendorId, data) => {
  if (data.code) {
    const dup = await Vendor.findOne({ companyId, code: data.code, _id: { $ne: vendorId } });
    if (dup) throw new AppError(409, 'CONFLICT', 'Vendor code already exists');
  }
  const vendor = await Vendor.findOneAndUpdate({ _id: vendorId, companyId }, data, { new: true, runValidators: true });
  if (!vendor) throw new AppError(404, 'NOT_FOUND', 'Vendor not found');
  return vendor;
};

const removeVendor = async (companyId, vendorId) => {
  const vendor = await Vendor.findOneAndDelete({ _id: vendorId, companyId });
  if (!vendor) throw new AppError(404, 'NOT_FOUND', 'Vendor not found');
  return { success: true };
};

const getVendorPurchaseHistory = async (companyId, vendorId) => {
  const vendor = await Vendor.findOne({ _id: vendorId, companyId });
  if (!vendor) throw new AppError(404, 'NOT_FOUND', 'Vendor not found');
  const orders = await PurchaseOrder.find({ vendorId, companyId }).sort({ createdAt: -1 });
  return { vendor, orders };
};

// ---------- RFQ ----------

const listRFQs = async (companyId, query) => {
  const { status, page = 1, limit = 20, search } = query;
  const filter = { companyId };
  if (status) filter.status = status;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ title: regex }, { rfqNumber: regex }];
  }
  const { skip, limit: l, page: p } = paginateQuery(page, limit);
  const [data, total] = await Promise.all([
    RFQ.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l),
    RFQ.countDocuments(filter),
  ]);
  return { data, meta: buildMeta(total, p, l) };
};

const createRFQ = async (companyId, userId, data) => {
  const count = await RFQ.countDocuments({ companyId });
  const rfqNumber = generateCode('RFQ', count + 1);
  return RFQ.create({ ...data, rfqNumber, companyId, createdBy: userId });
};

const getRFQById = async (companyId, rfqId) => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  const quotes = await Quote.find({ rfqId }).populate('vendorId', 'name code');
  return { ...rfq.toJSON(), quotes };
};

const updateRFQ = async (companyId, rfqId, data) => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  if (rfq.status !== 'DRAFT') throw new AppError(400, 'BAD_REQUEST', 'Only DRAFT RFQs can be edited');
  Object.assign(rfq, data);
  return rfq.save();
};

const removeRFQ = async (companyId, rfqId) => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  if (rfq.status !== 'DRAFT') throw new AppError(400, 'BAD_REQUEST', 'Only DRAFT RFQs can be deleted');
  await Quote.deleteMany({ rfqId });
  return RFQ.deleteOne({ _id: rfqId });
};

const sendRFQ = async (companyId, rfqId, { vendorIds, message }) => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  rfq.status = 'SENT';
  await rfq.save();
  for (const vendorId of vendorIds) {
    await Quote.create({
      rfqId,
      vendorId,
      companyId,
      status: 'DRAFT',
      totalAmount: 0,
      items: rfq.items.map(item => ({
        rfqItemId: item._id,
        quantity: item.quantity,
        unitPrice: 0,
        totalAmount: 0,
      })),
    });
  }
  return rfq;
};

const getRFQQuotes = async (companyId, rfqId) => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  return Quote.find({ rfqId }).populate('vendorId', 'name code email phone');
};

const createPOFromQuote = async (companyId, userId, data) => {
  const quote = await Quote.findById(data.quoteId).populate('rfqId');
  if (!quote) throw new AppError(404, 'NOT_FOUND', 'Quote not found');
  if (quote.companyId.toString() !== companyId.toString()) {
    throw new AppError(403, 'FORBIDDEN', 'Quote does not belong to this company');
  }

  const count = await PurchaseOrder.countDocuments({ companyId });
  const poNumber = generateCode('PO', count + 1);

  const items = quote.items.map(item => {
    const rfqItem = quote.rfqId.items.find(i => i._id.toString() === item.rfqItemId?.toString());
    return {
      productId: rfqItem?.productId,
      description: rfqItem?.description || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: 0,
      totalAmount: item.totalAmount,
    };
  });

  const subtotal = items.reduce((s, i) => s + i.totalAmount, 0);
  const taxAmount = 0;
  const totalAmount = subtotal;

  return PurchaseOrder.create({
    poNumber,
    vendorId: quote.vendorId,
    companyId,
    status: 'DRAFT',
    orderDate: new Date(),
    expectedDate: data.expectedDate,
    deliveryAddress: data.deliveryAddress,
    items,
    subtotal,
    taxAmount,
    discount: 0,
    totalAmount,
    notes: data.notes,
    createdBy: userId,
  });
};

// ---------- PURCHASE ORDERS ----------

const listPOs = async (companyId, query) => {
  const { status, vendorId, page = 1, limit = 20, search } = query;
  const filter = { companyId };
  if (status) filter.status = status;
  if (vendorId) filter.vendorId = vendorId;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ poNumber: regex }, { notes: regex }];
  }
  const { skip, limit: l, page: p } = paginateQuery(page, limit);
  const [data, total] = await Promise.all([
    PurchaseOrder.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).populate('vendorId', 'name code'),
    PurchaseOrder.countDocuments(filter),
  ]);
  return { data, meta: buildMeta(total, p, l) };
};

const createPO = async (companyId, userId, data) => {
  const count = await PurchaseOrder.countDocuments({ companyId });
  const poNumber = generateCode('PO', count + 1);

  const items = data.items.map(item => {
    const itemTotal = item.quantity * item.unitPrice;
    const tax = itemTotal * (item.taxRate / 100);
    return {
      ...item,
      totalAmount: itemTotal + tax,
    };
  });

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxAmount = items.reduce((s, i) => s + i.totalAmount - i.quantity * i.unitPrice, 0);
  const totalAmount = subtotal + taxAmount - (data.discount || 0);

  return PurchaseOrder.create({
    ...data,
    items,
    poNumber,
    companyId,
    status: 'DRAFT',
    orderDate: new Date(),
    subtotal,
    taxAmount,
    totalAmount,
    createdBy: userId,
  });
};

const getPOById = async (companyId, poId) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId }).populate('vendorId', 'name code email phone');
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  return po;
};

const updatePO = async (companyId, poId, data) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (po.status !== 'DRAFT') throw new AppError(400, 'BAD_REQUEST', 'Only DRAFT orders can be edited');
  if (data.expectedDate) po.expectedDate = data.expectedDate;
  if (data.notes !== undefined) po.notes = data.notes;
  return po.save();
};

const submitPO = async (companyId, poId) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (po.status !== 'DRAFT') throw new AppError(400, 'BAD_REQUEST', 'Only DRAFT orders can be submitted');
  po.status = 'PENDING_APPROVAL';
  return po.save();
};

const approvePO = async (companyId, poId, userId) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (po.status !== 'PENDING_APPROVAL') throw new AppError(400, 'BAD_REQUEST', 'Order must be PENDING_APPROVAL');
  po.status = 'APPROVED';
  po.approvedBy = userId;
  po.approvedAt = new Date();
  return po.save();
};

const rejectPO = async (companyId, poId, reason) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (po.status !== 'PENDING_APPROVAL') throw new AppError(400, 'BAD_REQUEST', 'Order must be PENDING_APPROVAL');
  po.status = 'REJECTED';
  po.rejectedAt = new Date();
  return po.save();
};

const cancelPO = async (companyId, poId, reason) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (['RECEIVED', 'CANCELLED'].includes(po.status)) {
    throw new AppError(400, 'BAD_REQUEST', 'Order cannot be cancelled');
  }
  po.status = 'CANCELLED';
  po.cancelledAt = new Date();
  po.cancelReason = reason || '';
  return po.save();
};

const createReceipt = async (companyId, userId, poId, data) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (!['APPROVED', 'PARTIALLY_RECEIVED', 'SENT'].includes(po.status)) {
    throw new AppError(400, 'BAD_REQUEST', 'Order cannot receive goods in current status');
  }

  const count = await GoodsReceipt.countDocuments({ companyId });
  const grNumber = generateCode('GR', count + 1);

  const grItems = [];
  for (const item of data.items) {
    const poItem = po.items.id(item.poItemId);
    if (!poItem) throw new AppError(404, 'NOT_FOUND', `PO item ${item.poItemId} not found`);

    const newReceived = Math.min(item.quantity, poItem.quantity - poItem.receivedQty);
    if (newReceived <= 0) throw new AppError(400, 'BAD_REQUEST', `Item ${poItem.description} is fully received`);

    await updateStock(companyId, poItem.productId, data.warehouseId, newReceived, userId, `PO ${po.poNumber}`);

    poItem.receivedQty += newReceived;

    grItems.push({
      poItemId: item.poItemId,
      productId: poItem.productId,
      quantity: newReceived,
    });
  }

  const allReceived = po.items.every(i => i.receivedQty >= i.quantity);
  const anyReceived = po.items.some(i => i.receivedQty > 0);
  po.status = allReceived ? 'RECEIVED' : anyReceived ? 'PARTIALLY_RECEIVED' : po.status;
  await po.save();

  const receipt = await GoodsReceipt.create({
    poId,
    purchaseOrderId: poId,
    grNumber,
    companyId,
    warehouseId: data.warehouseId,
    receivedAt: data.receivedAt || new Date(),
    notes: data.notes,
    items: grItems,
    createdBy: userId,
  });

  return receipt;
};

const updateStock = async (companyId, productId, warehouseId, quantity, userId, reference) => {
  if (!productId) return;
  let stock = await Stock.findOne({ productId, warehouseId, companyId });
  if (!stock) {
    stock = await Stock.create({ productId, warehouseId, companyId, quantity: 0 });
  }
  const qtyBefore = stock.quantity;
  stock.quantity += quantity;
  await stock.save();

  await StockMovement.create({
    productId,
    warehouseId,
    companyId,
    type: 'PURCHASE_IN',
    quantity,
    quantityBefore: qtyBefore,
    quantityAfter: stock.quantity,
    reference,
    createdBy: userId,
  });
};

const getReceipts = async (companyId, poId) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  return GoodsReceipt.find({ poId }).sort({ createdAt: -1 });
};

const exportPOs = async (companyId, query) => {
  const filter = { companyId };
  if (query.status) filter.status = query.status;
  if (query.vendorId) filter.vendorId = query.vendorId;
  return PurchaseOrder.find(filter).sort({ createdAt: -1 }).populate('vendorId', 'name code email');
};

module.exports = {
  listVendors,
  createVendor,
  getVendorById,
  updateVendor,
  removeVendor,
  getVendorPurchaseHistory,
  listRFQs,
  createRFQ,
  getRFQById,
  updateRFQ,
  removeRFQ,
  sendRFQ,
  getRFQQuotes,
  createPOFromQuote,
  listPOs,
  createPO,
  getPOById,
  updatePO,
  submitPO,
  approvePO,
  rejectPO,
  cancelPO,
  createReceipt,
  getReceipts,
  exportPOs,
};
