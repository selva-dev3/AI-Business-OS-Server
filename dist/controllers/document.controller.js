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
exports.search = exports.restoreVersion = exports.getVersions = exports.share = exports.download = exports.remove = exports.update = exports.getById = exports.create = exports.list = exports.removeFolder = exports.updateFolder = exports.createFolder = exports.getFolderById = exports.listRoot = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const documentService = __importStar(require("../services/document.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.listRoot = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await documentService.listRoot(req.companyId);
    apiResponse_1.default.success(res, result);
});
exports.getFolderById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await documentService.getFolderById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.createFolder = (0, catchAsync_1.default)(async (req, res, _next) => {
    const folder = await documentService.createFolder(req.companyId, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, folder);
});
exports.updateFolder = (0, catchAsync_1.default)(async (req, res, _next) => {
    const folder = await documentService.updateFolder(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, folder);
});
exports.removeFolder = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await documentService.removeFolder(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.list = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await documentService.list(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.create = (0, catchAsync_1.default)(async (req, res, _next) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const document = await documentService.create(req.companyId, req.user._id.toString(), req.body, req.file);
    apiResponse_1.default.created(res, document);
});
exports.getById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const document = await documentService.getById(req.companyId, req.params.id);
    apiResponse_1.default.success(res, document);
});
exports.update = (0, catchAsync_1.default)(async (req, res, _next) => {
    req.originalBody = req.body;
    const document = await documentService.update(req.companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, document);
});
exports.remove = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await documentService.remove(req.companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.download = (0, catchAsync_1.default)(async (req, res, _next) => {
    const document = await documentService.download(req.companyId, req.params.id);
    res.download(document.fileUrl, document.name);
});
exports.share = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await documentService.share(req.companyId, req.params.id, req.body, req.user._id.toString());
    apiResponse_1.default.success(res, result);
});
exports.getVersions = (0, catchAsync_1.default)(async (req, res, _next) => {
    const versions = await documentService.getVersions(req.companyId, req.params.id);
    apiResponse_1.default.success(res, versions);
});
exports.restoreVersion = (0, catchAsync_1.default)(async (req, res, _next) => {
    const document = await documentService.restoreVersion(req.companyId, req.params.id, req.params.version);
    apiResponse_1.default.success(res, document);
});
exports.search = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await documentService.search(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
//# sourceMappingURL=document.controller.js.map