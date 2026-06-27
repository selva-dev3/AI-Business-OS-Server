import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import auditLog from '../middleware/auditLogger';
import * as inventoryController from '../controllers/inventory.controller';
import {
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
  updateCategorySchema,
  createWarehouseSchema,
  updateWarehouseSchema,
  adjustStockSchema,
  createTransferSchema,
} from '../validators/inventory.validator';

router.use(authenticate);

// Products
router.get('/products', inventoryController.listProducts);
router.post('/products', validate(createProductSchema), auditLog('inventory', 'CREATE', 'product'), inventoryController.createProduct);
router.get('/products/low-stock', inventoryController.getLowStock);
router.get('/products/:id', inventoryController.getProductById);
router.patch('/products/:id', validate(updateProductSchema), inventoryController.updateProduct);
router.delete('/products/:id', auditLog('inventory', 'DELETE', 'product'), inventoryController.removeProduct);
router.get('/products/:id/stock-history', inventoryController.getStockHistory);

// Categories
router.get('/categories', inventoryController.listCategories);
router.post('/categories', validate(createCategorySchema), auditLog('inventory', 'CREATE', 'category'), inventoryController.createCategory);
router.patch('/categories/:id', validate(updateCategorySchema), inventoryController.updateCategory);
router.delete('/categories/:id', auditLog('inventory', 'DELETE', 'category'), inventoryController.removeCategory);

// Warehouses
router.get('/warehouses', inventoryController.listWarehouses);
router.post('/warehouses', validate(createWarehouseSchema), auditLog('inventory', 'CREATE', 'warehouse'), inventoryController.createWarehouse);
router.patch('/warehouses/:id', validate(updateWarehouseSchema), inventoryController.updateWarehouse);
router.get('/warehouses/:id/stock', inventoryController.getWarehouseStock);

// Stock
router.get('/stock', inventoryController.getStock);
router.post('/stock/adjust', validate(adjustStockSchema), auditLog('inventory', 'ADJUST', 'stock'), inventoryController.adjustStock);
router.get('/movements', inventoryController.getMovements);

// Transfers
router.get('/transfers', inventoryController.listTransfers);
router.post('/transfers', validate(createTransferSchema), auditLog('inventory', 'CREATE', 'transfer'), inventoryController.createTransfer);
router.patch('/transfers/:id/approve', auditLog('inventory', 'APPROVE', 'transfer'), inventoryController.approveTransfer);
router.patch('/transfers/:id/complete', auditLog('inventory', 'COMPLETE', 'transfer'), inventoryController.completeTransfer);

export default router;
