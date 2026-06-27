"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPOs = exports.getReceipts = exports.createReceipt = exports.cancelPO = exports.rejectPO = exports.approvePO = exports.submitPO = exports.updatePO = exports.getPOById = exports.createPO = exports.listPOs = exports.createPOFromQuote = exports.getRFQQuotes = exports.sendRFQ = exports.removeRFQ = exports.updateRFQ = exports.getRFQById = exports.createRFQ = exports.listRFQs = exports.getVendorPurchaseHistory = exports.removeVendor = exports.updateVendor = exports.getVendorById = exports.createVendor = exports.listVendors = void 0;
const Vendor_1 = __importDefault(require("../models/Vendor"));
const RFQ_1 = __importDefault(require("../models/RFQ"));
const Quote_1 = __importDefault(require("../models/Quote"));
const PurchaseOrder_1 = __importDefault(require("../models/PurchaseOrder"));
const GoodsReceipt_1 = __importDefault(require("../models/GoodsReceipt"));
const Stock_1 = __importDefault(require("../models/Stock"));
const StockMovement_1 = __importDefault(require("../models/StockMovement"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const listVendors = async (companyId, query) => {
    const { search, isActive, tags } = query;
    const filter = { companyId };
    if (isActive !== undefined)
        filter.isActive = isActive;
    if (tags)
        filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [{ name: regex }, { code: regex }, { email: regex }, { taxNumber: regex }];
    }
    const { skip, limit: l, page: p } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const [data, total] = await Promise.all([
        Vendor_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l),
        Vendor_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, p, l) };
};
exports.listVendors = listVendors;
const createVendor = async (companyId, data) => {
    const existing = await Vendor_1.default.findOne({ companyId, code: data.code });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Vendor code already exists');
    return Vendor_1.default.create({ ...data, companyId });
};
exports.createVendor = createVendor;
const getVendorById = async (companyId, vendorId) => {
    const vendor = await Vendor_1.default.findOne({ _id: vendorId, companyId });
    if (!vendor)
        throw new appError_1.default(404, 'NOT_FOUND', 'Vendor not found');
    const recentOrders = await PurchaseOrder_1.default.find({ vendorId, companyId })
        .sort({ createdAt: -1 }).limit(10);
    return { ...vendor.toJSON(), recentOrders };
};
exports.getVendorById = getVendorById;
const updateVendor = async (companyId, vendorId, data) => {
    if (data.code) {
        const dup = await Vendor_1.default.findOne({ companyId, code: data.code, _id: { $ne: vendorId } });
        if (dup)
            throw new appError_1.default(409, 'CONFLICT', 'Vendor code already exists');
    }
    const vendor = await Vendor_1.default.findOneAndUpdate({ _id: vendorId, companyId }, data, { new: true, runValidators: true });
    if (!vendor)
        throw new appError_1.default(404, 'NOT_FOUND', 'Vendor not found');
    return vendor;
};
exports.updateVendor = updateVendor;
const removeVendor = async (companyId, vendorId) => {
    const vendor = await Vendor_1.default.findOneAndDelete({ _id: vendorId, companyId });
    if (!vendor)
        throw new appError_1.default(404, 'NOT_FOUND', 'Vendor not found');
    return { success: true };
};
exports.removeVendor = removeVendor;
const getVendorPurchaseHistory = async (companyId, vendorId) => {
    const vendor = await Vendor_1.default.findOne({ _id: vendorId, companyId });
    if (!vendor)
        throw new appError_1.default(404, 'NOT_FOUND', 'Vendor not found');
    const orders = await PurchaseOrder_1.default.find({ vendorId, companyId }).sort({ createdAt: -1 });
    return { vendor, orders };
};
exports.getVendorPurchaseHistory = getVendorPurchaseHistory;
const listRFQs = async (companyId, query) => {
    const { status, search } = query;
    const filter = { companyId };
    if (status)
        filter.status = status;
    if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [{ title: regex }, { rfqNumber: regex }];
    }
    const { skip, limit: l, page: p } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const [data, total] = await Promise.all([
        RFQ_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l),
        RFQ_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, p, l) };
};
exports.listRFQs = listRFQs;
const createRFQ = async (companyId, userId, data) => {
    const count = await RFQ_1.default.countDocuments({ companyId });
    const rfqNumber = (0, helpers_1.generateCode)('RFQ', count + 1);
    return RFQ_1.default.create({ ...data, rfqNumber, companyId, createdBy: userId });
};
exports.createRFQ = createRFQ;
const getRFQById = async (companyId, rfqId) => {
    const rfq = await RFQ_1.default.findOne({ _id: rfqId, companyId });
    if (!rfq)
        throw new appError_1.default(404, 'NOT_FOUND', 'RFQ not found');
    const quotes = await Quote_1.default.find({ rfqId }).populate('vendorId', 'name code');
    return { ...rfq.toJSON(), quotes };
};
exports.getRFQById = getRFQById;
const updateRFQ = async (companyId, rfqId, data) => {
    const rfq = await RFQ_1.default.findOne({ _id: rfqId, companyId });
    if (!rfq)
        throw new appError_1.default(404, 'NOT_FOUND', 'RFQ not found');
    if (rfq.status !== 'DRAFT')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Only DRAFT RFQs can be edited');
    Object.assign(rfq, data);
    return rfq.save();
};
exports.updateRFQ = updateRFQ;
const removeRFQ = async (companyId, rfqId) => {
    const rfq = await RFQ_1.default.findOne({ _id: rfqId, companyId });
    if (!rfq)
        throw new appError_1.default(404, 'NOT_FOUND', 'RFQ not found');
    if (rfq.status !== 'DRAFT')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Only DRAFT RFQs can be deleted');
    await Quote_1.default.deleteMany({ rfqId });
    return RFQ_1.default.deleteOne({ _id: rfqId });
};
exports.removeRFQ = removeRFQ;
const sendRFQ = async (companyId, rfqId, { vendorIds, message: _message }) => {
    const rfq = await RFQ_1.default.findOne({ _id: rfqId, companyId });
    if (!rfq)
        throw new appError_1.default(404, 'NOT_FOUND', 'RFQ not found');
    rfq.status = 'SENT';
    await rfq.save();
    for (const vendorId of vendorIds) {
        await Quote_1.default.create({
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
exports.sendRFQ = sendRFQ;
const getRFQQuotes = async (companyId, rfqId) => {
    const rfq = await RFQ_1.default.findOne({ _id: rfqId, companyId });
    if (!rfq)
        throw new appError_1.default(404, 'NOT_FOUND', 'RFQ not found');
    return Quote_1.default.find({ rfqId }).populate('vendorId', 'name code email phone');
};
exports.getRFQQuotes = getRFQQuotes;
const createPOFromQuote = async (companyId, userId, data) => {
    const quote = await Quote_1.default.findById(data.quoteId).populate('rfqId');
    if (!quote)
        throw new appError_1.default(404, 'NOT_FOUND', 'Quote not found');
    if (quote.companyId.toString() !== companyId.toString()) {
        throw new appError_1.default(403, 'FORBIDDEN', 'Quote does not belong to this company');
    }
    const count = await PurchaseOrder_1.default.countDocuments({ companyId });
    const poNumber = (0, helpers_1.generateCode)('PO', count + 1);
    const rfqItems = quote.rfqId.items;
    const items = quote.items.map(item => {
        const rfqItem = rfqItems?.find(i => i._id.toString() === item.rfqItemId?.toString());
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
    return PurchaseOrder_1.default.create({
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
exports.createPOFromQuote = createPOFromQuote;
const listPOs = async (companyId, query) => {
    const { status, vendorId, search } = query;
    const filter = { companyId };
    if (status)
        filter.status = status;
    if (vendorId)
        filter.vendorId = vendorId;
    if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [{ poNumber: regex }, { notes: regex }];
    }
    const { skip, limit: l, page: p } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const [data, total] = await Promise.all([
        PurchaseOrder_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).populate('vendorId', 'name code'),
        PurchaseOrder_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, p, l) };
};
exports.listPOs = listPOs;
const createPO = async (companyId, userId, data) => {
    const count = await PurchaseOrder_1.default.countDocuments({ companyId });
    const poNumber = (0, helpers_1.generateCode)('PO', count + 1);
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
    return PurchaseOrder_1.default.create({
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
exports.createPO = createPO;
const getPOById = async (companyId, poId) => {
    const po = await PurchaseOrder_1.default.findOne({ _id: poId, companyId }).populate('vendorId', 'name code email phone');
    if (!po)
        throw new appError_1.default(404, 'NOT_FOUND', 'Purchase order not found');
    return po;
};
exports.getPOById = getPOById;
const updatePO = async (companyId, poId, data) => {
    const po = await PurchaseOrder_1.default.findOne({ _id: poId, companyId });
    if (!po)
        throw new appError_1.default(404, 'NOT_FOUND', 'Purchase order not found');
    if (po.status !== 'DRAFT')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Only DRAFT orders can be edited');
    if (data.expectedDate)
        po.expectedDate = data.expectedDate;
    if (data.notes !== undefined)
        po.notes = data.notes;
    return po.save();
};
exports.updatePO = updatePO;
const submitPO = async (companyId, poId) => {
    const po = await PurchaseOrder_1.default.findOne({ _id: poId, companyId });
    if (!po)
        throw new appError_1.default(404, 'NOT_FOUND', 'Purchase order not found');
    if (po.status !== 'DRAFT')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Only DRAFT orders can be submitted');
    po.status = 'PENDING_APPROVAL';
    return po.save();
};
exports.submitPO = submitPO;
const approvePO = async (companyId, poId, userId) => {
    const po = await PurchaseOrder_1.default.findOne({ _id: poId, companyId });
    if (!po)
        throw new appError_1.default(404, 'NOT_FOUND', 'Purchase order not found');
    if (po.status !== 'PENDING_APPROVAL')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Order must be PENDING_APPROVAL');
    po.status = 'APPROVED';
    po.approvedBy = userId;
    po.approvedAt = new Date();
    return po.save();
};
exports.approvePO = approvePO;
const rejectPO = async (companyId, poId, _reason) => {
    const po = await PurchaseOrder_1.default.findOne({ _id: poId, companyId });
    if (!po)
        throw new appError_1.default(404, 'NOT_FOUND', 'Purchase order not found');
    if (po.status !== 'PENDING_APPROVAL')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Order must be PENDING_APPROVAL');
    po.status = 'REJECTED';
    po.rejectedAt = new Date();
    return po.save();
};
exports.rejectPO = rejectPO;
const cancelPO = async (companyId, poId, reason) => {
    const po = await PurchaseOrder_1.default.findOne({ _id: poId, companyId });
    if (!po)
        throw new appError_1.default(404, 'NOT_FOUND', 'Purchase order not found');
    if (['RECEIVED', 'CANCELLED'].includes(po.status)) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Order cannot be cancelled');
    }
    po.status = 'CANCELLED';
    po.cancelledAt = new Date();
    po.cancelReason = reason || '';
    return po.save();
};
exports.cancelPO = cancelPO;
const createReceipt = async (companyId, userId, poId, data) => {
    const po = await PurchaseOrder_1.default.findOne({ _id: poId, companyId });
    if (!po)
        throw new appError_1.default(404, 'NOT_FOUND', 'Purchase order not found');
    if (!['APPROVED', 'PARTIALLY_RECEIVED', 'SENT'].includes(po.status)) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Order cannot receive goods in current status');
    }
    const count = await GoodsReceipt_1.default.countDocuments({ companyId });
    const grNumber = (0, helpers_1.generateCode)('GR', count + 1);
    const grItems = [];
    for (const item of data.items) {
        const poItem = po.items.find(i => String(i._id) === String(item.poItemId));
        if (!poItem)
            throw new appError_1.default(404, 'NOT_FOUND', `PO item ${item.poItemId} not found`);
        const newReceived = Math.min(item.quantity, poItem.quantity - poItem.receivedQty);
        if (newReceived <= 0)
            throw new appError_1.default(400, 'BAD_REQUEST', `Item ${poItem.description} is fully received`);
        await updateStock(companyId, String(poItem.productId), data.warehouseId, newReceived, userId, `PO ${po.poNumber}`);
        poItem.receivedQty = poItem.receivedQty + newReceived;
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
    const receipt = await GoodsReceipt_1.default.create({
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
exports.createReceipt = createReceipt;
const updateStock = async (companyId, productId, warehouseId, quantity, userId, reference) => {
    if (!productId)
        return;
    let stock = await Stock_1.default.findOne({ productId, warehouseId, companyId });
    if (!stock) {
        stock = await Stock_1.default.create({ productId, warehouseId, companyId, quantity: 0 });
    }
    const qtyBefore = stock.quantity || 0;
    stock.quantity = qtyBefore + quantity;
    await stock.save();
    await StockMovement_1.default.create({
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
    const po = await PurchaseOrder_1.default.findOne({ _id: poId, companyId });
    if (!po)
        throw new appError_1.default(404, 'NOT_FOUND', 'Purchase order not found');
    return GoodsReceipt_1.default.find({ poId }).sort({ createdAt: -1 });
};
exports.getReceipts = getReceipts;
const exportPOs = async (companyId, query) => {
    const filter = { companyId };
    if (query.status)
        filter.status = query.status;
    if (query.vendorId)
        filter.vendorId = query.vendorId;
    return PurchaseOrder_1.default.find(filter).sort({ createdAt: -1 }).populate('vendorId', 'name code email');
};
exports.exportPOs = exportPOs;
//# sourceMappingURL=procurement.service.js.map