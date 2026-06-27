import Product from '../models/Product';
import ProductCategory from '../models/ProductCategory';
import ProductVariant from '../models/ProductVariant';
import Warehouse from '../models/Warehouse';
import Stock from '../models/Stock';
import StockMovement from '../models/StockMovement';
import StockTransfer from '../models/StockTransfer';
import AppError from '../utils/appError';
import { paginateQuery, buildMeta, buildSearchQuery } from '../utils/helpers';

interface QueryParams {
  search?: string;
  categoryId?: string;
  type?: string;
  lowStock?: string;
  page?: string;
  limit?: string;
  productId?: string;
  warehouseId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  productSearch?: string;
}

const listProducts = async (query: QueryParams, companyId: string) => {
  const { search, categoryId, type, lowStock, page, limit } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, Number(limit));

  const filter: Record<string, unknown> = { companyId };
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
    const stockMap: Record<string, number> = {};
    (stockAgg as { _id: unknown; totalQty: number }[]).forEach((s) => { stockMap[String(s._id)] = s.totalQty; });
    const filtered = products.filter((p) => {
      const qty = stockMap[String(p._id)] || 0;
      return qty <= (p.reorderPoint || 0);
    });
    return { data: filtered, meta: buildMeta(filtered.length, p, l) };
  }

  return { data: products, meta: buildMeta(total, p, l) };
};

const createProduct = async (data: Record<string, unknown>, companyId: string) => {
  const existing = await Product.findOne({ companyId, sku: data.sku as string });
  if (existing) throw new AppError(409, 'Duplicate', 'Product with this SKU already exists');
  const product = await Product.create({ ...data, companyId });
  return product;
};

const getProductById = async (id: string, companyId: string): Promise<any> => {
  const product = await Product.findOne({ _id: id, companyId }).lean();
  if (!product) throw new AppError(404, 'Not Found', 'Product not found');

  const [variants, stockLevels] = await Promise.all([
    ProductVariant.find({ productId: id }).lean(),
    Stock.find({ productId: id, companyId }).populate('warehouseId', 'name code').lean(),
  ]);

  return { ...product, variants, stockLevels };
};

const updateProduct = async (id: string, data: Record<string, unknown>, companyId: string) => {
  if (data.sku) {
    const dup = await Product.findOne({ companyId, sku: data.sku as string, _id: { $ne: id } });
    if (dup) throw new AppError(409, 'Duplicate', 'Product with this SKU already exists');
  }
  const product = await Product.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError(404, 'Not Found', 'Product not found');
  return product;
};

const removeProduct = async (id: string, companyId: string) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, companyId },
    { isActive: false },
    { new: true }
  );
  if (!product) throw new AppError(404, 'Not Found', 'Product not found');
  return product;
};

const getStockHistory = async (productId: string, companyId: string, query: QueryParams) => {
  const { page, limit } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, Number(limit));

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

