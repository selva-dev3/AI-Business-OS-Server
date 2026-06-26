const inventoryService = require('../services/inventory.service');
const ApiResponse = require('../utils/apiResponse');

// ─── Products ──────────────────────────────────────────────────────────

const listProducts = async (req, res, next) => {
  try {
    const result = await inventoryService.listProducts(req.query, req.user.companyId);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (err) { next(err); }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await inventoryService.createProduct(req.body, req.user.companyId);
    return ApiResponse.created(res, product);
  } catch (err) { next(err); }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await inventoryService.getProductById(req.params.id, req.user.companyId);
    return ApiResponse.success(res, product);
  } catch (err) { next(err); }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await inventoryService.updateProduct(req.params.id, req.body, req.user.companyId);
    return ApiResponse.success(res, product);
  } catch (err) { next(err); }
};

const removeProduct = async (req, res, next) => {
  try {
    const product = await inventoryService.removeProduct(req.params.id, req.user.companyId);
    return ApiResponse.success(res, product);
  } catch (err) { next(err); }
};

const getStockHistory = async (req, res, next) => {
  try {
    const result = await inventoryService.getStockHistory(req.params.id, req.user.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (err) { next(err); }
};

const getLowStock = async (req, res, next) => {
  try {
    const products = await inventoryService.getLowStock(req.user.companyId);
    return ApiResponse.success(res, products);
  } catch (err) { next(err); }
};

// ─── Categories ─────────────────────────────────────────────────────────

const listCategories = async (req, res, next) => {
  try {
    const tree = await inventoryService.listCategories(req.user.companyId);
    return ApiResponse.success(res, tree);
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await inventoryService.createCategory(req.body, req.user.companyId);
    return ApiResponse.created(res, category);
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await inventoryService.updateCategory(req.params.id, req.body, req.user.companyId);
    return ApiResponse.success(res, category);
  } catch (err) { next(err); }
};

const removeCategory = async (req, res, next) => {
  try {
    await inventoryService.removeCategory(req.params.id, req.user.companyId);
    return ApiResponse.success(res, { message: 'Category removed successfully' });
  } catch (err) { next(err); }
};

// ─── Warehouses ─────────────────────────────────────────────────────────

const listWarehouses = async (req, res, next) => {
  try {
    const warehouses = await inventoryService.listWarehouses(req.user.companyId);
    return ApiResponse.success(res, warehouses);
  } catch (err) { next(err); }
};

const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await inventoryService.createWarehouse(req.body, req.user.companyId);
    return ApiResponse.created(res, warehouse);
  } catch (err) { next(err); }
};

const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await inventoryService.updateWarehouse(req.params.id, req.body, req.user.companyId);
    return ApiResponse.success(res, warehouse);
  } catch (err) { next(err); }
};

const getWarehouseStock = async (req, res, next) => {
  try {
    const result = await inventoryService.getWarehouseStock(req.params.id, req.user.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (err) { next(err); }
};

// ─── Stock ──────────────────────────────────────────────────────────────

const getStock = async (req, res, next) => {
  try {
    const result = await inventoryService.getStock(req.user.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (err) { next(err); }
};

const adjustStock = async (req, res, next) => {
  try {
    const stock = await inventoryService.adjustStock(req.body, req.user.companyId, req.user._id);
    return ApiResponse.success(res, stock);
  } catch (err) { next(err); }
};

const getMovements = async (req, res, next) => {
  try {
    const result = await inventoryService.getMovements(req.user.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (err) { next(err); }
};

// ─── Transfers ─────────────────────────────────────────────────────────

const createTransfer = async (req, res, next) => {
  try {
    const transfer = await inventoryService.createTransfer(req.body, req.user.companyId, req.user._id);
    return ApiResponse.created(res, transfer);
  } catch (err) { next(err); }
};

const listTransfers = async (req, res, next) => {
  try {
    const result = await inventoryService.listTransfers(req.user.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (err) { next(err); }
};

const approveTransfer = async (req, res, next) => {
  try {
    const transfer = await inventoryService.approveTransfer(req.params.id, req.user.companyId, req.user._id);
    return ApiResponse.success(res, transfer);
  } catch (err) { next(err); }
};

const completeTransfer = async (req, res, next) => {
  try {
    const transfer = await inventoryService.completeTransfer(req.params.id, req.user.companyId, req.user._id);
    return ApiResponse.success(res, transfer);
  } catch (err) { next(err); }
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
