const procurementService = require('../services/procurement.service');
const ApiResponse = require('../utils/apiResponse');

// ---------- VENDORS ----------

const listVendors = async (req, res, next) => {
  try {
    const result = await procurementService.listVendors(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) { next(error); }
};

const createVendor = async (req, res, next) => {
  try {
    const vendor = await procurementService.createVendor(req.companyId, req.body);
    return ApiResponse.created(res, vendor);
  } catch (error) { next(error); }
};

const getVendorById = async (req, res, next) => {
  try {
    const vendor = await procurementService.getVendorById(req.companyId, req.params.id);
    return ApiResponse.success(res, vendor);
  } catch (error) { next(error); }
};

const updateVendor = async (req, res, next) => {
  try {
    const vendor = await procurementService.updateVendor(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, vendor);
  } catch (error) { next(error); }
};

const removeVendor = async (req, res, next) => {
  try {
    const result = await procurementService.removeVendor(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) { next(error); }
};

const getVendorPurchaseHistory = async (req, res, next) => {
  try {
    const result = await procurementService.getVendorPurchaseHistory(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) { next(error); }
};

// ---------- RFQ ----------

const listRFQs = async (req, res, next) => {
  try {
    const result = await procurementService.listRFQs(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) { next(error); }
};

const createRFQ = async (req, res, next) => {
  try {
    const rfq = await procurementService.createRFQ(req.companyId, req.user._id, req.body);
    return ApiResponse.created(res, rfq);
  } catch (error) { next(error); }
};

const getRFQById = async (req, res, next) => {
  try {
    const rfq = await procurementService.getRFQById(req.companyId, req.params.id);
    return ApiResponse.success(res, rfq);
  } catch (error) { next(error); }
};

const updateRFQ = async (req, res, next) => {
  try {
    const rfq = await procurementService.updateRFQ(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, rfq);
  } catch (error) { next(error); }
};

const removeRFQ = async (req, res, next) => {
  try {
    const result = await procurementService.removeRFQ(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) { next(error); }
};

const sendRFQ = async (req, res, next) => {
  try {
    const rfq = await procurementService.sendRFQ(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, rfq);
  } catch (error) { next(error); }
};

const getRFQQuotes = async (req, res, next) => {
  try {
    const quotes = await procurementService.getRFQQuotes(req.companyId, req.params.id);
    return ApiResponse.success(res, quotes);
  } catch (error) { next(error); }
};

const createPOFromQuote = async (req, res, next) => {
  try {
    const po = await procurementService.createPOFromQuote(req.companyId, req.user._id, req.body);
    return ApiResponse.created(res, po);
  } catch (error) { next(error); }
};

// ---------- PURCHASE ORDERS ----------

const listPOs = async (req, res, next) => {
  try {
    const result = await procurementService.listPOs(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) { next(error); }
};

const createPO = async (req, res, next) => {
  try {
    const po = await procurementService.createPO(req.companyId, req.user._id, req.body);
    return ApiResponse.created(res, po);
  } catch (error) { next(error); }
};

const getPOById = async (req, res, next) => {
  try {
    const po = await procurementService.getPOById(req.companyId, req.params.id);
    return ApiResponse.success(res, po);
  } catch (error) { next(error); }
};

const updatePO = async (req, res, next) => {
  try {
    const po = await procurementService.updatePO(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, po);
  } catch (error) { next(error); }
};

const submitPO = async (req, res, next) => {
  try {
    const po = await procurementService.submitPO(req.companyId, req.params.id);
    return ApiResponse.success(res, po);
  } catch (error) { next(error); }
};

const approvePO = async (req, res, next) => {
  try {
    const po = await procurementService.approvePO(req.companyId, req.params.id, req.user._id);
    return ApiResponse.success(res, po);
  } catch (error) { next(error); }
};

const rejectPO = async (req, res, next) => {
  try {
    const po = await procurementService.rejectPO(req.companyId, req.params.id, req.body.reason);
    return ApiResponse.success(res, po);
  } catch (error) { next(error); }
};

const cancelPO = async (req, res, next) => {
  try {
    const po = await procurementService.cancelPO(req.companyId, req.params.id, req.body.reason);
    return ApiResponse.success(res, po);
  } catch (error) { next(error); }
};

const createReceipt = async (req, res, next) => {
  try {
    const receipt = await procurementService.createReceipt(req.companyId, req.user._id, req.params.id, req.body);
    return ApiResponse.created(res, receipt);
  } catch (error) { next(error); }
};

const getReceipts = async (req, res, next) => {
  try {
    const receipts = await procurementService.getReceipts(req.companyId, req.params.id);
    return ApiResponse.success(res, receipts);
  } catch (error) { next(error); }
};

const exportPOs = async (req, res, next) => {
  try {
    const pos = await procurementService.exportPOs(req.companyId, req.query);
    return ApiResponse.success(res, pos);
  } catch (error) { next(error); }
};

module.exports = {
  listVendors,
  createVendor,
  getVendorById,
  updateVendor,
  removeVendor,
  getVendorPurchaseHistory,
  listRFQs,
  createRFQ,
  getRFQById,
  updateRFQ,
  removeRFQ,
  sendRFQ,
  getRFQQuotes,
  createPOFromQuote,
  listPOs,
  createPO,
  getPOById,
  updatePO,
  submitPO,
  approvePO,
  rejectPO,
  cancelPO,
  createReceipt,
  getReceipts,
  exportPOs,
};
