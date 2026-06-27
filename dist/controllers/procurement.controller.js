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
exports.exportPOs = exports.getReceipts = exports.createReceipt = exports.cancelPO = exports.rejectPO = exports.approvePO = exports.submitPO = exports.updatePO = exports.getPOById = exports.createPO = exports.listPOs = exports.createPOFromQuote = exports.getRFQQuotes = exports.sendRFQ = exports.removeRFQ = exports.updateRFQ = exports.getRFQById = exports.createRFQ = exports.listRFQs = exports.getVendorPurchaseHistory = exports.removeVendor = exports.updateVendor = exports.getVendorById = exports.createVendor = exports.listVendors = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const procurementService = __importStar(require("../services/procurement.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
// ---------- VENDORS ----------
exports.listVendors = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await procurementService.listVendors(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createVendor = (0, catchAsync_1.default)(async (req, res, _next) => {
    const vendor = await procurementService.createVendor(req.companyId, req.body);
    apiResponse_1.default.created(res, vendor);
});
exports.getVendorById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const vendor = await procurementService.getVendorById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, vendor);
});
exports.updateVendor = (0, catchAsync_1.default)(async (req, res, _next) => {
    const vendor = await procurementService.updateVendor(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, vendor);
});
exports.removeVendor = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await procurementService.removeVendor(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.getVendorPurchaseHistory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await procurementService.getVendorPurchaseHistory(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
// ---------- RFQ ----------
exports.listRFQs = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await procurementService.listRFQs(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createRFQ = (0, catchAsync_1.default)(async (req, res, _next) => {
    const rfq = await procurementService.createRFQ(req.companyId, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, rfq);
});
exports.getRFQById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const rfq = await procurementService.getRFQById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, rfq);
});
exports.updateRFQ = (0, catchAsync_1.default)(async (req, res, _next) => {
    const rfq = await procurementService.updateRFQ(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, rfq);
});
exports.removeRFQ = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await procurementService.removeRFQ(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.sendRFQ = (0, catchAsync_1.default)(async (req, res, _next) => {
    const rfq = await procurementService.sendRFQ(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, rfq);
});
exports.getRFQQuotes = (0, catchAsync_1.default)(async (req, res, _next) => {
    const quotes = await procurementService.getRFQQuotes(req.companyId, req.params.id);
    apiResponse_1.default.success(res, quotes);
});
exports.createPOFromQuote = (0, catchAsync_1.default)(async (req, res, _next) => {
    const po = await procurementService.createPOFromQuote(req.companyId, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, po);
});
// ---------- PURCHASE ORDERS ----------
exports.listPOs = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await procurementService.listPOs(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createPO = (0, catchAsync_1.default)(async (req, res, _next) => {
    const po = await procurementService.createPO(req.companyId, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, po);
});
exports.getPOById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const po = await procurementService.getPOById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, po);
});
exports.updatePO = (0, catchAsync_1.default)(async (req, res, _next) => {
    const po = await procurementService.updatePO(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, po);
});
exports.submitPO = (0, catchAsync_1.default)(async (req, res, _next) => {
    const po = await procurementService.submitPO(req.companyId, req.params.id);
    apiResponse_1.default.success(res, po);
});
exports.approvePO = (0, catchAsync_1.default)(async (req, res, _next) => {
    const po = await procurementService.approvePO(req.companyId, req.params.id, req.user._id.toString());
    apiResponse_1.default.success(res, po);
});
exports.rejectPO = (0, catchAsync_1.default)(async (req, res, _next) => {
    const po = await procurementService.rejectPO(req.companyId, req.params.id, req.body.reason);
    apiResponse_1.default.success(res, po);
});
exports.cancelPO = (0, catchAsync_1.default)(async (req, res, _next) => {
    const po = await procurementService.cancelPO(req.companyId, req.params.id, req.body.reason);
    apiResponse_1.default.success(res, po);
});
exports.createReceipt = (0, catchAsync_1.default)(async (req, res, _next) => {
    const receipt = await procurementService.createReceipt(req.companyId, req.user._id.toString(), req.params.id, req.body);
    apiResponse_1.default.created(res, receipt);
});
exports.getReceipts = (0, catchAsync_1.default)(async (req, res, _next) => {
    const receipts = await procurementService.getReceipts(req.companyId, req.params.id);
    apiResponse_1.default.success(res, receipts);
});
exports.exportPOs = (0, catchAsync_1.default)(async (req, res, _next) => {
    const pos = await procurementService.exportPOs(req.companyId, req.query);
    apiResponse_1.default.success(res, pos);
});
//# sourceMappingURL=procurement.controller.js.map