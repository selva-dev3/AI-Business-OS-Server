const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductVariant = require('../models/ProductVariant');
const Warehouse = require('../models/Warehouse');
const Stock = require('../models/Stock');
const StockMovement = require('../models/StockMovement');
const StockTransfer = require('../models/StockTransfer');
const AppError = require('../utils/appError');
const { paginateQuery, buildMeta, buildSearchQuery } = require('../utils/helpers');

// ─── Products ──────────────────────────────────────────────────────────

const listProducts = async (query, companyId) => {
  const { search, categoryId, type, lowStock, page, limit } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, limit);

  const filter = { companyId };
  if (categoryId) filter.categoryId = categoryId;
  if (type) filter.type = type;
  if (search) Object.assign(filter, buildSearchQuery(search, ['name', 'sku', 'barcode']));

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
    Product.countDocuments(filter),
  ]);

  if (lowStock === 'true') {
    const productIds = products.map((p) => p._id);
    const stockAgg = await Stock.aggregate([
      { $match: { companyId: companyId, productId: { $in: productIds } } },
      { $group: { _id: '$productId', totalQty: { $sum: '$quantity' } } },
    ]);
    const stockMap = {};
    stockAgg.forEach((s) => { stockMap[s._id.toString()] = s.totalQty; });
    const filtered = products.filter((p) => {
      const qty = stockMap[p._id.toString()] || 0;
      return qty <= (p.reorderPoint || 0);
    });
    return { data: filtered, meta: buildMeta(filtered.length, p, l) };
  }

  return { data: products, meta: buildMeta(total, p, l) };
};

const createProduct = async (data, companyId) => {
  const existing = await Product.findOne({ companyId, sku: data.sku });
  if (existing) throw new AppError(409, 'Duplicate', 'Product with this SKU already exists');
  const product = await Product.create({ ...data, companyId });
  return product;
};

const getProductById = async (id, companyId) => {
  const product = await Product.findOne({ _id: id, companyId }).lean();
  if (!product) throw new AppError(404, 'Not Found', 'Product not found');

  const [variants, stockLevels] = await Promise.all([
    ProductVariant.find({ productId: id }).lean(),
    Stock.find({ productId: id, companyId }).populate('warehouseId', 'name code').lean(),
  ]);

  return { ...product, variants, stockLevels };
};

const updateProduct = async (id, data, companyId) => {
  if (data.sku) {
    const dup = await Product.findOne({ companyId, sku: data.sku, _id: { $ne: id } });
    if (dup) throw new AppError(409, 'Duplicate', 'Product with this SKU already exists');
  }
  const product = await Product.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError(404, 'Not Found', 'Product not found');
  return product;
};

const removeProduct = async (id, companyId) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, companyId },
    { isActive: false },
    { new: true }
  );
  if (!product) throw new AppError(404, 'Not Found', 'Product not found');
  return product;
};

const getStockHistory = async (productId, companyId, query) => {
  const { page, limit } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, limit);

  const filter = { productId, companyId };
  const [movements, total] = await Promise.all([
    StockMovement.find(filter)
      .populate('warehouseId', 'name code')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .lean(),
    StockMovement.countDocuments(filter),
  ]);

  return { data: movements, meta: buildMeta(total, p, l) };
};

const getLowStock = async (companyId) => {
  const products = await Product.find({ companyId, isActive: true }).lean();
  const productIds = products.map((p) => p._id);

  const stockAgg = await Stock.aggregate([
    { $match: { companyId, productId: { $in: productIds } } },
    { $group: { _id: '$productId', totalQty: { $sum: '$quantity' } } },
  ]);
  const stockMap = {};
  stockAgg.forEach((s) => { stockMap[s._id.toString()] = s.totalQty; });

  return products
    .filter((p) => {
      const qty = stockMap[p._id.toString()] || 0;
      return qty <= (p.reorderPoint || 0);
    })
    .map((p) => ({
      ...p,
      currentStock: stockMap[p._id.toString()] || 0,
    }));
};

// ─── Categories ─────────────────────────────────────────────────────────

const listCategories = async (companyId) => {
  const categories = await ProductCategory.find({ companyId, isActive: true }).sort({ name: 1 }).lean();

  const productCounts = await Product.aggregate([
    { $match: { companyId, isActive: true } },
    { $group: { _id: '$categoryId', count: { $sum: 1 } } },
  ]);
  const countMap = {};
  productCounts.forEach((c) => { countMap[c._id?.toString()] = c.count; });

  const buildTree = (parentId = null) =>
    categories
      .filter((c) => (c.parentId ? c.parentId.toString() : null) === (parentId ? parentId.toString() : null))
      .map((c) => ({
        ...c,
        productCount: countMap[c._id.toString()] || 0,
        children: buildTree(c._id),
      }));

  return buildTree(null);
};

