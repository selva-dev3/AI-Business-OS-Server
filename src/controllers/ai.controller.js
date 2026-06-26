const ApiResponse = require('../utils/apiResponse');
const aiService = require('../services/ai.service');

const chat = async (req, res, next) => {
  try {
    const { messages, context } = req.body;
    const result = await aiService.chat(messages, context);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const getInsights = async (req, res, next) => {
  try {
    const { module, data } = req.body;
    const insights = await aiService.getInsights(module, data);
    return ApiResponse.success(res, insights);
  } catch (error) {
    next(error);
  }
};

const summarize = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.body;
    const result = await aiService.summarize(entityType, entityId);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const generateEmail = async (req, res, next) => {
  try {
    const result = await aiService.generateEmail(req.body);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const extractDocument = async (req, res, next) => {
  try {
    const result = await aiService.extractDocument(req.file);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const forecast = async (req, res, next) => {
  try {
    const { label, historicalData, periods } = req.body;
    const result = await aiService.forecast(historicalData, periods);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const parseResume = async (req, res, next) => {
  try {
    const result = await aiService.parseResume(req.file);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  getInsights,
  summarize,
  generateEmail,
  extractDocument,
  forecast,
  parseResume,
};
