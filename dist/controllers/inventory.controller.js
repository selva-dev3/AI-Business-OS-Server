"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeTransfer = exports.approveTransfer = exports.listTransfers = exports.createTransfer = exports.getMovements = exports.adjustStock = exports.getStock = exports.getWarehouseStock = exports.updateWarehouse = exports.createWarehouse = exports.listWarehouses = exports.removeCategory = exports.updateCategory = exports.createCategory = exports.listCategories = exports.getLowStock = exports.getStockHistory = exports.removeProduct = exports.updateProduct = exports.getProductById = exports.createProduct = exports.listProducts = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const inventoryService = __importStar(require("../services/inventory.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
// ─── Products ──────────────────────────────────────────────────────────
exports.listProducts = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await inventoryService.listProducts(req.query, req.user.companyId.toString());
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createProduct = (0, catchAsync_1.default)(async (req, res, _next) => {
    const product = await inventoryService.createProduct(req.body, req.user.companyId.toString());
    apiResponse_1.default.created(res, product);
});
exports.getProductById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const product = await inventoryService.getProductById(req.params.id, req.user.companyId.toString());
    apiResponse_1.default.success(res, product);
});
exports.updateProduct = (0, catchAsync_1.default)(async (req, res, _next) => {
    const product = await inventoryService.updateProduct(req.params.id, req.body, req.user.companyId.toString());
    apiResponse_1.default.success(res, product);
});
exports.removeProduct = (0, catchAsync_1.default)(async (req, res, _next) => {
    const product = await inventoryService.removeProduct(req.params.id, req.user.companyId.toString());
    apiResponse_1.default.success(res, product);
});
exports.getStockHistory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await inventoryService.getStockHistory(req.params.id, req.user.companyId.toString(), req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.getLowStock = (0, catchAsync_1.default)(async (req, res, _next) => {
    const products = await inventoryService.getLowStock(req.user.companyId.toString());
    apiResponse_1.default.success(res, products);
});
// ─── Categories ─────────────────────────────────────────────────────────
exports.listCategories = (0, catchAsync_1.default)(async (req, res, _next) => {
    const tree = await inventoryService.listCategories(req.user.companyId.toString());
    apiResponse_1.default.success(res, tree);
});
exports.createCategory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const category = await inventoryService.createCategory(req.body, req.user.companyId.toString());
    apiResponse_1.default.created(res, category);
});
exports.updateCategory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const category = await inventoryService.updateCategory(req.params.id, req.body, req.user.companyId.toString());
    apiResponse_1.default.success(res, category);
});
exports.removeCategory = (0, catchAsync_1.default)(async (req, res, _next) => {
    await inventoryService.removeCategory(req.params.id, req.user.companyId.toString());
    apiResponse_1.default.success(res, { message: 'Category removed successfully' });
});
// ─── Warehouses ─────────────────────────────────────────────────────────
exports.listWarehouses = (0, catchAsync_1.default)(async (req, res, _next) => {
    const warehouses = await inventoryService.listWarehouses(req.user.companyId.toString());
    apiResponse_1.default.success(res, warehouses);
});
exports.createWarehouse = (0, catchAsync_1.default)(async (req, res, _next) => {
    const warehouse = await inventoryService.createWarehouse(req.body, req.user.companyId.toString());
    apiResponse_1.default.created(res, warehouse);
});
exports.updateWarehouse = (0, catchAsync_1.default)(async (req, res, _next) => {
    const warehouse = await inventoryService.updateWarehouse(req.params.id, req.body, req.user.companyId.toString());
    apiResponse_1.default.success(res, warehouse);
});
exports.getWarehouseStock = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await inventoryService.getWarehouseStock(req.params.id, req.user.companyId.toString(), req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
// ─── Stock ──────────────────────────────────────────────────────────────
exports.getStock = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await inventoryService.getStock(req.user.companyId.toString(), req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.adjustStock = (0, catchAsync_1.default)(async (req, res, _next) => {
    const stock = await inventoryService.adjustStock(req.body, req.user.companyId.toString(), req.user._id.toString());
    apiResponse_1.default.success(res, stock);
});
exports.getMovements = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await inventoryService.getMovements(req.user.companyId.toString(), req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
// ─── Transfers ─────────────────────────────────────────────────────────
exports.createTransfer = (0, catchAsync_1.default)(async (req, res, _next) => {
    const transfer = await inventoryService.createTransfer(req.body, req.user.companyId.toString(), req.user._id.toString());
    apiResponse_1.default.created(res, transfer);
});
exports.listTransfers = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await inventoryService.listTransfers(req.user.companyId.toString(), req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.approveTransfer = (0, catchAsync_1.default)(async (req, res, _next) => {
    const transfer = await inventoryService.approveTransfer(req.params.id, req.user.companyId.toString(), req.user._id.toString());
    apiResponse_1.default.success(res, transfer);
});
exports.completeTransfer = (0, catchAsync_1.default)(async (req, res, _next) => {
    const transfer = await inventoryService.completeTransfer(req.params.id, req.user.companyId.toString(), req.user._id.toString());
    apiResponse_1.default.success(res, transfer);
});
//# sourceMappingURL=inventory.controller.js.map