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
exports.scheduleReport = exports.getAIInsights = exports.getFinance = exports.getSupport = exports.getInventory = exports.getCRM = exports.getHRMS = exports.getRevenue = exports.getOverview = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const analyticsService = __importStar(require("../services/analytics.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.getOverview = (0, catchAsync_1.default)(async (req, res, _next) => {
    const from = req.query.from;
    const to = req.query.to;
    const data = await analyticsService.getOverview(from, to, req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.getRevenue = (0, catchAsync_1.default)(async (req, res, _next) => {
    const period = req.query.period;
    const from = req.query.from;
    const to = req.query.to;
    const data = await analyticsService.getRevenue(period || 'monthly', from, to, req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.getHRMS = (0, catchAsync_1.default)(async (req, res, _next) => {
    const from = req.query.from;
    const to = req.query.to;
    const data = await analyticsService.getHRMS(from, to, req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.getCRM = (0, catchAsync_1.default)(async (req, res, _next) => {
    const from = req.query.from;
    const to = req.query.to;
    const data = await analyticsService.getCRM(from, to, req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.getInventory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const warehouseId = req.query.warehouseId;
    const data = await analyticsService.getInventory(warehouseId, req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.getSupport = (0, catchAsync_1.default)(async (req, res, _next) => {
    const from = req.query.from;
    const to = req.query.to;
    const data = await analyticsService.getSupport(from, to, req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.getFinance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const from = req.query.from;
    const to = req.query.to;
    const data = await analyticsService.getFinance(from, to, req.companyId);
    apiResponse_1.default.success(res, data);
});
exports.getAIInsights = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { module, data } = req.body;
    const insights = await analyticsService.getAIInsights(module, data);
    apiResponse_1.default.success(res, insights);
});
exports.scheduleReport = (0, catchAsync_1.default)(async (req, res, _next) => {
    const schedule = await analyticsService.scheduleReport(req.body, req.companyId);
    apiResponse_1.default.created(res, schedule);
});
//# sourceMappingURL=analytics.controller.js.map