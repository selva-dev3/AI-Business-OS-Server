"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = exports.updateBranch = exports.createBranch = exports.listBranches = exports.updateSettings = exports.getSettings = exports.uploadLogo = exports.update = exports.get = void 0;
const Company_1 = __importDefault(require("../models/Company"));
const CompanySettings_1 = __importDefault(require("../models/CompanySettings"));
const Branch_1 = __importDefault(require("../models/Branch"));
const appError_1 = __importDefault(require("../utils/appError"));
const get = async (companyId) => {
    const company = await Company_1.default.findById(companyId);
    if (!company)
        throw new appError_1.default(404, 'NOT_FOUND', 'Company not found');
    return company;
};
exports.get = get;
const update = async (companyId, data) => {
    const company = await Company_1.default.findByIdAndUpdate(companyId, data, { new: true, runValidators: true });
    if (!company)
        throw new appError_1.default(404, 'NOT_FOUND', 'Company not found');
    return company;
};
exports.update = update;
const uploadLogo = async (companyId, file) => {
    const logoUrl = file.path;
    const company = await Company_1.default.findByIdAndUpdate(companyId, { logo: logoUrl }, { new: true });
    if (!company)
        throw new appError_1.default(404, 'NOT_FOUND', 'Company not found');
    return { logo: logoUrl };
};
exports.uploadLogo = uploadLogo;
const getSettings = async (companyId) => {
    let settings = await CompanySettings_1.default.findOne({ companyId });
    if (!settings) {
        settings = await CompanySettings_1.default.create({ companyId });
    }
    return settings;
};
exports.getSettings = getSettings;
const updateSettings = async (companyId, data) => {
    await CompanySettings_1.default.findOneAndUpdate({ companyId }, { $set: data }, { new: true, runValidators: true, upsert: true });
    return { success: true };
};
exports.updateSettings = updateSettings;
const listBranches = async (companyId) => {
    return Branch_1.default.find({ companyId }).sort({ createdAt: -1 });
};
exports.listBranches = listBranches;
const createBranch = async (companyId, data) => {
    const existing = await Branch_1.default.findOne({ companyId, code: data.code });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Branch code already exists for this company');
    const branch = await Branch_1.default.create({ ...data, companyId });
    return branch;
};
exports.createBranch = createBranch;
const updateBranch = async (companyId, branchId, data) => {
    const branch = await Branch_1.default.findOneAndUpdate({ _id: branchId, companyId }, data, { new: true, runValidators: true });
    if (!branch)
        throw new appError_1.default(404, 'NOT_FOUND', 'Branch not found');
    return branch;
};
exports.updateBranch = updateBranch;
const deleteBranch = async (companyId, branchId) => {
    const branch = await Branch_1.default.findOneAndDelete({ _id: branchId, companyId });
    if (!branch)
        throw new appError_1.default(404, 'NOT_FOUND', 'Branch not found');
    return { success: true };
};
exports.deleteBranch = deleteBranch;
//# sourceMappingURL=company.service.js.map