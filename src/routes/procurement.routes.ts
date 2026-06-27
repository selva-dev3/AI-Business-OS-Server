import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import auditLog from '../middleware/auditLogger';
import * as procurementController from '../controllers/procurement.controller';
import {
  createVendorSchema,
  updateVendorSchema,
  createRFQSchema,
  updateRFQSchema,
  sendRFQSchema,
  createPOSchema,
  updatePOSchema,
  createReceiptSchema,
  createPOFromQuoteSchema,
} from '../validators/procurement.validator';

router.use(authenticate);

// Vendors
router.get('/vendors', procurementController.listVendors);
router.post('/vendors', validate(createVendorSchema), auditLog('procurement', 'CREATE', 'vendor'), procurementController.createVendor);
router.get('/vendors/:id', procurementController.getVendorById);
router.patch('/vendors/:id', validate(updateVendorSchema), procurementController.updateVendor);
router.delete('/vendors/:id', auditLog('procurement', 'DELETE', 'vendor'), procurementController.removeVendor);
router.get('/vendors/:id/purchase-history', procurementController.getVendorPurchaseHistory);

// RFQs
router.get('/rfqs', procurementController.listRFQs);
router.post('/rfqs', validate(createRFQSchema), auditLog('procurement', 'CREATE', 'rfq'), procurementController.createRFQ);
router.get('/rfqs/:id', procurementController.getRFQById);
router.patch('/rfqs/:id', validate(updateRFQSchema), procurementController.updateRFQ);
router.delete('/rfqs/:id', auditLog('procurement', 'DELETE', 'rfq'), procurementController.removeRFQ);
router.post('/rfqs/:id/send', validate(sendRFQSchema), auditLog('procurement', 'SEND', 'rfq'), procurementController.sendRFQ);
router.get('/rfqs/:id/quotes', procurementController.getRFQQuotes);
router.post('/rfqs/create-po-from-quote', validate(createPOFromQuoteSchema), auditLog('procurement', 'CREATE', 'po_from_quote'), procurementController.createPOFromQuote);

// Purchase Orders
router.get('/purchase-orders', procurementController.listPOs);
router.post('/purchase-orders', validate(createPOSchema), auditLog('procurement', 'CREATE', 'purchase_order'), procurementController.createPO);
router.get('/purchase-orders/export', procurementController.exportPOs);
router.get('/purchase-orders/:id', procurementController.getPOById);
router.patch('/purchase-orders/:id', validate(updatePOSchema), procurementController.updatePO);
router.post('/purchase-orders/:id/submit', auditLog('procurement', 'SUBMIT', 'purchase_order'), procurementController.submitPO);
router.patch('/purchase-orders/:id/approve', auditLog('procurement', 'APPROVE', 'purchase_order'), procurementController.approvePO);
router.patch('/purchase-orders/:id/reject', auditLog('procurement', 'REJECT', 'purchase_order'), procurementController.rejectPO);
router.patch('/purchase-orders/:id/cancel', auditLog('procurement', 'CANCEL', 'purchase_order'), procurementController.cancelPO);
router.post('/purchase-orders/:id/receipts', validate(createReceiptSchema), auditLog('procurement', 'CREATE', 'receipt'), procurementController.createReceipt);
router.get('/purchase-orders/:id/receipts', procurementController.getReceipts);

export default router;
