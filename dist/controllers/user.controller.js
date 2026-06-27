"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.updateProfile = exports.resetPassword = exports.changeRole = exports.remove = exports.update = exports.getById = exports.invite = exports.list = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const user_service_1 = __importDefault(require("../services/user.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.list = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await user_service_1.default.list(req.companyId, req.query);
    apiResponse_1.default.paginated(res, result.data, result.meta);
});
exports.invite = (0, catchAsync_1.default)(async (req, res, _next) => {
    const user = await user_service_1.default.invite(req.body, req.companyId, req.user);
    apiResponse_1.default.created(res, user);
});
exports.getById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const user = await user_service_1.default.getById(req.params.id, req.companyId);
    apiResponse_1.default.success(res, user);
});
exports.update = (0, catchAsync_1.default)(async (req, res, _next) => {
    const user = await user_service_1.default.update(req.params.id, req.body, req.companyId);
    apiResponse_1.default.success(res, user);
});
exports.remove = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await user_service_1.default.deactivate(req.params.id, req.companyId);
    apiResponse_1.default.success(res, result);
});
exports.changeRole = (0, catchAsync_1.default)(async (req, res, _next) => {
    const user = await user_service_1.default.changeRole(req.params.id, req.body.roleId, req.companyId);
    apiResponse_1.default.success(res, user);
});
exports.resetPassword = (0, catchAsync_1.default)(async (req, res, _next) => {
    const result = await user_service_1.default.resetPassword(req.params.id, req.body, req.companyId);
    apiResponse_1.default.success(res, result);
});
exports.updateProfile = (0, catchAsync_1.default)(async (req, res, _next) => {
    const user = await user_service_1.default.updateProfile(req.user._id.toString(), req.body);
    apiResponse_1.default.success(res, user);
});
exports.uploadAvatar = (0, catchAsync_1.default)(async (req, res, _next) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const result = await user_service_1.default.uploadAvatar(req.user._id.toString(), req.file);
    apiResponse_1.default.success(res, result);
});
//# sourceMappingURL=user.controller.js.map