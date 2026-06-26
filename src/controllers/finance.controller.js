const ApiResponse = require('../utils/apiResponse');
const financeService = require('../services/finance.service');

const listInvoices = async (req, res, next) => {
  try {
    const result = await financeService.listInvoices(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const createInvoice = async (req, res, next) => {
  try {
    const invoice = await financeService.createInvoice(req.companyId, req.body);
    return ApiResponse.created(res, invoice);
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await financeService.getInvoiceById(req.companyId, req.params.id);
    return ApiResponse.success(res, invoice);
  } catch (error) {
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await financeService.updateInvoice(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, invoice);
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const result = await financeService.removeInvoice(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const sendInvoice = async (req, res, next) => {
  try {
    const invoice = await financeService.sendInvoice(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, invoice);
  } catch (error) {
    next(error);
  }
};

const recordPayment = async (req, res, next) => {
  try {
    const payment = await financeService.recordPayment(req.companyId, req.user._id, req.params.id, req.body);
    return ApiResponse.created(res, payment);
  } catch (error) {
    next(error);
  }
};

const getInvoicePayments = async (req, res, next) => {
  try {
    const payments = await financeService.getInvoicePayments(req.companyId, req.params.id);
    return ApiResponse.success(res, payments);
  } catch (error) {
    next(error);
  }
};

const getInvoicePDF = async (req, res, next) => {
  try {
    const pdfBuffer = await financeService.getInvoicePDF(req.companyId, req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${req.params.id}.pdf`);
    return res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

const exportInvoices = async (req, res, next) => {
  try {
    const invoices = await financeService.exportInvoices(req.companyId, req.query);
    return ApiResponse.success(res, invoices);
  } catch (error) {
    next(error);
  }
};

const listExpenses = async (req, res, next) => {
  try {
    const result = await financeService.listExpenses(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const expense = await financeService.createExpense(req.companyId, req.user._id, req.body);
    return ApiResponse.created(res, expense);
  } catch (error) {
    next(error);
  }
};

const getExpense = async (req, res, next) => {
  try {
    const expense = await financeService.getExpenseById(req.companyId, req.params.id);
    return ApiResponse.success(res, expense);
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await financeService.updateExpense(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, expense);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const result = await financeService.removeExpense(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const approveExpense = async (req, res, next) => {
  try {
    const expense = await financeService.approveExpense(req.companyId, req.params.id, req.user._id, req.body);
    return ApiResponse.success(res, expense);
  } catch (error) {
    next(error);
  }
};

const rejectExpense = async (req, res, next) => {
  try {
    const expense = await financeService.rejectExpense(req.companyId, req.params.id, req.user._id, req.body);
    return ApiResponse.success(res, expense);
  } catch (error) {
    next(error);
  }
};

const uploadExpenseReceipt = async (req, res, next) => {
  try {
    const expense = await financeService.uploadExpenseReceipt(req.companyId, req.params.id, req.file);
    return ApiResponse.success(res, expense);
  } catch (error) {
    next(error);
  }
};

const listPayments = async (req, res, next) => {
  try {
    const result = await financeService.listPayments(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const payment = await financeService.getPaymentById(req.companyId, req.params.id);
    return ApiResponse.success(res, payment);
  } catch (error) {
    next(error);
  }
};

const profitLoss = async (req, res, next) => {
  try {
    const report = await financeService.profitLoss(req.companyId, req.query);
    return ApiResponse.success(res, report);
  } catch (error) {
    next(error);
  }
};

const balanceSheet = async (req, res, next) => {
  try {
    const report = await financeService.balanceSheet(req.companyId, req.query);
    return ApiResponse.success(res, report);
  } catch (error) {
    next(error);
  }
};

const cashFlow = async (req, res, next) => {
  try {
    const report = await financeService.cashFlow(req.companyId, req.query);
    return ApiResponse.success(res, report);
  } catch (error) {
    next(error);
  }
};

const taxReport = async (req, res, next) => {
  try {
    const report = await financeService.taxReport(req.companyId, req.query);
    return ApiResponse.success(res, report);
  } catch (error) {
    next(error);
  }
};

const arAging = async (req, res, next) => {
  try {
    const report = await financeService.arAging(req.companyId);
    return ApiResponse.success(res, report);
  } catch (error) {
    next(error);
  }
};

const apAging = async (req, res, next) => {
  try {
    const report = await financeService.apAging(req.companyId);
    return ApiResponse.success(res, report);
  } catch (error) {
    next(error);
  }
};

const scheduleReport = async (req, res, next) => {
  try {
    const schedule = await financeService.scheduleReport(req.companyId, req.body);
    return ApiResponse.created(res, schedule);
  } catch (error) {
    next(error);
  }
};

const listBudgets = async (req, res, next) => {
  try {
    const result = await financeService.listBudgets(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const createBudget = async (req, res, next) => {
  try {
    const budget = await financeService.createBudget(req.companyId, req.body);
    return ApiResponse.created(res, budget);
  } catch (error) {
    next(error);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const budget = await financeService.updateBudget(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, budget);
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const result = await financeService.removeBudget(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const budgetVsActual = async (req, res, next) => {
  try {
    const comparison = await financeService.budgetVsActual(req.companyId, req.query);
    return ApiResponse.success(res, comparison);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
  recordPayment,
  getInvoicePayments,
  getInvoicePDF,
  exportInvoices,
  listExpenses,
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
  uploadExpenseReceipt,
  listPayments,
  getPayment,
  profitLoss,
  balanceSheet,
  cashFlow,
  taxReport,
  arAging,
  apAging,
  scheduleReport,
  listBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  budgetVsActual,
};
