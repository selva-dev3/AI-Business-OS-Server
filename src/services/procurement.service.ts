import Vendor from '../models/Vendor';
import RFQ from '../models/RFQ';
import Quote from '../models/Quote';
import PurchaseOrder from '../models/PurchaseOrder';
import GoodsReceipt from '../models/GoodsReceipt';
import Stock from '../models/Stock';
import StockMovement from '../models/StockMovement';
import AppError from '../utils/appError';
import { paginateQuery, buildMeta, generateCode } from '../utils/helpers';

interface QueryParams {
  search?: string;
  isActive?: boolean;
  tags?: string | string[];
  status?: string;
  vendorId?: string;
  page?: string;
  limit?: string;
}

const listVendors = async (companyId: string, query: QueryParams) => {
  const { search, isActive, tags } = query;
  const filter: Record<string, unknown> = { companyId };
  if (isActive !== undefined) filter.isActive = isActive;
  if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { code: regex }, { email: regex }, { taxNumber: regex }];
  }
  const { skip, limit: l, page: p } = paginateQuery(query.page, Number(query.limit));
  const [data, total] = await Promise.all([
    Vendor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l),
    Vendor.countDocuments(filter),
  ]);
  return { data, meta: buildMeta(total, p, l) };
};

const createVendor = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await Vendor.findOne({ companyId, code: data.code as string });
  if (existing) throw new AppError(409, 'CONFLICT', 'Vendor code already exists');
  return Vendor.create({ ...data, companyId });
};

const getVendorById = async (companyId: string, vendorId: string): Promise<any> => {
  const vendor = await Vendor.findOne({ _id: vendorId, companyId });
  if (!vendor) throw new AppError(404, 'NOT_FOUND', 'Vendor not found');
  const recentOrders = await PurchaseOrder.find({ vendorId, companyId })
    .sort({ createdAt: -1 }).limit(10);
  return { ...vendor.toJSON(), recentOrders };
};

const updateVendor = async (companyId: string, vendorId: string, data: Record<string, unknown>) => {
  if (data.code) {
    const dup = await Vendor.findOne({ companyId, code: data.code as string, _id: { $ne: vendorId } });
    if (dup) throw new AppError(409, 'CONFLICT', 'Vendor code already exists');
  }
  const vendor = await Vendor.findOneAndUpdate({ _id: vendorId, companyId }, data, { new: true, runValidators: true });
  if (!vendor) throw new AppError(404, 'NOT_FOUND', 'Vendor not found');
  return vendor;
};

const removeVendor = async (companyId: string, vendorId: string) => {
  const vendor = await Vendor.findOneAndDelete({ _id: vendorId, companyId });
  if (!vendor) throw new AppError(404, 'NOT_FOUND', 'Vendor not found');
  return { success: true };
};

const getVendorPurchaseHistory = async (companyId: string, vendorId: string) => {
  const vendor = await Vendor.findOne({ _id: vendorId, companyId });
  if (!vendor) throw new AppError(404, 'NOT_FOUND', 'Vendor not found');
  const orders = await PurchaseOrder.find({ vendorId, companyId }).sort({ createdAt: -1 });
  return { vendor, orders };
};

const listRFQs = async (companyId: string, query: QueryParams) => {
  const { status, search } = query;
  const filter: Record<string, unknown> = { companyId };
  if (status) filter.status = status;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ title: regex }, { rfqNumber: regex }];
  }
  const { skip, limit: l, page: p } = paginateQuery(query.page, Number(query.limit));
  const [data, total] = await Promise.all([
    RFQ.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l),
    RFQ.countDocuments(filter),
  ]);
  return { data, meta: buildMeta(total, p, l) };
};

const createRFQ = async (companyId: string, userId: string, data: Record<string, unknown>) => {
  const count = await RFQ.countDocuments({ companyId });
  const rfqNumber = generateCode('RFQ', count + 1);
  return RFQ.create({ ...data, rfqNumber, companyId, createdBy: userId });
};

const getRFQById = async (companyId: string, rfqId: string): Promise<any> => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  const quotes = await Quote.find({ rfqId }).populate('vendorId', 'name code');
  return { ...rfq.toJSON(), quotes };
};

const updateRFQ = async (companyId: string, rfqId: string, data: Record<string, unknown>) => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  if (rfq.status !== 'DRAFT') throw new AppError(400, 'BAD_REQUEST', 'Only DRAFT RFQs can be edited');
  Object.assign(rfq, data);
  return rfq.save();
};

