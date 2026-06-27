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
exports.parseResume = exports.forecast = exports.extractDocument = exports.generateEmail = exports.summarize = exports.getInsights = exports.chat = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const aiService = __importStar(require("../services/ai.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.chat = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { messages, context } = req.body;
    const result = await aiService.chat(messages, context);
    apiResponse_1.default.success(res, result);
});
exports.getInsights = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { module, data } = req.body;
    const insights = await aiService.getInsights(module, data);
    apiResponse_1.default.success(res, insights);
});
exports.summarize = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { entityType, entityId } = req.body;
    const result = await aiService.summarize(entityType, entityId);
    apiResponse_1.default.success(res, result);
});
exports.generateEmail = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await aiService.generateEmail(req.body);
    apiResponse_1.default.success(res, result);
});
exports.extractDocument = (0, catchAsync_1.default)(async (req, res, _next) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const result = await aiService.extractDocument(req.file);
    apiResponse_1.default.success(res, result);
});
exports.forecast = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { historicalData, periods } = req.body;
    const result = await aiService.forecast(historicalData, periods);
    apiResponse_1.default.success(res, result);
});
exports.parseResume = (0, catchAsync_1.default)(async (req, res, _next) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const result = await aiService.parseResume(req.file);
    apiResponse_1.default.success(res, result);
});
//# sourceMappingURL=ai.controller.js.map