const createCategory = async (data, companyId) => {
  const existing = await ProductCategory.findOne({ companyId, code: data.code });
  if (existing) throw new AppError(409, 'Duplicate', 'Category code already exists');
  const category = await ProductCategory.create({ ...data, companyId });
  return category;
};

const updateCategory = async (id, data, companyId) => {
  if (data.code) {
    const dup = await ProductCategory.findOne({ companyId, code: data.code, _id: { $ne: id } });
    if (dup) throw new AppError(409, 'Duplicate', 'Category code already exists');
  }
  const category = await ProductCategory.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new AppError(404, 'Not Found', 'Category not found');
  return category;
};

const removeCategory = async (id, companyId) => {
  await ProductCategory.findOneAndUpdate({ _id: id, companyId }, { isActive: false });
  await Product.updateMany({ categoryId: id, companyId }, { categoryId: null });
};

// ─── Warehouses ─────────────────────────────────────────────────────────

const listWarehouses = async (companyId) => {
  const warehouses = await Warehouse.find({ companyId, isActive: true }).sort({ name: 1 }).lean();
  const warehouseIds = warehouses.map((w) => w._id);

  const stockStats = await Stock.aggregate([
    { $match: { companyId, warehouseId: { $in: warehouseIds } } },
    {
      $group: {
        _id: '$warehouseId',
        totalProducts: { $sum: { $cond: [{ $gt: ['$quantity', 0] }, 1, 0] } },
        totalStockValue: { $sum: 0 },
      },
    },
  ]);

  const productPrices = await Product.find({ companyId, isActive: true }).select('_id costPrice').lean();
  const priceMap = {};
  productPrices.forEach((p) => { priceMap[p._id.toString()] = p.costPrice || 0; });

  const allStock = await Stock.find({ companyId, warehouseId: { $in: warehouseIds } }).lean();
  const valueMap = {};
  allStock.forEach((s) => {
    const wid = s.warehouseId.toString();
    valueMap[wid] = (valueMap[wid] || 0) + s.quantity * (priceMap[s.productId.toString()] || 0);
  });

  const statsMap = {};
  stockStats.forEach((s) => { statsMap[s._id.toString()] = s; });

  return warehouses.map((w) => ({
    ...w,
    totalProducts: statsMap[w._id.toString()]?.totalProducts || 0,
    totalStockValue: valueMap[w._id.toString()] || 0,
  }));
};

const createWarehouse = async (data, companyId) => {
  const existing = await Warehouse.findOne({ companyId, code: data.code });
  if (existing) throw new AppError(409, 'Duplicate', 'Warehouse code already exists');
  const warehouse = await Warehouse.create({ ...data, companyId });
  return warehouse;
};

const updateWarehouse = async (id, data, companyId) => {
  if (data.code) {
    const dup = await Warehouse.findOne({ companyId, code: data.code, _id: { $ne: id } });
    if (dup) throw new AppError(409, 'Duplicate', 'Warehouse code already exists');
  }
  const warehouse = await Warehouse.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!warehouse) throw new AppError(404, 'Not Found', 'Warehouse not found');
  return warehouse;
};

const getWarehouseStock = async (warehouseId, companyId, query) => {
  const { page, limit, lowStock } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, limit);

  const filter = { warehouseId, companyId };
  const [stockItems, total] = await Promise.all([
    Stock.find(filter)
      .populate('productId', 'name sku type costPrice sellingPrice reorderPoint minStockLevel unit')
      .skip(skip)
      .limit(l)
      .lean(),
    Stock.countDocuments(filter),
  ]);

  let data = stockItems;
  if (lowStock === 'true') {
    data = data.filter((s) => {
      const product = s.productId;
      return product && s.quantity <= (product.reorderPoint || 0);
    });
  }

  return { data, meta: buildMeta(total, p, l) };
};

// ─── Stock ──────────────────────────────────────────────────────────────

const getStock = async (companyId, query) => {
  const { warehouseId, productId, lowStock, page, limit, productSearch } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, limit);

  const filter = { companyId };
  if (warehouseId) filter.warehouseId = warehouseId;
  if (productId) filter.productId = productId;

  let match = {};
  let stockItems = await Stock.find(filter)
    .populate('productId', 'name sku type costPrice sellingPrice reorderPoint minStockLevel unit isActive')
    .populate('warehouseId', 'name code')
    .sort({ createdAt: -1 })
    .lean();

  if (productSearch) {
    const regex = new RegExp(productSearch, 'i');
    stockItems = stockItems.filter(
      (s) => s.productId && (regex.test(s.productId.name) || regex.test(s.productId.sku))
    );
  }

  if (lowStock === 'true') {
    stockItems = stockItems.filter((s) => {
      const p = s.productId;
      return p && s.quantity <= (p.reorderPoint || 0);
    });
  }

  const total = stockItems.length;
  const paginated = stockItems.slice(skip, skip + l);

  return { data: paginated, meta: buildMeta(total, p, l) };
};

