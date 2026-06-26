const ApiResponse = require('../utils/apiResponse');
const companyService = require('../services/company.service');

const get = async (req, res, next) => {
  try {
    const company = await companyService.get(req.companyId);
    return ApiResponse.success(res, company);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const company = await companyService.update(req.companyId, req.body);
    return ApiResponse.success(res, company);
  } catch (error) {
    next(error);
  }
};

const uploadLogo = async (req, res, next) => {
  try {
    const result = await companyService.uploadLogo(req.companyId, req.file);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const settings = await companyService.getSettings(req.companyId);
    return ApiResponse.success(res, settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const result = await companyService.updateSettings(req.companyId, req.body);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const listBranches = async (req, res, next) => {
  try {
    const branches = await companyService.listBranches(req.companyId);
    return ApiResponse.success(res, branches);
  } catch (error) {
    next(error);
  }
};

const createBranch = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const branch = await companyService.createBranch(req.companyId, req.body);
    return ApiResponse.created(res, branch);
  } catch (error) {
    next(error);
  }
};

const updateBranch = async (req, res, next) => {
  try {
    const branch = await companyService.updateBranch(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, branch);
  } catch (error) {
    next(error);
  }
};

const deleteBranch = async (req, res, next) => {
  try {
    const result = await companyService.deleteBranch(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
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
