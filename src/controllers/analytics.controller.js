const ApiResponse = require('../utils/apiResponse');
const analyticsService = require('../services/analytics.service');

const getOverview = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await analyticsService.getOverview(from, to, req.companyId);
    return ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

const getRevenue = async (req, res, next) => {
  try {
    const { period, from, to } = req.query;
    const data = await analyticsService.getRevenue(period || 'monthly', from, to, req.companyId);
    return ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

const getHRMS = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await analyticsService.getHRMS(from, to, req.companyId);
    return ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

const getCRM = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await analyticsService.getCRM(from, to, req.companyId);
    return ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

const getInventory = async (req, res, next) => {
  try {
    const { warehouseId } = req.query;
    const data = await analyticsService.getInventory(warehouseId, req.companyId);
    return ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

const getSupport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await analyticsService.getSupport(from, to, req.companyId);
    return ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

const getFinance = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await analyticsService.getFinance(from, to, req.companyId);
    return ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

const getAIInsights = async (req, res, next) => {
  try {
    const { module, data } = req.body;
    const insights = await analyticsService.getAIInsights(module, data);
    return ApiResponse.success(res, insights);
  } catch (error) {
    next(error);
  }
};

const scheduleReport = async (req, res, next) => {
  try {
    const schedule = await analyticsService.scheduleReport(req.body, req.companyId);
    return ApiResponse.created(res, schedule);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getRevenue,
  getHRMS,
  getCRM,
  getInventory,
  getSupport,
  getFinance,
  getAIInsights,
  scheduleReport,
};
