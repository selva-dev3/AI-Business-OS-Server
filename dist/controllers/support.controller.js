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
exports.getReportAgentPerformance = exports.getReportSLA = exports.getReportSummary = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.listCategories = exports.getTicketAISummary = exports.closeTicket = exports.changeTicketPriority = exports.changeTicketStatus = exports.assignTicket = exports.replyTicket = exports.deleteTicket = exports.updateTicket = exports.getTicket = exports.createTicket = exports.listTickets = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const supportService = __importStar(require("../services/support.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.listTickets = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await supportService.list(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.createTicket = (0, catchAsync_1.default)(async (req, res, _next) => {
    req.originalBody = req.body;
    const ticket = await supportService.create(req.companyId, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, ticket);
});
exports.getTicket = (0, catchAsync_1.default)(async (req, res, _next) => {
    const ticket = await supportService.getById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, ticket);
});
exports.updateTicket = (0, catchAsync_1.default)(async (req, res, _next) => {
    req.originalBody = req.body;
    const ticket = await supportService.update(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, ticket);
});
exports.deleteTicket = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await supportService.remove(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.replyTicket = (0, catchAsync_1.default)(async (req, res, _next) => {
    const reply = await supportService.reply(req.companyId, req.user._id.toString(), req.params.id, req.body);
    apiResponse_1.default.created(res, reply);
});
exports.assignTicket = (0, catchAsync_1.default)(async (req, res, _next) => {
    const ticket = await supportService.assign(req.companyId, req.user._id.toString(), req.params.id, req.body.assigneeId);
    apiResponse_1.default.success(res, ticket);
});
exports.changeTicketStatus = (0, catchAsync_1.default)(async (req, res, _next) => {
    const ticket = await supportService.changeStatus(req.companyId, req.user._id.toString(), req.params.id, req.body.status, req.body.resolution);
    apiResponse_1.default.success(res, ticket);
});
exports.changeTicketPriority = (0, catchAsync_1.default)(async (req, res, _next) => {
    const ticket = await supportService.changePriority(req.companyId, req.user._id.toString(), req.params.id, req.body.priority);
    apiResponse_1.default.success(res, ticket);
});
exports.closeTicket = (0, catchAsync_1.default)(async (req, res, _next) => {
    const ticket = await supportService.close(req.companyId, req.user._id.toString(), req.params.id, req.body.resolution);
    apiResponse_1.default.success(res, ticket);
});
exports.getTicketAISummary = (0, catchAsync_1.default)(async (req, res, _next) => {
    const summary = await supportService.getAISummary(req.companyId, req.params.id);
    apiResponse_1.default.success(res, summary);
});
exports.listCategories = (0, catchAsync_1.default)(async (req, res, _next) => {
    const categories = await supportService.listCategories(req.companyId);
    apiResponse_1.default.success(res, categories);
});
exports.createCategory = (0, catchAsync_1.default)(async (req, res, _next) => {
    req.originalBody = req.body;
    const category = await supportService.createCategory(req.companyId, req.body);
    apiResponse_1.default.created(res, category);
});
exports.updateCategory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const category = await supportService.updateCategory(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, category);
});
exports.deleteCategory = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await supportService.removeCategory(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.getReportSummary = (0, catchAsync_1.default)(async (req, res, _next) => {
    const summary = await supportService.getSummary(req.companyId);
    apiResponse_1.default.success(res, summary);
});
exports.getReportSLA = (0, catchAsync_1.default)(async (req, res, _next) => {
    const sla = await supportService.getSLA(req.companyId);
    apiResponse_1.default.success(res, sla);
});
exports.getReportAgentPerformance = (0, catchAsync_1.default)(async (req, res, _next) => {
    const performance = await supportService.getAgentPerformance(req.companyId);
    apiResponse_1.default.success(res, performance);
});
//# sourceMappingURL=support.controller.js.map