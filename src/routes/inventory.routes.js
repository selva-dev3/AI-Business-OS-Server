const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory and Stock Management
 */


const controller = require('../controllers/inventory.controller');
const validator = require('../validators/inventory.validator');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: 'Validation Error',
      message: messages,
      timestamp: new Date().toISOString(),
    });
  }
  req.body = value;
  next();
};

// ─── Products ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /inventory/products/low-stock:
 *   get:
 *     summary: Get Products Low-stock
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/products/low-stock', controller.getLowStock);
/**
 * @swagger
 * /inventory/products:
 *   get:
 *     summary: Get Products
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/products', controller.listProducts);
/**
 * @swagger
 * /inventory/products:
 *   post:
 *     summary: Create Products
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/products', validate(validator.createProductSchema), controller.createProduct);
/**
 * @swagger
 * /inventory/products/{id}:
 *   get:
 *     summary: Get Products
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/products/:id', controller.getProductById);
/**
 * @swagger
 * /inventory/products/{id}:
 *   patch:
 *     summary: Update Products
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/products/:id', validate(validator.updateProductSchema), controller.updateProduct);
/**
 * @swagger
 * /inventory/products/{id}:
 *   delete:
 *     summary: Delete Products
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/products/:id', controller.removeProduct);
/**
 * @swagger
 * /inventory/products/{id}/stock-history:
 *   get:
 *     summary: Get Products Stock-history
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/products/:id/stock-history', controller.getStockHistory);

// ─── Categories ────────────────────────────────────────────────────────

/**
 * @swagger
 * /inventory/categories:
 *   get:
 *     summary: Get Categories
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/categories', controller.listCategories);
/**
 * @swagger
 * /inventory/categories:
 *   post:
 *     summary: Create Categories
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/categories', validate(validator.createCategorySchema), controller.createCategory);
/**
 * @swagger
 * /inventory/categories/{id}:
 *   patch:
 *     summary: Update Categories
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/categories/:id', validate(validator.updateCategorySchema), controller.updateCategory);
/**
 * @swagger
 * /inventory/categories/{id}:
 *   delete:
 *     summary: Delete Categories
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/categories/:id', controller.removeCategory);

// ─── Warehouses ────────────────────────────────────────────────────────

/**
 * @swagger
 * /inventory/warehouses:
 *   get:
 *     summary: Get Warehouses
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/warehouses', controller.listWarehouses);
/**
 * @swagger
 * /inventory/warehouses:
 *   post:
 *     summary: Create Warehouses
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/warehouses', validate(validator.createWarehouseSchema), controller.createWarehouse);
/**
 * @swagger
 * /inventory/warehouses/{id}:
 *   patch:
 *     summary: Update Warehouses
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/warehouses/:id', validate(validator.updateWarehouseSchema), controller.updateWarehouse);
/**
 * @swagger
 * /inventory/warehouses/{id}/stock:
 *   get:
 *     summary: Get Warehouses Stock
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/warehouses/:id/stock', controller.getWarehouseStock);

// ─── Stock & Transfers ────────────────────────────────────────────────

/**
 * @swagger
 * /inventory/stock:
 *   get:
 *     summary: Get Stock
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/stock', controller.getStock);
/**
 * @swagger
 * /inventory/stock/adjust:
 *   post:
 *     summary: Create Stock Adjust
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/stock/adjust', validate(validator.adjustStockSchema), controller.adjustStock);
/**
 * @swagger
 * /inventory/stock/movements:
 *   get:
 *     summary: Get Stock Movements
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/stock/movements', controller.getMovements);
/**
 * @swagger
 * /inventory/stock/transfers:
 *   post:
 *     summary: Create Stock Transfers
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/stock/transfers', validate(validator.createTransferSchema), controller.createTransfer);
/**
 * @swagger
 * /inventory/stock/transfers:
 *   get:
 *     summary: Get Stock Transfers
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/stock/transfers', controller.listTransfers);
/**
 * @swagger
 * /inventory/stock/transfers/{id}/approve:
 *   patch:
 *     summary: Update Stock Transfers Approve
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/stock/transfers/:id/approve', controller.approveTransfer);
/**
 * @swagger
 * /inventory/stock/transfers/{id}/complete:
 *   patch:
 *     summary: Update Stock Transfers Complete
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/stock/transfers/:id/complete', controller.completeTransfer);

module.exports = router;