const removeRFQ = async (companyId: string, rfqId: string) => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  if (rfq.status !== 'DRAFT') throw new AppError(400, 'BAD_REQUEST', 'Only DRAFT RFQs can be deleted');
  await Quote.deleteMany({ rfqId });
  return RFQ.deleteOne({ _id: rfqId });
};

const sendRFQ = async (companyId: string, rfqId: string, { vendorIds, message: _message }: Record<string, unknown>) => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  rfq.status = 'SENT';
  await rfq.save();
  for (const vendorId of vendorIds as string[]) {
    await Quote.create({
      rfqId,
      vendorId,
      companyId,
      status: 'DRAFT',
      totalAmount: 0,
      items: (rfq.items as unknown as Record<string, unknown>[]).map(item => ({
        rfqItemId: item._id,
        quantity: item.quantity,
        unitPrice: 0,
        totalAmount: 0,
      })),
    });
  }
  return rfq;
};

const getRFQQuotes = async (companyId: string, rfqId: string) => {
  const rfq = await RFQ.findOne({ _id: rfqId, companyId });
  if (!rfq) throw new AppError(404, 'NOT_FOUND', 'RFQ not found');
  return Quote.find({ rfqId }).populate('vendorId', 'name code email phone');
};

const createPOFromQuote = async (companyId: string, userId: string, data: Record<string, unknown>) => {
  const quote = await Quote.findById(data.quoteId).populate('rfqId') as Record<string, unknown> | null;
  if (!quote) throw new AppError(404, 'NOT_FOUND', 'Quote not found');
  if ((quote.companyId as string).toString() !== companyId.toString()) {
    throw new AppError(403, 'FORBIDDEN', 'Quote does not belong to this company');
  }

  const count = await PurchaseOrder.countDocuments({ companyId });
  const poNumber = generateCode('PO', count + 1);

  const rfqItems = (quote.rfqId as Record<string, unknown>).items as Record<string, unknown>[] | undefined;
  const items = (quote.items as Record<string, unknown>[]).map(item => {
    const rfqItem = rfqItems?.find(i => (i._id as string).toString() === (item.rfqItemId as string)?.toString());
    return {
      productId: rfqItem?.productId,
      description: (rfqItem?.description as string) || '',
      quantity: item.quantity as number,
      unitPrice: item.unitPrice as number,
      taxRate: 0,
      totalAmount: item.totalAmount as number,
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

const listPOs = async (companyId: string, query: QueryParams) => {
  const { status, vendorId, search } = query;
  const filter: Record<string, unknown> = { companyId };
  if (status) filter.status = status;
  if (vendorId) filter.vendorId = vendorId;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ poNumber: regex }, { notes: regex }];
  }
  const { skip, limit: l, page: p } = paginateQuery(query.page, Number(query.limit));
  const [data, total] = await Promise.all([
    PurchaseOrder.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).populate('vendorId', 'name code'),
    PurchaseOrder.countDocuments(filter),
  ]);
  return { data, meta: buildMeta(total, p, l) };
};

const createPO = async (companyId: string, userId: string, data: Record<string, unknown>) => {
  const count = await PurchaseOrder.countDocuments({ companyId });
  const poNumber = generateCode('PO', count + 1);

  const items = (data.items as Record<string, unknown>[]).map(item => {
    const itemTotal = (item.quantity as number) * (item.unitPrice as number);
    const tax = itemTotal * ((item.taxRate as number) / 100);
    return {
      ...item,
      totalAmount: itemTotal + tax,
    };
  });

  const subtotal = (items as Record<string, unknown>[]).reduce((s, i) => s + (i.quantity as number) * (i.unitPrice as number), 0);
  const taxAmount = (items as Record<string, unknown>[]).reduce((s, i) => s + ((i as any).totalAmount as number) - (i.quantity as number) * (i.unitPrice as number), 0);
  const totalAmount = subtotal + taxAmount - ((data.discount as number) || 0);

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

const getPOById = async (companyId: string, poId: string) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId }).populate('vendorId', 'name code email phone');
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  return po;
};

const updatePO = async (companyId: string, poId: string, data: Record<string, unknown>) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (po.status !== 'DRAFT') throw new AppError(400, 'BAD_REQUEST', 'Only DRAFT orders can be edited');
  if (data.expectedDate) po.expectedDate = data.expectedDate as Date;
  if (data.notes !== undefined) po.notes = data.notes as string;
  return po.save();
};

