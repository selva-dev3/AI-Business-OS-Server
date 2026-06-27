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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const auditLogger_1 = __importDefault(require("../middleware/auditLogger"));
const inventoryController = __importStar(require("../controllers/inventory.controller"));
const inventory_validator_1 = require("../validators/inventory.validator");
router.use(auth_1.authenticate);
// Products
router.get('/products', inventoryController.listProducts);
router.post('/products', (0, validate_1.validate)(inventory_validator_1.createProductSchema), (0, auditLogger_1.default)('inventory', 'CREATE', 'product'), inventoryController.createProduct);
router.get('/products/low-stock', inventoryController.getLowStock);
router.get('/products/:id', inventoryController.getProductById);
router.patch('/products/:id', (0, validate_1.validate)(inventory_validator_1.updateProductSchema), inventoryController.updateProduct);
router.delete('/products/:id', (0, auditLogger_1.default)('inventory', 'DELETE', 'product'), inventoryController.removeProduct);
router.get('/products/:id/stock-history', inventoryController.getStockHistory);
// Categories
router.get('/categories', inventoryController.listCategories);
router.post('/categories', (0, validate_1.validate)(inventory_validator_1.createCategorySchema), (0, auditLogger_1.default)('inventory', 'CREATE', 'category'), inventoryController.createCategory);
router.patch('/categories/:id', (0, validate_1.validate)(inventory_validator_1.updateCategorySchema), inventoryController.updateCategory);
router.delete('/categories/:id', (0, auditLogger_1.default)('inventory', 'DELETE', 'category'), inventoryController.removeCategory);
// Warehouses
router.get('/warehouses', inventoryController.listWarehouses);
router.post('/warehouses', (0, validate_1.validate)(inventory_validator_1.createWarehouseSchema), (0, auditLogger_1.default)('inventory', 'CREATE', 'warehouse'), inventoryController.createWarehouse);
router.patch('/warehouses/:id', (0, validate_1.validate)(inventory_validator_1.updateWarehouseSchema), inventoryController.updateWarehouse);
router.get('/warehouses/:id/stock', inventoryController.getWarehouseStock);
// Stock
router.get('/stock', inventoryController.getStock);
router.post('/stock/adjust', (0, validate_1.validate)(inventory_validator_1.adjustStockSchema), (0, auditLogger_1.default)('inventory', 'ADJUST', 'stock'), inventoryController.adjustStock);
router.get('/movements', inventoryController.getMovements);
// Transfers
router.get('/transfers', inventoryController.listTransfers);
router.post('/transfers', (0, validate_1.validate)(inventory_validator_1.createTransferSchema), (0, auditLogger_1.default)('inventory', 'CREATE', 'transfer'), inventoryController.createTransfer);
router.patch('/transfers/:id/approve', (0, auditLogger_1.default)('inventory', 'APPROVE', 'transfer'), inventoryController.approveTransfer);
router.patch('/transfers/:id/complete', (0, auditLogger_1.default)('inventory', 'COMPLETE', 'transfer'), inventoryController.completeTransfer);
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map