const getLowStock = async (companyId: string): Promise<any> => {
  const products = await Product.find({ companyId, isActive: true }).lean();
  const productIds = products.map((p) => p._id);

  const stockAgg = await Stock.aggregate([
    { $match: { companyId, productId: { $in: productIds } } },
    { $group: { _id: '$productId', totalQty: { $sum: '$quantity' } } },
  ]);
  const stockMap: Record<string, number> = {};
  (stockAgg as { _id: unknown; totalQty: number }[]).forEach((s) => { stockMap[String(s._id)] = s.totalQty; });

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

const listCategories = async (companyId: string) => {
  const categories = await ProductCategory.find({ companyId, isActive: true }).sort({ name: 1 }).lean();

  const productCounts = await Product.aggregate([
    { $match: { companyId, isActive: true } },
    { $group: { _id: '$categoryId', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  (productCounts as { _id: unknown; count: number }[]).forEach((c) => { countMap[String(c._id)] = c.count; });

  const buildTree = (parentId: string | null = null): Record<string, unknown>[] =>
    categories
      .filter((c) => String(c.parentId) === (parentId ? parentId.toString() : null))
      .map((c) => ({
        ...c,
        productCount: countMap[String(c._id)] || 0,
        children: buildTree(String(c._id)),
      }));

  return buildTree(null);
};

const createCategory = async (data: Record<string, unknown>, companyId: string) => {
  const existing = await ProductCategory.findOne({ companyId, code: data.code as string });
  if (existing) throw new AppError(409, 'Duplicate', 'Category code already exists');
  const category = await ProductCategory.create({ ...data, companyId });
  return category;
};

const updateCategory = async (id: string, data: Record<string, unknown>, companyId: string) => {
  if (data.code) {
    const dup = await ProductCategory.findOne({ companyId, code: data.code as string, _id: { $ne: id } });
    if (dup) throw new AppError(409, 'Duplicate', 'Category code already exists');
  }
  const category = await ProductCategory.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new AppError(404, 'Not Found', 'Category not found');
  return category;
};

const removeCategory = async (id: string, companyId: string) => {
  await ProductCategory.findOneAndUpdate({ _id: id, companyId }, { isActive: false });
  await Product.updateMany({ categoryId: id, companyId }, { categoryId: null });
};

const listWarehouses = async (companyId: string): Promise<any> => {
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
  const priceMap: Record<string, number> = {};
  productPrices.forEach((p) => { priceMap[String(p._id)] = p.costPrice || 0; });

  const allStock = await Stock.find({ companyId, warehouseId: { $in: warehouseIds } }).lean();
  const valueMap: Record<string, number> = {};
  allStock.forEach((s) => {
    const wid = String(s.warehouseId);
    valueMap[wid] = (valueMap[wid] || 0) + (s.quantity || 0) * (priceMap[String(s.productId)] || 0);
  });

  const statsMap: Record<string, { totalProducts: number }> = {};
  (stockStats as { _id: unknown; totalProducts: number }[]).forEach((s) => { statsMap[String(s._id)] = s; });

  return warehouses.map((w) => ({
    ...w,
    totalProducts: statsMap[String(w._id)]?.totalProducts || 0,
    totalStockValue: valueMap[String(w._id)] || 0,
  }));
};

const createWarehouse = async (data: Record<string, unknown>, companyId: string) => {
  const existing = await Warehouse.findOne({ companyId, code: data.code as string });
  if (existing) throw new AppError(409, 'Duplicate', 'Warehouse code already exists');
  const warehouse = await Warehouse.create({ ...data, companyId });
  return warehouse;
};

const updateWarehouse = async (id: string, data: Record<string, unknown>, companyId: string) => {
  if (data.code) {
    const dup = await Warehouse.findOne({ companyId, code: data.code as string, _id: { $ne: id } });
    if (dup) throw new AppError(409, 'Duplicate', 'Warehouse code already exists');
  }
  const warehouse = await Warehouse.findOneAndUpdate({ _id: id, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!warehouse) throw new AppError(404, 'Not Found', 'Warehouse not found');
  return warehouse;
};

const getWarehouseStock = async (warehouseId: string, companyId: string, query: QueryParams) => {
  const { page, limit, lowStock } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, Number(limit));

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
      const product = s.productId as unknown as Record<string, unknown> | undefined;
      return product && (s.quantity || 0) <= ((product.reorderPoint as number) || 0);
    });
  }

  return { data, meta: buildMeta(total, p, l) };
};

const getStock = async (companyId: string, query: QueryParams) => {
  const { warehouseId, productId, lowStock, page, limit, productSearch } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, Number(limit));

  const filter: Record<string, unknown> = { companyId };
  if (warehouseId) filter.warehouseId = warehouseId;
  if (productId) filter.productId = productId;

  let stockItems = await Stock.find(filter)
    .populate('productId', 'name sku type costPrice sellingPrice reorderPoint minStockLevel unit isActive')
    .populate('warehouseId', 'name code')
    .sort({ createdAt: -1 })
    .lean();

  if (productSearch) {
    const regex = new RegExp(productSearch, 'i');
    stockItems = stockItems.filter(
      (s) => {
        const prod = s.productId as unknown as Record<string, unknown> | undefined;
        return prod && (regex.test(prod.name as string) || regex.test(prod.sku as string));
      }
    );
  }

  if (lowStock === 'true') {
    stockItems = stockItems.filter((s) => {
      const prod = s.productId as unknown as Record<string, unknown> | undefined;
      return prod && (s.quantity || 0) <= ((prod.reorderPoint as number) || 0);
    });
  }

  const total = stockItems.length;
  const paginated = stockItems.slice(skip, skip + l);

  return { data: paginated, meta: buildMeta(total, p, l) };
};

const adjustStock = async (data: Record<string, unknown>, companyId: string, userId: string) => {
  const { productId, warehouseId, type, quantity, movementType, reason, reference } = data;

  let stock = await Stock.findOne({ productId, warehouseId, companyId });
  if (!stock) {
    stock = await Stock.create({ productId, warehouseId, companyId, quantity: 0, reservedQty: 0 });
  }

  const quantityBefore = stock.quantity || 0;
  const adjustment = type === 'ADD' ? (quantity as number) : -(quantity as number);
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

const getMovements = async (companyId: string, query: QueryParams) => {
  const { productId, warehouseId, type, fromDate, toDate, page, limit } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, Number(limit));

  const filter: Record<string, unknown> = { companyId };
  if (productId) filter.productId = productId;
  if (warehouseId) filter.warehouseId = warehouseId;
  if (type) filter.type = type;
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) (filter.createdAt as Record<string, unknown>).$gte = new Date(fromDate);
    if (toDate) (filter.createdAt as Record<string, unknown>).$lte = new Date(toDate);
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

const createTransfer = async (data: Record<string, unknown>, companyId: string, userId: string) => {
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

const listTransfers = async (companyId: string, query: QueryParams) => {
  const { status, page, limit } = query;
  const { skip, limit: l, page: p } = paginateQuery(page, Number(limit));

  const filter: Record<string, unknown> = { companyId };
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

const approveTransfer = async (id: string, companyId: string, userId: string) => {
  const transfer = await StockTransfer.findOne({ _id: id, companyId });
  if (!transfer) throw new AppError(404, 'Not Found', 'Transfer not found');
  if (transfer.status !== 'DRAFT') throw new AppError(400, 'Bad Request', 'Only DRAFT transfers can be approved');

  transfer.status = 'APPROVED';
  transfer.approvedBy = userId as any;
  transfer.approvedAt = new Date();
  await transfer.save();

  return transfer;
};

const completeTransfer = async (id: string, companyId: string, userId: string) => {
  const transfer = await StockTransfer.findOne({ _id: id, companyId }).populate('items');
  if (!transfer) throw new AppError(404, 'Not Found', 'Transfer not found');
  if (transfer.status !== 'APPROVED') throw new AppError(400, 'Bad Request', 'Only APPROVED transfers can be completed');

  for (const item of transfer.items as unknown as Record<string, unknown>[]) {
    const fromStock = await Stock.findOne({
      productId: item.productId,
      warehouseId: transfer.fromWarehouseId,
      companyId,
    });
    if (!fromStock || (fromStock.quantity || 0) < (item.quantity as number)) {
      const product = await Product.findById(item.productId).select('name');
      throw new AppError(400, 'Insufficient Stock', `Insufficient stock for ${(product as Record<string, unknown> | null)?.name || item.productId}`);
    }
  }

  for (const item of transfer.items as unknown as Record<string, unknown>[]) {
    const fromStock = await Stock.findOne({ productId: item.productId, warehouseId: transfer.fromWarehouseId, companyId });
    const toStock = await Stock.findOne({ productId: item.productId, warehouseId: transfer.toWarehouseId, companyId });

    const fromBefore = fromStock!.quantity || 0;
    fromStock!.quantity = fromBefore - (item.quantity as number);
    await fromStock!.save();

    if (toStock) {
      const toBefore = toStock.quantity || 0;
      toStock.quantity = toBefore + (item.quantity as number);
      await toStock.save();
      await StockMovement.create({
        productId: item.productId,
        warehouseId: transfer.toWarehouseId,
        companyId,
        type: 'TRANSFER_IN',
        quantity: item.quantity as number,
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
        quantity: item.quantity as number,
      });
      await StockMovement.create({
        productId: item.productId,
        warehouseId: transfer.toWarehouseId,
        companyId,
        type: 'TRANSFER_IN',
        quantity: item.quantity as number,
        quantityBefore: 0,
        quantityAfter: item.quantity as number,
        reference: transfer._id.toString(),
        createdBy: userId,
      });
    }

    await StockMovement.create({
      productId: item.productId,
      warehouseId: transfer.fromWarehouseId,
      companyId,
      type: 'TRANSFER_OUT',
      quantity: -(item.quantity as number),
      quantityBefore: fromBefore,
      quantityAfter: fromStock!.quantity,
      reference: transfer._id.toString(),
      createdBy: userId,
    });
  }

  transfer.status = 'RECEIVED';
  transfer.completedAt = new Date();
  await transfer.save();

  return transfer;
};

export {
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
