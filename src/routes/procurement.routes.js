const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Procurement
 *   description: Procurement Management (RFQs, Purchase Orders, Goods Receipts)
 */


const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createVendorSchema,
  updateVendorSchema,
  createRFQSchema,
  updateRFQSchema,
  sendRFQSchema,
  createPOSchema,
  updatePOSchema,
  createReceiptSchema,
  createPOFromQuoteSchema,
} = require('../validators/procurement.validator');
const {
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
} = require('../controllers/procurement.controller');

router.use(authenticate);

// ----- VENDORS -----
/**
 * @swagger
 * /procurement/vendors:
 *   get:
 *     summary: Get Vendors
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/vendors', listVendors);
/**
 * @swagger
 * /procurement/vendors:
 *   post:
 *     summary: Create Vendors
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/vendors', validate(createVendorSchema), createVendor);
/**
 * @swagger
 * /procurement/vendors/{id}:
 *   get:
 *     summary: Get Vendors
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.get('/vendors/:id', getVendorById);
/**
 * @swagger
 * /procurement/vendors/{id}:
 *   patch:
 *     summary: Update Vendors
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.patch('/vendors/:id', validate(updateVendorSchema), updateVendor);
/**
 * @swagger
 * /procurement/vendors/{id}:
 *   delete:
 *     summary: Delete Vendors
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.delete('/vendors/:id', removeVendor);
/**
 * @swagger
 * /procurement/vendors/{id}/purchase-history:
 *   get:
 *     summary: Get Vendors Purchase-history
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.get('/vendors/:id/purchase-history', getVendorPurchaseHistory);

// ----- RFQ -----
/**
 * @swagger
 * /procurement/rfq:
 *   get:
 *     summary: Get Rfq
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/rfq', listRFQs);
/**
 * @swagger
 * /procurement/rfq:
 *   post:
 *     summary: Create Rfq
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/rfq', validate(createRFQSchema), createRFQ);
/**
 * @swagger
 * /procurement/rfq/{id}:
 *   get:
 *     summary: Get Rfq
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.get('/rfq/:id', getRFQById);
/**
 * @swagger
 * /procurement/rfq/{id}:
 *   patch:
 *     summary: Update Rfq
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.patch('/rfq/:id', validate(updateRFQSchema), updateRFQ);
/**
 * @swagger
 * /procurement/rfq/{id}:
 *   delete:
 *     summary: Delete Rfq
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.delete('/rfq/:id', removeRFQ);
/**
 * @swagger
 * /procurement/rfq/{id}/send:
 *   post:
 *     summary: Create Rfq Send
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.post('/rfq/:id/send', validate(sendRFQSchema), sendRFQ);
/**
 * @swagger
 * /procurement/rfq/{id}/quotes:
 *   get:
 *     summary: Get Rfq Quotes
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.get('/rfq/:id/quotes', getRFQQuotes);
/**
 * @swagger
 * /procurement/rfq/{id}/create-po:
 *   post:
 *     summary: Create Rfq Create-po
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.post('/rfq/:id/create-po', validate(createPOFromQuoteSchema), createPOFromQuote);

// ----- PURCHASE ORDERS -----
/**
 * @swagger
 * /procurement/purchase-orders:
 *   get:
 *     summary: Get Purchase-orders
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/purchase-orders', listPOs);
/**
 * @swagger
 * /procurement/purchase-orders:
 *   post:
 *     summary: Create Purchase-orders
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/purchase-orders', validate(createPOSchema), createPO);
/**
 * @swagger
 * /procurement/purchase-orders/{id}:
 *   get:
 *     summary: Get Purchase-orders
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.get('/purchase-orders/:id', getPOById);
/**
 * @swagger
 * /procurement/purchase-orders/{id}:
 *   patch:
 *     summary: Update Purchase-orders
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.patch('/purchase-orders/:id', validate(updatePOSchema), updatePO);
/**
 * @swagger
 * /procurement/purchase-orders/{id}/submit:
 *   patch:
 *     summary: Update Purchase-orders Submit
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.patch('/purchase-orders/:id/submit', submitPO);
/**
 * @swagger
 * /procurement/purchase-orders/{id}/approve:
 *   patch:
 *     summary: Update Purchase-orders Approve
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.patch('/purchase-orders/:id/approve', approvePO);
/**
 * @swagger
 * /procurement/purchase-orders/{id}/reject:
 *   patch:
 *     summary: Update Purchase-orders Reject
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.patch('/purchase-orders/:id/reject', rejectPO);
/**
 * @swagger
 * /procurement/purchase-orders/{id}/cancel:
 *   patch:
 *     summary: Update Purchase-orders Cancel
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.patch('/purchase-orders/:id/cancel', cancelPO);
/**
 * @swagger
 * /procurement/purchase-orders/{id}/receipt:
 *   post:
 *     summary: Create Purchase-orders Receipt
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.post('/purchase-orders/:id/receipt', validate(createReceiptSchema), createReceipt);
/**
 * @swagger
 * /procurement/purchase-orders/{id}/receipts:
 *   get:
 *     summary: Get Purchase-orders Receipts
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
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
router.get('/purchase-orders/:id/receipts', getReceipts);
/**
 * @swagger
 * /procurement/purchase-orders/export:
 *   get:
 *     summary: Export Purchase-orders Export
 *     tags: [Procurement]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/purchase-orders/export', exportPOs);

module.exports = router;