const adjustStock = async (data, companyId, userId) => {
  const { productId, warehouseId, type, quantity, movementType, reason, reference } = data;

  let stock = await Stock.findOne({ productId, warehouseId, companyId });
  if (!stock) {
    stock = await Stock.create({ productId, warehouseId, companyId, quantity: 0, reservedQty: 0 });
  }

  const quantityBefore = stock.quantity;
  const adjustment = type === 'ADD' ? quantity : -quantity;
  const quantityAfter = quantityBefore + adjustment;

  if (quantityAfter < 0) throw new AppError(400, 'Bad Request', 'Insufficient stock');

  stock.quantity = quantityAfter;
  await stock.save();

  await StockMovement.create({
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

const getMovements = async (companyId, query) => {
  const { productId, warehouseId, type, fromDate, toDate, page, limit } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, limit);

  const filter = { companyId };
  if (productId) filter.productId = productId;
  if (warehouseId) filter.warehouseId = warehouseId;
  if (type) filter.type = type;
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate) filter.createdAt.$lte = new Date(toDate);
  }

  const [movements, total] = await Promise.all([
    StockMovement.find(filter)
      .populate('productId', 'name sku')
      .populate('warehouseId', 'name code')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .lean(),
    StockMovement.countDocuments(filter),
  ]);

  return { data: movements, meta: buildMeta(total, p, l) };
};

// ─── Transfers ──────────────────────────────────────────────────────────

const createTransfer = async (data, companyId, userId) => {
  if (data.fromWarehouseId === data.toWarehouseId) {
    throw new AppError(400, 'Bad Request', 'Source and destination warehouses must be different');
  }

  const transfer = await StockTransfer.create({
    ...data,
    companyId,
    requestedBy: userId,
  });

  return transfer.populate(['fromWarehouseId', 'toWarehouseId', 'items.productId']);
};

const listTransfers = async (companyId, query) => {
  const { status, page, limit } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, limit);

  const filter = { companyId };
  if (status) filter.status = status;

  const [transfers, total] = await Promise.all([
    StockTransfer.find(filter)
      .populate('fromWarehouseId', 'name code')
      .populate('toWarehouseId', 'name code')
      .populate('items.productId', 'name sku')
      .populate('requestedBy', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .lean(),
    StockTransfer.countDocuments(filter),
  ]);

  return { data: transfers, meta: buildMeta(total, p, l) };
};

const approveTransfer = async (id, companyId, userId) => {
  const transfer = await StockTransfer.findOne({ _id: id, companyId });
  if (!transfer) throw new AppError(404, 'Not Found', 'Transfer not found');
  if (transfer.status !== 'DRAFT') throw new AppError(400, 'Bad Request', 'Only DRAFT transfers can be approved');

  transfer.status = 'APPROVED';
  transfer.approvedBy = userId;
  transfer.approvedAt = new Date();
  await transfer.save();

  return transfer;
};

const completeTransfer = async (id, companyId, userId) => {
  const transfer = await StockTransfer.findOne({ _id: id, companyId }).populate('items');
  if (!transfer) throw new AppError(404, 'Not Found', 'Transfer not found');
  if (transfer.status !== 'APPROVED') throw new AppError(400, 'Bad Request', 'Only APPROVED transfers can be completed');

  for (const item of transfer.items) {
    const fromStock = await Stock.findOne({
      productId: item.productId,
      warehouseId: transfer.fromWarehouseId,
      companyId,
    });
    if (!fromStock || fromStock.quantity < item.quantity) {
      const product = await Product.findById(item.productId).select('name');
      throw new AppError(400, 'Insufficient Stock', `Insufficient stock for ${product?.name || item.productId}`);
    }
  }

  for (const item of transfer.items) {
    const fromStock = await Stock.findOne({ productId: item.productId, warehouseId: transfer.fromWarehouseId, companyId });
    const toStock = await Stock.findOne({ productId: item.productId, warehouseId: transfer.toWarehouseId, companyId });

    const fromBefore = fromStock.quantity;
    fromStock.quantity -= item.quantity;
    await fromStock.save();

    if (toStock) {
      const toBefore = toStock.quantity;
      toStock.quantity += item.quantity;
      await toStock.save();
      await StockMovement.create({
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
    } else {
      await Stock.create({
        productId: item.productId,
        warehouseId: transfer.toWarehouseId,
        companyId,
        quantity: item.quantity,
      });
      await StockMovement.create({
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

    await StockMovement.create({
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

module.exports = {
  listProducts,
  createProduct,
  getProductById,
  updateProduct,
  removeProduct,
  getStockHistory,
  getLowStock,
  listCategories,
  createCategory,
  updateCategory,
  removeCategory,
  listWarehouses,
  createWarehouse,
  updateWarehouse,
  getWarehouseStock,
  getStock,
  adjustStock,
  getMovements,
  createTransfer,
  listTransfers,
  approveTransfer,
  completeTransfer,
};
