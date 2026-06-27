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
const procurementController = __importStar(require("../controllers/procurement.controller"));
const procurement_validator_1 = require("../validators/procurement.validator");
router.use(auth_1.authenticate);
// Vendors
router.get('/vendors', procurementController.listVendors);
router.post('/vendors', (0, validate_1.validate)(procurement_validator_1.createVendorSchema), (0, auditLogger_1.default)('procurement', 'CREATE', 'vendor'), procurementController.createVendor);
router.get('/vendors/:id', procurementController.getVendorById);
router.patch('/vendors/:id', (0, validate_1.validate)(procurement_validator_1.updateVendorSchema), procurementController.updateVendor);
router.delete('/vendors/:id', (0, auditLogger_1.default)('procurement', 'DELETE', 'vendor'), procurementController.removeVendor);
router.get('/vendors/:id/purchase-history', procurementController.getVendorPurchaseHistory);
// RFQs
router.get('/rfqs', procurementController.listRFQs);
router.post('/rfqs', (0, validate_1.validate)(procurement_validator_1.createRFQSchema), (0, auditLogger_1.default)('procurement', 'CREATE', 'rfq'), procurementController.createRFQ);
router.get('/rfqs/:id', procurementController.getRFQById);
router.patch('/rfqs/:id', (0, validate_1.validate)(procurement_validator_1.updateRFQSchema), procurementController.updateRFQ);
router.delete('/rfqs/:id', (0, auditLogger_1.default)('procurement', 'DELETE', 'rfq'), procurementController.removeRFQ);
router.post('/rfqs/:id/send', (0, validate_1.validate)(procurement_validator_1.sendRFQSchema), (0, auditLogger_1.default)('procurement', 'SEND', 'rfq'), procurementController.sendRFQ);
router.get('/rfqs/:id/quotes', procurementController.getRFQQuotes);
router.post('/rfqs/create-po-from-quote', (0, validate_1.validate)(procurement_validator_1.createPOFromQuoteSchema), (0, auditLogger_1.default)('procurement', 'CREATE', 'po_from_quote'), procurementController.createPOFromQuote);
// Purchase Orders
router.get('/purchase-orders', procurementController.listPOs);
router.post('/purchase-orders', (0, validate_1.validate)(procurement_validator_1.createPOSchema), (0, auditLogger_1.default)('procurement', 'CREATE', 'purchase_order'), procurementController.createPO);
router.get('/purchase-orders/export', procurementController.exportPOs);
router.get('/purchase-orders/:id', procurementController.getPOById);
router.patch('/purchase-orders/:id', (0, validate_1.validate)(procurement_validator_1.updatePOSchema), procurementController.updatePO);
router.post('/purchase-orders/:id/submit', (0, auditLogger_1.default)('procurement', 'SUBMIT', 'purchase_order'), procurementController.submitPO);
router.patch('/purchase-orders/:id/approve', (0, auditLogger_1.default)('procurement', 'APPROVE', 'purchase_order'), procurementController.approvePO);
router.patch('/purchase-orders/:id/reject', (0, auditLogger_1.default)('procurement', 'REJECT', 'purchase_order'), procurementController.rejectPO);
router.patch('/purchase-orders/:id/cancel', (0, auditLogger_1.default)('procurement', 'CANCEL', 'purchase_order'), procurementController.cancelPO);
router.post('/purchase-orders/:id/receipts', (0, validate_1.validate)(procurement_validator_1.createReceiptSchema), (0, auditLogger_1.default)('procurement', 'CREATE', 'receipt'), procurementController.createReceipt);
router.get('/purchase-orders/:id/receipts', procurementController.getReceipts);
exports.default = router;
//# sourceMappingURL=procurement.routes.js.map