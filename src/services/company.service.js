const Company = require('../models/Company');
const CompanySettings = require('../models/CompanySettings');
const Branch = require('../models/Branch');
const AppError = require('../utils/appError');

const get = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) throw new AppError(404, 'NOT_FOUND', 'Company not found');
  return company;
};

const update = async (companyId, data) => {
  const company = await Company.findByIdAndUpdate(companyId, data, { new: true, runValidators: true });
  if (!company) throw new AppError(404, 'NOT_FOUND', 'Company not found');
  return company;
};

const uploadLogo = async (companyId, file) => {
  const logoUrl = file.path;
  const company = await Company.findByIdAndUpdate(companyId, { logo: logoUrl }, { new: true });
  if (!company) throw new AppError(404, 'NOT_FOUND', 'Company not found');
  return { logo: logoUrl };
};

const getSettings = async (companyId) => {
  let settings = await CompanySettings.findOne({ companyId });
  if (!settings) {
    settings = await CompanySettings.create({ companyId });
  }
  return settings;
};

const updateSettings = async (companyId, data) => {
  const settings = await CompanySettings.findOneAndUpdate(
    { companyId },
    { $set: data },
    { new: true, runValidators: true, upsert: true }
  );
  return { success: true };
};

const listBranches = async (companyId) => {
  return Branch.find({ companyId }).sort({ createdAt: -1 });
};

const createBranch = async (companyId, data) => {
  const existing = await Branch.findOne({ companyId, code: data.code });
  if (existing) throw new AppError(409, 'CONFLICT', 'Branch code already exists for this company');

  const branch = await Branch.create({ ...data, companyId });
  return branch;
};

const updateBranch = async (companyId, branchId, data) => {
  const branch = await Branch.findOneAndUpdate(
    { _id: branchId, companyId },
    data,
    { new: true, runValidators: true }
  );
  if (!branch) throw new AppError(404, 'NOT_FOUND', 'Branch not found');
  return branch;
};

const deleteBranch = async (companyId, branchId) => {
  const branch = await Branch.findOneAndDelete({ _id: branchId, companyId });
  if (!branch) throw new AppError(404, 'NOT_FOUND', 'Branch not found');
  return { success: true };
};

module.exports = {
  get,
  update,
  uploadLogo,
  getSettings,
  updateSettings,
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch,
};
