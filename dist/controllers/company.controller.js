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
exports.deleteBranch = exports.updateBranch = exports.createBranch = exports.listBranches = exports.updateSettings = exports.getSettings = exports.uploadLogo = exports.update = exports.get = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const companyService = __importStar(require("../services/company.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.get = (0, catchAsync_1.default)(async (req, res, _next) => {
    const company = await companyService.get(req.companyId);
    apiResponse_1.default.success(res, company);
});
exports.update = (0, catchAsync_1.default)(async (req, res, _next) => {
    req.originalBody = req.body;
    const company = await companyService.update(req.companyId, req.body);
    apiResponse_1.default.success(res, company);
});
exports.uploadLogo = (0, catchAsync_1.default)(async (req, res, _next) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const result = await companyService.uploadLogo(req.companyId, req.file);
    apiResponse_1.default.success(res, result);
});
exports.getSettings = (0, catchAsync_1.default)(async (req, res, _next) => {
    const settings = await companyService.getSettings(req.companyId);
    apiResponse_1.default.success(res, settings);
});
exports.updateSettings = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await companyService.updateSettings(req.companyId, req.body);
    apiResponse_1.default.success(res, result);
});
exports.listBranches = (0, catchAsync_1.default)(async (req, res, _next) => {
    const branches = await companyService.listBranches(req.companyId);
    apiResponse_1.default.success(res, branches);
});
exports.createBranch = (0, catchAsync_1.default)(async (req, res, _next) => {
    req.originalBody = req.body;
    const branch = await companyService.createBranch(req.companyId, req.body);
    apiResponse_1.default.created(res, branch);
});
exports.updateBranch = (0, catchAsync_1.default)(async (req, res, _next) => {
    const branch = await companyService.updateBranch(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, branch);
});
exports.deleteBranch = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await companyService.deleteBranch(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
//# sourceMappingURL=company.controller.js.map