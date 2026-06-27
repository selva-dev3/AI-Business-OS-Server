"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeTransfer = exports.approveTransfer = exports.listTransfers = exports.createTransfer = exports.getMovements = exports.adjustStock = exports.getStock = exports.getWarehouseStock = exports.updateWarehouse = exports.createWarehouse = exports.listWarehouses = exports.removeCategory = exports.updateCategory = exports.createCategory = exports.listCategories = exports.getLowStock = exports.getStockHistory = exports.removeProduct = exports.updateProduct = exports.getProductById = exports.createProduct = exports.listProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const ProductCategory_1 = __importDefault(require("../models/ProductCategory"));
const ProductVariant_1 = __importDefault(require("../models/ProductVariant"));
const Warehouse_1 = __importDefault(require("../models/Warehouse"));
const Stock_1 = __importDefault(require("../models/Stock"));
const StockMovement_1 = __importDefault(require("../models/StockMovement"));
const StockTransfer_1 = __importDefault(require("../models/StockTransfer"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const listProducts = async (query, companyId) => {
    const { search, categoryId, type, lowStock, page, limit } = query;
    const { skip, limit: l, page: p } = (0, helpers_1.paginateQuery)(page, Number(limit));
    const filter = { companyId };
    if (categoryId)
        filter.categoryId = categoryId;
    if (type)
        filter.type = type;
    if (search)
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(search, ['name', 'sku', 'barcode']));
    const [products, total] = await Promise.all([
        Product_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
        Product_1.default.countDocuments(filter),
    ]);
    if (lowStock === 'true') {
        const productIds = products.map((p) => p._id);
        const stockAgg = await Stock_1.default.aggregate([
            { $match: { companyId: companyId, productId: { $in: productIds } } },
            { $group: { _id: '$productId', totalQty: { $sum: '$quantity' } } },
        ]);
        const stockMap = {};
        stockAgg.forEach((s) => { stockMap[String(s._id)] = s.totalQty; });
        const filtered = products.filter((p) => {
            const qty = stockMap[String(p._id)] || 0;
            return qty <= (p.reorderPoint || 0);
        });
        return { data: filtered, meta: (0, helpers_1.buildMeta)(filtered.length, p, l) };
    }
    return { data: products, meta: (0, helpers_1.buildMeta)(total, p, l) };
};
exports.listProducts = listProducts;
const createProduct = async (data, companyId) => {
    const existing = await Product_1.default.findOne({ companyId, sku: data.sku });
    if (existing)
        throw new appError_1.default(409, 'Duplicate', 'Product with this SKU already exists');
    const product = await Product_1.default.create({ ...data, companyId });
    return product;
};
exports.createProduct = createProduct;
const getProductById = async (id, companyId) => {
    const product = await Product_1.default.findOne({ _id: id, companyId }).lean();
    if (!product)
        throw new appError_1.default(404, 'Not Found', 'Product not found');
    const [variants, stockLevels] = await Promise.all([
        ProductVariant_1.default.find({ productId: id }).lean(),
        Stock_1.default.find({ productId: id, companyId }).populate('warehouseId', 'name code').lean(),
    ]);
    return { ...product, variants, stockLevels };
};
exports.getProductById = getProductById;
const updateProduct = async (id, data, companyId) => {
    if (data.sku) {
        const dup = await Product_1.default.findOne({ companyId, sku: data.sku, _id: { $ne: id } });
        if (dup)
            throw new appError_1.default(409, 'Duplicate', 'Product with this SKU already exists');
    }
    const product = await Product_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!product)
        throw new appError_1.default(404, 'Not Found', 'Product not found');
    return product;
};
exports.updateProduct = updateProduct;
const removeProduct = async (id, companyId) => {
    const product = await Product_1.default.findOneAndUpdate({ _id: id, companyId }, { isActive: false }, { new: true });
    if (!product)
        throw new appError_1.default(404, 'Not Found', 'Product not found');
    return product;
};
exports.removeProduct = removeProduct;
const getStockHistory = async (productId, companyId, query) => {
    const { page, limit } = query;
    const { skip, limit: l, page: p } = (0, helpers_1.paginateQuery)(page, Number(limit));
    const filter = { productId, companyId };
    const [movements, total] = await Promise.all([
        StockMovement_1.default.find(filter)
            .populate('warehouseId', 'name code')
            .populate('createdBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(l)
            .lean(),
        StockMovement_1.default.countDocuments(filter),
    ]);
    return { data: movements, meta: (0, helpers_1.buildMeta)(total, p, l) };
};
exports.getStockHistory = getStockHistory;
const getLowStock = async (companyId) => {
    const products = await Product_1.default.find({ companyId, isActive: true }).lean();
    const productIds = products.map((p) => p._id);
    const stockAgg = await Stock_1.default.aggregate([
        { $match: { companyId, productId: { $in: productIds } } },
        { $group: { _id: '$productId', totalQty: { $sum: '$quantity' } } },
    ]);
    const stockMap = {};
    stockAgg.forEach((s) => { stockMap[String(s._id)] = s.totalQty; });
    return products
        .filter((p) => {
        const qty = stockMap[String(p._id)] || 0;
        return qty <= (p.reorderPoint || 0);
    })
        .map((p) => ({
        ...p,
        currentStock: stockMap[String(p._id)] || 0,
    }));
};
exports.getLowStock = getLowStock;
const listCategories = async (companyId) => {
    const categories = await ProductCategory_1.default.find({ companyId, isActive: true }).sort({ name: 1 }).lean();
    const productCounts = await Product_1.default.aggregate([
        { $match: { companyId, isActive: true } },
        { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    productCounts.forEach((c) => { countMap[String(c._id)] = c.count; });
    const buildTree = (parentId = null) => categories
        .filter((c) => String(c.parentId) === (parentId ? parentId.toString() : null))
        .map((c) => ({
        ...c,
        productCount: countMap[String(c._id)] || 0,
        children: buildTree(String(c._id)),
    }));
    return buildTree(null);
};
exports.listCategories = listCategories;
const createCategory = async (data, companyId) => {
    const existing = await ProductCategory_1.default.findOne({ companyId, code: data.code });
    if (existing)
        throw new appError_1.default(409, 'Duplicate', 'Category code already exists');
    const category = await ProductCategory_1.default.create({ ...data, companyId });
    return category;
};
exports.createCategory = createCategory;
const updateCategory = async (id, data, companyId) => {
    if (data.code) {
        const dup = await ProductCategory_1.default.findOne({ companyId, code: data.code, _id: { $ne: id } });
        if (dup)
            throw new appError_1.default(409, 'Duplicate', 'Category code already exists');
    }
    const category = await ProductCategory_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!category)
        throw new appError_1.default(404, 'Not Found', 'Category not found');
    return category;
};
exports.updateCategory = updateCategory;
const removeCategory = async (id, companyId) => {
    await ProductCategory_1.default.findOneAndUpdate({ _id: id, companyId }, { isActive: false });
    await Product_1.default.updateMany({ categoryId: id, companyId }, { categoryId: null });
};
exports.removeCategory = removeCategory;
const listWarehouses = async (companyId) => {
    const warehouses = await Warehouse_1.default.find({ companyId, isActive: true }).sort({ name: 1 }).lean();
    const warehouseIds = warehouses.map((w) => w._id);
    const stockStats = await Stock_1.default.aggregate([
        { $match: { companyId, warehouseId: { $in: warehouseIds } } },
        {
            $group: {
                _id: '$warehouseId',
                totalProducts: { $sum: { $cond: [{ $gt: ['$quantity', 0] }, 1, 0] } },
                totalStockValue: { $sum: 0 },
            },
        },
    ]);
    const productPrices = await Product_1.default.find({ companyId, isActive: true }).select('_id costPrice').lean();
    const priceMap = {};
    productPrices.forEach((p) => { priceMap[String(p._id)] = p.costPrice || 0; });
    const allStock = await Stock_1.default.find({ companyId, warehouseId: { $in: warehouseIds } }).lean();
    const valueMap = {};
    allStock.forEach((s) => {
        const wid = String(s.warehouseId);
        valueMap[wid] = (valueMap[wid] || 0) + (s.quantity || 0) * (priceMap[String(s.productId)] || 0);
    });
    const statsMap = {};
    stockStats.forEach((s) => { statsMap[String(s._id)] = s; });
    return warehouses.map((w) => ({
        ...w,
        totalProducts: statsMap[String(w._id)]?.totalProducts || 0,
        totalStockValue: valueMap[String(w._id)] || 0,
    }));
};
exports.listWarehouses = listWarehouses;
const createWarehouse = async (data, companyId) => {
    const existing = await Warehouse_1.default.findOne({ companyId, code: data.code });
    if (existing)
        throw new appError_1.default(409, 'Duplicate', 'Warehouse code already exists');
    const warehouse = await Warehouse_1.default.create({ ...data, companyId });
    return warehouse;
};
exports.createWarehouse = createWarehouse;
const updateWarehouse = async (id, data, companyId) => {
    if (data.code) {
        const dup = await Warehouse_1.default.findOne({ companyId, code: data.code, _id: { $ne: id } });
        if (dup)
            throw new appError_1.default(409, 'Duplicate', 'Warehouse code already exists');
    }
    const warehouse = await Warehouse_1.default.findOneAndUpdate({ _id: id, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!warehouse)
        throw new appError_1.default(404, 'Not Found', 'Warehouse not found');
    return warehouse;
};
exports.updateWarehouse = updateWarehouse;
const getWarehouseStock = async (warehouseId, companyId, query) => {
    const { page, limit, lowStock } = query;
    const { skip, limit: l, page: p } = (0, helpers_1.paginateQuery)(page, Number(limit));
    const filter = { warehouseId, companyId };
    const [stockItems, total] = await Promise.all([
        Stock_1.default.find(filter)
            .populate('productId', 'name sku type costPrice sellingPrice reorderPoint minStockLevel unit')
            .skip(skip)
            .limit(l)
            .lean(),
        Stock_1.default.countDocuments(filter),
    ]);
    let data = stockItems;
    if (lowStock === 'true') {
        data = data.filter((s) => {
            const product = s.productId;
            return product && (s.quantity || 0) <= (product.reorderPoint || 0);
        });
    }
    return { data, meta: (0, helpers_1.buildMeta)(total, p, l) };
};
exports.getWarehouseStock = getWarehouseStock;
const getStock = async (companyId, query) => {
    const { warehouseId, productId, lowStock, page, limit, productSearch } = query;
    const { skip, limit: l, page: p } = (0, helpers_1.paginateQuery)(page, Number(limit));
    const filter = { companyId };
    if (warehouseId)
        filter.warehouseId = warehouseId;
    if (productId)
        filter.productId = productId;
    let stockItems = await Stock_1.default.find(filter)
        .populate('productId', 'name sku type costPrice sellingPrice reorderPoint minStockLevel unit isActive')
        .populate('warehouseId', 'name code')
        .sort({ createdAt: -1 })
        .lean();
    if (productSearch) {
        const regex = new RegExp(productSearch, 'i');
        stockItems = stockItems.filter((s) => {
            const prod = s.productId;
            return prod && (regex.test(prod.name) || regex.test(prod.sku));
        });
    }
    if (lowStock === 'true') {
        stockItems = stockItems.filter((s) => {
            const prod = s.productId;
            return prod && (s.quantity || 0) <= (prod.reorderPoint || 0);
        });
    }
    const total = stockItems.length;
    const paginated = stockItems.slice(skip, skip + l);
    return { data: paginated, meta: (0, helpers_1.buildMeta)(total, p, l) };
};
exports.getStock = getStock;
const adjustStock = async (data, companyId, userId) => {
    const { productId, warehouseId, type, quantity, movementType, reason, reference } = data;
    let stock = await Stock_1.default.findOne({ productId, warehouseId, companyId });
    if (!stock) {
        stock = await Stock_1.default.create({ productId, warehouseId, companyId, quantity: 0, reservedQty: 0 });
    }
    const quantityBefore = stock.quantity || 0;
    const adjustment = type === 'ADD' ? quantity : -quantity;
    const quantityAfter = quantityBefore + adjustment;
    if (quantityAfter < 0)
        throw new appError_1.default(400, 'Bad Request', 'Insufficient stock');
    stock.quantity = quantityAfter;
    await stock.save();
    await StockMovement_1.default.create({
        productId,
        warehouseId,
        companyId,
        type: movementType,
        quantity: adjustment,
        quantityBefore,
        quantityAfter,
        reason,
        reference,
        createdBy: userId,
    });
    return stock;
};
exports.adjustStock = adjustStock;
const getMovements = async (companyId, query) => {
    const { productId, warehouseId, type, fromDate, toDate, page, limit } = query;
    const { skip, limit: l, page: p } = (0, helpers_1.paginateQuery)(page, Number(limit));
    const filter = { companyId };
    if (productId)
        filter.productId = productId;
    if (warehouseId)
        filter.warehouseId = warehouseId;
    if (type)
        filter.type = type;
    if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate)
            filter.createdAt.$gte = new Date(fromDate);
        if (toDate)
            filter.createdAt.$lte = new Date(toDate);
    }
    const [movements, total] = await Promise.all([
        StockMovement_1.default.find(filter)
            .populate('productId', 'name sku')
            .populate('warehouseId', 'name code')
            .populate('createdBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(l)
            .lean(),
        StockMovement_1.default.countDocuments(filter),
    ]);
    return { data: movements, meta: (0, helpers_1.buildMeta)(total, p, l) };
};
exports.getMovements = getMovements;
const createTransfer = async (data, companyId, userId) => {
    if (data.fromWarehouseId === data.toWarehouseId) {
        throw new appError_1.default(400, 'Bad Request', 'Source and destination warehouses must be different');
    }
    const transfer = await StockTransfer_1.default.create({
        ...data,
        companyId,
        requestedBy: userId,
    });
    return transfer.populate(['fromWarehouseId', 'toWarehouseId', 'items.productId']);
};
exports.createTransfer = createTransfer;
const listTransfers = async (companyId, query) => {
    const { status, page, limit } = query;
    const { skip, limit: l, page: p } = (0, helpers_1.paginateQuery)(page, Number(limit));
    const filter = { companyId };
    if (status)
        filter.status = status;
    const [transfers, total] = await Promise.all([
        StockTransfer_1.default.find(filter)
            .populate('fromWarehouseId', 'name code')
            .populate('toWarehouseId', 'name code')
            .populate('items.productId', 'name sku')
            .populate('requestedBy', 'firstName lastName')
            .populate('approvedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(l)
            .lean(),
        StockTransfer_1.default.countDocuments(filter),
    ]);
    return { data: transfers, meta: (0, helpers_1.buildMeta)(total, p, l) };
};
exports.listTransfers = listTransfers;
const approveTransfer = async (id, companyId, userId) => {
    const transfer = await StockTransfer_1.default.findOne({ _id: id, companyId });
    if (!transfer)
        throw new appError_1.default(404, 'Not Found', 'Transfer not found');
    if (transfer.status !== 'DRAFT')
        throw new appError_1.default(400, 'Bad Request', 'Only DRAFT transfers can be approved');
    transfer.status = 'APPROVED';
    transfer.approvedBy = userId;
    transfer.approvedAt = new Date();
    await transfer.save();
    return transfer;
};
exports.approveTransfer = approveTransfer;
const completeTransfer = async (id, companyId, userId) => {
    const transfer = await StockTransfer_1.default.findOne({ _id: id, companyId }).populate('items');
    if (!transfer)
        throw new appError_1.default(404, 'Not Found', 'Transfer not found');
    if (transfer.status !== 'APPROVED')
        throw new appError_1.default(400, 'Bad Request', 'Only APPROVED transfers can be completed');
    for (const item of transfer.items) {
        const fromStock = await Stock_1.default.findOne({
            productId: item.productId,
            warehouseId: transfer.fromWarehouseId,
            companyId,
        });
        if (!fromStock || (fromStock.quantity || 0) < item.quantity) {
            const product = await Product_1.default.findById(item.productId).select('name');
            throw new appError_1.default(400, 'Insufficient Stock', `Insufficient stock for ${product?.name || item.productId}`);
        }
    }
    for (const item of transfer.items) {
        const fromStock = await Stock_1.default.findOne({ productId: item.productId, warehouseId: transfer.fromWarehouseId, companyId });
        const toStock = await Stock_1.default.findOne({ productId: item.productId, warehouseId: transfer.toWarehouseId, companyId });
        const fromBefore = fromStock.quantity || 0;
        fromStock.quantity = fromBefore - item.quantity;
        await fromStock.save();
        if (toStock) {
            const toBefore = toStock.quantity || 0;
            toStock.quantity = toBefore + item.quantity;
            await toStock.save();
            await StockMovement_1.default.create({
                productId: item.productId,
                warehouseId: transfer.toWarehouseId,
                companyId,
                type: 'TRANSFER_IN',
                quantity: item.quantity,
                quantityBefore: toBefore,
                quantityAfter: toStock.quantity,
                reference: transfer._id.toString(),
                createdBy: userId,
            });
        }
        else {
            await Stock_1.default.create({
                productId: item.productId,
                warehouseId: transfer.toWarehouseId,
                companyId,
                quantity: item.quantity,
            });
            await StockMovement_1.default.create({
                productId: item.productId,
                warehouseId: transfer.toWarehouseId,
                companyId,
                type: 'TRANSFER_IN',
                quantity: item.quantity,
                quantityBefore: 0,
                quantityAfter: item.quantity,
                reference: transfer._id.toString(),
                createdBy: userId,
            });
        }
        await StockMovement_1.default.create({
            productId: item.productId,
            warehouseId: transfer.fromWarehouseId,
            companyId,
            type: 'TRANSFER_OUT',
            quantity: -item.quantity,
            quantityBefore: fromBefore,
            quantityAfter: fromStock.quantity,
            reference: transfer._id.toString(),
            createdBy: userId,
        });
    }
    transfer.status = 'RECEIVED';
    transfer.completedAt = new Date();
    await transfer.save();
    return transfer;
};
exports.completeTransfer = completeTransfer;
//# sourceMappingURL=inventory.service.js.map