const submitPO = async (companyId: string, poId: string) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (po.status !== 'DRAFT') throw new AppError(400, 'BAD_REQUEST', 'Only DRAFT orders can be submitted');
  po.status = 'PENDING_APPROVAL';
  return po.save();
};

const approvePO = async (companyId: string, poId: string, userId: string) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (po.status !== 'PENDING_APPROVAL') throw new AppError(400, 'BAD_REQUEST', 'Order must be PENDING_APPROVAL');
  po.status = 'APPROVED';
  po.approvedBy = userId as any;
  po.approvedAt = new Date();
  return po.save();
};

const rejectPO = async (companyId: string, poId: string, _reason: string) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (po.status !== 'PENDING_APPROVAL') throw new AppError(400, 'BAD_REQUEST', 'Order must be PENDING_APPROVAL');
  po.status = 'REJECTED';
  po.rejectedAt = new Date();
  return po.save();
};

const cancelPO = async (companyId: string, poId: string, reason: string) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (['RECEIVED', 'CANCELLED'].includes(po.status!)) {
    throw new AppError(400, 'BAD_REQUEST', 'Order cannot be cancelled');
  }
  po.status = 'CANCELLED';
  po.cancelledAt = new Date();
  po.cancelReason = reason || '';
  return po.save();
};

const createReceipt = async (companyId: string, userId: string, poId: string, data: Record<string, unknown>) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  if (!['APPROVED', 'PARTIALLY_RECEIVED', 'SENT'].includes(po.status!)) {
    throw new AppError(400, 'BAD_REQUEST', 'Order cannot receive goods in current status');
  }

  const count = await GoodsReceipt.countDocuments({ companyId });
  const grNumber = generateCode('GR', count + 1);

  const grItems: Record<string, unknown>[] = [];
  for (const item of data.items as Record<string, unknown>[]) {
    const poItem = (po.items as unknown as Record<string, unknown>[]).find(i => String(i._id) === String(item.poItemId));
    if (!poItem) throw new AppError(404, 'NOT_FOUND', `PO item ${item.poItemId} not found`);

    const newReceived = Math.min(item.quantity as number, (poItem.quantity as number) - (poItem.receivedQty as number));
    if (newReceived <= 0) throw new AppError(400, 'BAD_REQUEST', `Item ${poItem.description as string} is fully received`);

    await updateStock(companyId, String(poItem.productId), data.warehouseId as string, newReceived, userId, `PO ${po.poNumber}`);

    poItem.receivedQty = (poItem.receivedQty as number) + newReceived;

    grItems.push({
      poItemId: item.poItemId,
      productId: poItem.productId,
      quantity: newReceived,
    });
  }

  const allReceived = (po.items as unknown as Record<string, unknown>[]).every(i => (i.receivedQty as number) >= (i.quantity as number));
  const anyReceived = (po.items as unknown as Record<string, unknown>[]).some(i => (i.receivedQty as number) > 0);
  po.status = allReceived ? 'RECEIVED' : anyReceived ? 'PARTIALLY_RECEIVED' : po.status;
  await po.save();

  const receipt = await GoodsReceipt.create({
    poId,
    purchaseOrderId: poId,
    grNumber,
    companyId,
    warehouseId: data.warehouseId,
    receivedAt: (data.receivedAt as Date) || new Date(),
    notes: data.notes,
    items: grItems,
    createdBy: userId,
  });

  return receipt;
};

const updateStock = async (companyId: string, productId: string, warehouseId: string, quantity: number, userId: string, reference: string) => {
  if (!productId) return;
  let stock = await Stock.findOne({ productId, warehouseId, companyId });
  if (!stock) {
    stock = await Stock.create({ productId, warehouseId, companyId, quantity: 0 });
  }
  const qtyBefore = stock.quantity || 0;
  stock.quantity = qtyBefore + quantity;
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

const getReceipts = async (companyId: string, poId: string) => {
  const po = await PurchaseOrder.findOne({ _id: poId, companyId });
  if (!po) throw new AppError(404, 'NOT_FOUND', 'Purchase order not found');
  return GoodsReceipt.find({ poId }).sort({ createdAt: -1 });
};

const exportPOs = async (companyId: string, query: QueryParams) => {
  const filter: Record<string, unknown> = { companyId };
  if (query.status) filter.status = query.status;
  if (query.vendorId) filter.vendorId = query.vendorId;
  return PurchaseOrder.find(filter).sort({ createdAt: -1 }).populate('vendorId', 'name code email');
};

export {
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
