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
exports.getUnreadCount = exports.remove = exports.markAllAsRead = exports.markAsRead = exports.list = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const notificationService = __importStar(require("../services/notification.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.list = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await notificationService.list(req.user._id.toString(), req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.markAsRead = (0, catchAsync_1.default)(async (req, res, _next) => {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id.toString());
    apiResponse_1.default.success(res, notification);
});
exports.markAllAsRead = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await notificationService.markAllAsRead(req.user._id.toString());
    apiResponse_1.default.success(res, result);
});
exports.remove = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await notificationService.remove(req.params.id, req.user._id.toString());
    apiResponse_1.default.success(res, result);
});
exports.getUnreadCount = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await notificationService.getUnreadCount(req.user._id.toString());
    apiResponse_1.default.success(res, result);
});
//# sourceMappingURL=notification.controller.js.map