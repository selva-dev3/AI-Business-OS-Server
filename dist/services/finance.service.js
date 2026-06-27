"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetVsActual = exports.removeBudget = exports.updateBudget = exports.createBudget = exports.listBudgets = exports.scheduleReport = exports.apAging = exports.arAging = exports.taxReport = exports.cashFlow = exports.balanceSheet = exports.profitLoss = exports.getPaymentById = exports.listPayments = exports.uploadExpenseReceipt = exports.rejectExpense = exports.approveExpense = exports.removeExpense = exports.updateExpense = exports.getExpenseById = exports.createExpense = exports.listExpenses = exports.exportInvoices = exports.getInvoicePDF = exports.getInvoicePayments = exports.recordPayment = exports.sendInvoice = exports.removeInvoice = exports.updateInvoice = exports.getInvoiceById = exports.createInvoice = exports.listInvoices = void 0;
const Invoice_1 = __importDefault(require("../models/Invoice"));
const InvoiceItem_1 = __importDefault(require("../models/InvoiceItem"));
const Payment_1 = __importDefault(require("../models/Payment"));
const Expense_1 = __importDefault(require("../models/Expense"));
const Budget_1 = __importDefault(require("../models/Budget"));
const ReportSchedule_1 = __importDefault(require("../models/ReportSchedule"));
const appError_1 = __importDefault(require("../utils/appError"));
const emailService_1 = require("../utils/emailService");
const pdfkit_1 = __importDefault(require("pdfkit"));
const generateInvoiceNumber = async (companyId, type) => {
    const prefix = type === 'SALES' ? 'INV' : type === 'PURCHASE' ? 'PUR' : 'EXP';
    const count = await Invoice_1.default.countDocuments({ companyId, type });
    const padded = String(count + 1).padStart(5, '0');
    return `${prefix}-${new Date().getFullYear()}-${padded}`;
};
const calculateItemTotal = (item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const discountAmount = lineTotal * (item.discount / 100);
    const taxable = lineTotal - discountAmount;
    const taxAmount = taxable * (item.taxRate / 100);
    return { total: taxable + taxAmount, taxAmount, discountAmount };
};
const calculateInvoiceTotals = (items, discount = 0) => {
    let subtotal = 0;
    let taxAmount = 0;
    const itemTotals = items.map(item => {
        const calc = calculateItemTotal(item);
        subtotal += calc.total;
        taxAmount += calc.taxAmount;
        return { ...item, ...calc };
    });
    const discountAmount = subtotal * (discount / 100);
    const totalAmount = subtotal - discountAmount;
    return { itemTotals, subtotal, taxAmount, discountAmount, totalAmount };
};
const listInvoices = async (companyId, { type, status, accountId, startDate, endDate, search, page = 1, limit = 20 }) => {
    const filter = { companyId };
    if (type)
        filter.type = type;
    if (status)
        filter.status = status;
    if (accountId)
        filter.accountId = accountId;
    if (startDate || endDate) {
        filter.issueDate = {};
        if (startDate)
            filter.issueDate.$gte = new Date(startDate);
        if (endDate)
            filter.issueDate.$lte = new Date(endDate);
    }
    if (search) {
        filter.$or = [
            { invoiceNumber: new RegExp(search, 'i') },
            { notes: new RegExp(search, 'i') },
        ];
    }
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (p - 1) * l;
    const [data, total] = await Promise.all([
        Invoice_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).populate('accountId', 'name email'),
        Invoice_1.default.countDocuments(filter),
    ]);
    return { data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } };
};
exports.listInvoices = listInvoices;
const createInvoice = async (companyId, data) => {
    const invoiceNumber = await generateInvoiceNumber(companyId, data.type);
    const { itemTotals, subtotal, taxAmount, totalAmount } = calculateInvoiceTotals(data.items, data.discount);
    const invoice = await Invoice_1.default.create({
        companyId,
        invoiceNumber,
        type: data.type,
        accountId: data.accountId,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        currency: data.currency,
        subtotal,
        taxAmount,
        discount: data.discount,
        totalAmount,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
    });
    const items = await InvoiceItem_1.default.insertMany(itemTotals.map(item => ({
        invoiceId: invoice._id,
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        discount: item.discount,
        totalAmount: item.total,
    })));
    return { ...invoice.toJSON(), items };
};
exports.createInvoice = createInvoice;
const getInvoiceById = async (companyId, id) => {
    const invoice = await Invoice_1.default.findOne({ _id: id, companyId }).populate('accountId', 'name email');
    if (!invoice)
        throw new appError_1.default(404, 'NOT_FOUND', 'Invoice not found');
    const items = await InvoiceItem_1.default.find({ invoiceId: id });
    const payments = await Payment_1.default.find({ invoiceId: id }).sort({ paidAt: -1 });
    return { ...invoice.toJSON(), items, payments };
};
exports.getInvoiceById = getInvoiceById;
const updateInvoice = async (companyId, id, data) => {
    const invoice = await Invoice_1.default.findOneAndUpdate({ _id: id, companyId }, { $set: data }, { new: true, runValidators: true });
    if (!invoice)
        throw new appError_1.default(404, 'NOT_FOUND', 'Invoice not found');
    return invoice;
};
exports.updateInvoice = updateInvoice;
const removeInvoice = async (companyId, id) => {
    const invoice = await Invoice_1.default.findOne({ _id: id, companyId });
    if (!invoice)
        throw new appError_1.default(404, 'NOT_FOUND', 'Invoice not found');
    if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Cannot void a paid or already cancelled invoice');
    }
    invoice.status = 'CANCELLED';
    invoice.cancelledAt = new Date();
    await invoice.save();
    return { success: true };
};
exports.removeInvoice = removeInvoice;
const sendInvoice = async (companyId, id, { to, cc: _cc, subject, message }) => {
    const invoice = await Invoice_1.default.findOne({ _id: id, companyId });
    if (!invoice)
        throw new appError_1.default(404, 'NOT_FOUND', 'Invoice not found');
    await (0, emailService_1.sendEmail)({
        to: to,
        subject: subject || `Invoice ${invoice.invoiceNumber}`,
        html: `<p>${message || ''}</p><p>Invoice: ${invoice.invoiceNumber}</p><p>Amount: ${invoice.totalAmount} ${invoice.currency}</p><p>Due Date: ${invoice.dueDate.toISOString().split('T')[0]}</p>`,
    });
    invoice.status = 'SENT';
    invoice.sentAt = new Date();
    await invoice.save();
    return invoice;
};
exports.sendInvoice = sendInvoice;
const recordPayment = async (companyId, userId, invoiceId, data) => {
    const invoice = await Invoice_1.default.findOne({ _id: invoiceId, companyId });
    if (!invoice)
        throw new appError_1.default(404, 'NOT_FOUND', 'Invoice not found');
    if (invoice.status === 'CANCELLED')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Cannot record payment for a cancelled invoice');
    const payment = await Payment_1.default.create({
        invoiceId,
        companyId,
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        paidAt: data.paidAt,
        notes: data.notes,
        createdBy: userId,
    });
    const totalPaid = (invoice.paidAmount || 0) + data.amount;
    invoice.paidAmount = totalPaid;
    invoice.balanceDue = (invoice.totalAmount || 0) - totalPaid;
    if (invoice.balanceDue <= 0) {
        invoice.status = 'PAID';
    }
    else {
        invoice.status = 'PARTIALLY_PAID';
    }
    await invoice.save();
    return payment;
};
exports.recordPayment = recordPayment;
const getInvoicePayments = async (companyId, invoiceId) => {
    const invoice = await Invoice_1.default.findOne({ _id: invoiceId, companyId });
    if (!invoice)
        throw new appError_1.default(404, 'NOT_FOUND', 'Invoice not found');
    return Payment_1.default.find({ invoiceId }).sort({ paidAt: -1 }).populate('createdBy', 'name email');
};
exports.getInvoicePayments = getInvoicePayments;
const getInvoicePDF = async (companyId, id) => {
    const invoice = await Invoice_1.default.findOne({ _id: id, companyId }).populate('accountId', 'name email phone address');
    if (!invoice)
        throw new appError_1.default(404, 'NOT_FOUND', 'Invoice not found');
    const items = await InvoiceItem_1.default.find({ invoiceId: id });
    const doc = new pdfkit_1.default({ margin: 50 });
    const buffers = [];
    doc.on('data', (buf) => buffers.push(buf));
    doc.fontSize(24).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`);
    doc.text(`Issue Date: ${invoice.issueDate.toISOString().split('T')[0]}`);
    doc.text(`Due Date: ${invoice.dueDate.toISOString().split('T')[0]}`);
    doc.text(`Status: ${invoice.status}`);
    doc.moveDown();
    const account = invoice.accountId;
    if (account) {
        doc.fontSize(14).text('Bill To:');
        doc.fontSize(12).text(account.name);
        if (account.email)
            doc.text(account.email);
        if (account.phone)
            doc.text(account.phone);
        doc.moveDown();
    }
    const tableTop = doc.y;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Description', 50, tableTop, { width: 200 });
    doc.text('Qty', 260, tableTop, { width: 50, align: 'center' });
    doc.text('Price', 320, tableTop, { width: 80, align: 'right' });
    doc.text('Total', 420, tableTop, { width: 80, align: 'right' });
    doc.moveDown();
    doc.font('Helvetica');
    let y = doc.y;
    for (const item of items) {
        doc.text(item.description || '', 50, y, { width: 200 });
        doc.text(String(item.quantity), 260, y, { width: 50, align: 'center' });
        doc.text((item.unitPrice || 0).toFixed(2), 320, y, { width: 80, align: 'right' });
        doc.text((item.totalAmount || 0).toFixed(2), 420, y, { width: 80, align: 'right' });
        y += 20;
    }
    doc.moveDown();
    doc.text(`Subtotal: ${(invoice.subtotal || 0).toFixed(2)}`, { align: 'right' });
    doc.text(`Tax: ${(invoice.taxAmount || 0).toFixed(2)}`, { align: 'right' });
    doc.text(`Discount: ${(invoice.discount || 0).toFixed(2)}`, { align: 'right' });
    doc.font('Helvetica-Bold').text(`Total: ${(invoice.totalAmount || 0).toFixed(2)} ${invoice.currency}`, { align: 'right' });
    doc.end();
    return new Promise(resolve => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
};
exports.getInvoicePDF = getInvoicePDF;
const exportInvoices = async (companyId, { type, status, startDate, endDate }) => {
    const filter = { companyId };
    if (type)
        filter.type = type;
    if (status)
        filter.status = status;
    if (startDate || endDate) {
        filter.issueDate = {};
        if (startDate)
            filter.issueDate.$gte = new Date(startDate);
        if (endDate)
            filter.issueDate.$lte = new Date(endDate);
    }
    return Invoice_1.default.find(filter).sort({ createdAt: -1 }).populate('accountId', 'name email');
};
exports.exportInvoices = exportInvoices;
const listExpenses = async (companyId, { status, category, employeeId, startDate, endDate, search, page = 1, limit = 20 }) => {
    const filter = { companyId };
    if (status)
        filter.status = status;
    if (category)
        filter.category = category;
    if (employeeId)
        filter.employeeId = employeeId;
    if (startDate || endDate) {
        filter.date = {};
        if (startDate)
            filter.date.$gte = new Date(startDate);
        if (endDate)
            filter.date.$lte = new Date(endDate);
    }
    if (search) {
        filter.$or = [
            { title: new RegExp(search, 'i') },
            { notes: new RegExp(search, 'i') },
        ];
    }
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (p - 1) * l;
    const [data, total] = await Promise.all([
        Expense_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).populate('employeeId', 'name email'),
        Expense_1.default.countDocuments(filter),
    ]);
    return { data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } };
};
exports.listExpenses = listExpenses;
const createExpense = async (companyId, employeeId, data) => {
    return Expense_1.default.create({ ...data, companyId, employeeId });
};
exports.createExpense = createExpense;
const getExpenseById = async (companyId, id) => {
    const expense = await Expense_1.default.findOne({ _id: id, companyId }).populate('employeeId', 'name email').populate('approvedBy', 'name');
    if (!expense)
        throw new appError_1.default(404, 'NOT_FOUND', 'Expense not found');
    return expense;
};
exports.getExpenseById = getExpenseById;
const updateExpense = async (companyId, id, data) => {
    const expense = await Expense_1.default.findOneAndUpdate({ _id: id, companyId }, { $set: data }, { new: true, runValidators: true });
    if (!expense)
        throw new appError_1.default(404, 'NOT_FOUND', 'Expense not found');
    return expense;
};
exports.updateExpense = updateExpense;
const removeExpense = async (companyId, id) => {
    const expense = await Expense_1.default.findOneAndDelete({ _id: id, companyId });
    if (!expense)
        throw new appError_1.default(404, 'NOT_FOUND', 'Expense not found');
    return { success: true };
};
exports.removeExpense = removeExpense;
const approveExpense = async (companyId, id, userId, { notes }) => {
    const expense = await Expense_1.default.findOne({ _id: id, companyId });
    if (!expense)
        throw new appError_1.default(404, 'NOT_FOUND', 'Expense not found');
    if (expense.status !== 'PENDING')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Only pending expenses can be approved');
    expense.status = 'APPROVED';
    expense.approvedBy = userId;
    expense.approvedAt = new Date();
    if (notes)
        expense.notes = notes;
    await expense.save();
    return expense;
};
exports.approveExpense = approveExpense;
const rejectExpense = async (companyId, id, userId, { notes }) => {
    const expense = await Expense_1.default.findOne({ _id: id, companyId });
    if (!expense)
        throw new appError_1.default(404, 'NOT_FOUND', 'Expense not found');
    if (expense.status !== 'PENDING')
        throw new appError_1.default(400, 'BAD_REQUEST', 'Only pending expenses can be rejected');
    expense.status = 'REJECTED';
    expense.rejectedBy = userId;
    expense.rejectedAt = new Date();
    if (notes)
        expense.notes = notes;
    await expense.save();
    return expense;
};
exports.rejectExpense = rejectExpense;
const uploadExpenseReceipt = async (companyId, id, file) => {
    const expense = await Expense_1.default.findOne({ _id: id, companyId });
    if (!expense)
        throw new appError_1.default(404, 'NOT_FOUND', 'Expense not found');
    expense.receipt = file.path;
    await expense.save();
    return expense;
};
exports.uploadExpenseReceipt = uploadExpenseReceipt;
const listPayments = async (companyId, { method, startDate, endDate, page = 1, limit = 20 }) => {
    const filter = { companyId };
    if (method)
        filter.method = method;
    if (startDate || endDate) {
        filter.paidAt = {};
        if (startDate)
            filter.paidAt.$gte = new Date(startDate);
        if (endDate)
            filter.paidAt.$lte = new Date(endDate);
    }
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (p - 1) * l;
    const [data, total] = await Promise.all([
        Payment_1.default.find(filter).sort({ paidAt: -1 }).skip(skip).limit(l).populate('invoiceId', 'invoiceNumber').populate('createdBy', 'name'),
        Payment_1.default.countDocuments(filter),
    ]);
    return { data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } };
};
exports.listPayments = listPayments;
const getPaymentById = async (companyId, id) => {
    const payment = await Payment_1.default.findOne({ _id: id, companyId }).populate('invoiceId', 'invoiceNumber totalAmount').populate('createdBy', 'name');
    if (!payment)
        throw new appError_1.default(404, 'NOT_FOUND', 'Payment not found');
    return payment;
};
exports.getPaymentById = getPaymentById;
const profitLoss = async (companyId, { startDate, endDate }) => {
    const dateFilter = {};
    if (startDate)
        dateFilter.$gte = new Date(startDate);
    if (endDate)
        dateFilter.$lte = new Date(endDate);
    const invoiceFilter = { companyId };
    if (Object.keys(dateFilter).length)
        invoiceFilter.issueDate = dateFilter;
    const expenseFilter = { companyId, status: { $ne: 'REJECTED' } };
    if (Object.keys(dateFilter).length)
        expenseFilter.date = dateFilter;
    const [invoices, expenses] = await Promise.all([
        Invoice_1.default.find(invoiceFilter),
        Expense_1.default.find(expenseFilter),
    ]);
    const salesRevenue = invoices.filter(i => i.type === 'SALES').reduce((s, i) => s + (i.totalAmount || 0), 0);
    const purchaseCost = invoices.filter(i => i.type === 'PURCHASE').reduce((s, i) => s + (i.totalAmount || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const grossProfit = salesRevenue - purchaseCost;
    const netProfit = grossProfit - totalExpenses;
    return { salesRevenue, purchaseCost, totalExpenses, grossProfit, netProfit };
};
exports.profitLoss = profitLoss;
const balanceSheet = async (companyId, { asOf }) => {
    const asOfDate = asOf ? new Date(asOf) : new Date();
    const invoiceFilter = { companyId, issueDate: { $lte: asOfDate } };
    const invoices = await Invoice_1.default.find(invoiceFilter);
    const totalReceivables = invoices
        .filter(i => i.type === 'SALES' && ['SENT', 'PARTIALLY_PAID', 'OVERDUE'].includes(i.status))
        .reduce((s, i) => s + (i.balanceDue || 0), 0);
    const totalPayables = invoices
        .filter(i => i.type === 'PURCHASE' && ['SENT', 'PARTIALLY_PAID', 'OVERDUE'].includes(i.status))
        .reduce((s, i) => s + (i.balanceDue || 0), 0);
    const totalRevenue = invoices.filter(i => i.type === 'SALES' && i.status === 'PAID').reduce((s, i) => s + (i.totalAmount || 0), 0);
    return { totalReceivables, totalPayables, totalRevenue, asOf: asOfDate };
};
exports.balanceSheet = balanceSheet;
const cashFlow = async (companyId, { startDate, endDate }) => {
    const dateFilter = {};
    if (startDate)
        dateFilter.$gte = new Date(startDate);
    if (endDate)
        dateFilter.$lte = new Date(endDate);
    const paymentFilter = { companyId };
    if (Object.keys(dateFilter).length)
        paymentFilter.paidAt = dateFilter;
    const expenseFilter = { companyId, status: 'APPROVED' };
    if (Object.keys(dateFilter).length)
        expenseFilter.date = dateFilter;
    const [payments, expenses] = await Promise.all([
        Payment_1.default.find(paymentFilter),
        Expense_1.default.find(expenseFilter),
    ]);
    const inflow = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const outflow = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    return { inflow, outflow, netCashFlow: inflow - outflow };
};
exports.cashFlow = cashFlow;
const taxReport = async (companyId, { startDate, endDate }) => {
    const dateFilter = {};
    if (startDate)
        dateFilter.$gte = new Date(startDate);
    if (endDate)
        dateFilter.$lte = new Date(endDate);
    const filter = { companyId };
    if (Object.keys(dateFilter).length)
        filter.issueDate = dateFilter;
    const invoices = await Invoice_1.default.find(filter);
    const totalTaxableSales = invoices.filter(i => i.type === 'SALES').reduce((s, i) => s + (i.subtotal || 0), 0);
    const totalTaxCollected = invoices.filter(i => i.type === 'SALES').reduce((s, i) => s + (i.taxAmount || 0), 0);
    const totalTaxablePurchases = invoices.filter(i => i.type === 'PURCHASE').reduce((s, i) => s + (i.subtotal || 0), 0);
    const totalTaxPaid = invoices.filter(i => i.type === 'PURCHASE').reduce((s, i) => s + (i.taxAmount || 0), 0);
    const netTaxLiability = totalTaxCollected - totalTaxPaid;
    return { totalTaxableSales, totalTaxCollected, totalTaxablePurchases, totalTaxPaid, netTaxLiability };
};
exports.taxReport = taxReport;
const arAging = async (companyId) => {
    const now = new Date();
    const invoices = await Invoice_1.default.find({
        companyId,
        type: 'SALES',
        status: { $in: ['SENT', 'PARTIALLY_PAID', 'OVERDUE'] },
    }).populate('accountId', 'name email');
    const aging = { current: [], '1-30': [], '31-60': [], '61-90': [], '90+': [] };
    for (const inv of invoices) {
        const daysOverdue = Math.floor((now.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        const entry = { invoice: inv.invoiceNumber, account: inv.accountId, amount: inv.balanceDue || 0, dueDate: inv.dueDate, daysOverdue };
        if (daysOverdue <= 0)
            aging.current.push(entry);
        else if (daysOverdue <= 30)
            aging['1-30'].push(entry);
        else if (daysOverdue <= 60)
            aging['31-60'].push(entry);
        else if (daysOverdue <= 90)
            aging['61-90'].push(entry);
        else
            aging['90+'].push(entry);
    }
    return aging;
};
exports.arAging = arAging;
const apAging = async (companyId) => {
    const now = new Date();
    const invoices = await Invoice_1.default.find({
        companyId,
        type: 'PURCHASE',
        status: { $in: ['SENT', 'PARTIALLY_PAID', 'OVERDUE'] },
    }).populate('accountId', 'name email');
    const aging = { current: [], '1-30': [], '31-60': [], '61-90': [], '90+': [] };
    for (const inv of invoices) {
        const daysOverdue = Math.floor((now.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        const entry = { invoice: inv.invoiceNumber, account: inv.accountId, amount: inv.balanceDue || 0, dueDate: inv.dueDate, daysOverdue };
        if (daysOverdue <= 0)
            aging.current.push(entry);
        else if (daysOverdue <= 30)
            aging['1-30'].push(entry);
        else if (daysOverdue <= 60)
            aging['31-60'].push(entry);
        else if (daysOverdue <= 90)
            aging['61-90'].push(entry);
        else
            aging['90+'].push(entry);
    }
    return aging;
};
exports.apAging = apAging;
const scheduleReport = async (companyId, data) => {
    const schedule = await ReportSchedule_1.default.create({ companyId, ...data, nextRunAt: new Date() });
    return schedule;
};
exports.scheduleReport = scheduleReport;
const listBudgets = async (companyId, { year, month, department, category, page = 1, limit = 20 }) => {
    const filter = { companyId };
    if (year)
        filter.year = year;
    if (month)
        filter.month = month;
    if (department)
        filter.department = department;
    if (category)
        filter.category = category;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (p - 1) * l;
    const [data, total] = await Promise.all([
        Budget_1.default.find(filter).sort({ year: -1, month: 1 }).skip(skip).limit(l),
        Budget_1.default.countDocuments(filter),
    ]);
    return { data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } };
};
exports.listBudgets = listBudgets;
const createBudget = async (companyId, data) => {
    const existing = await Budget_1.default.findOne({ companyId, year: data.year, department: data.department, category: data.category, month: data.month || null });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Budget already exists for this period/department/category');
    return Budget_1.default.create({ ...data, companyId });
};
exports.createBudget = createBudget;
const updateBudget = async (companyId, id, data) => {
    const budget = await Budget_1.default.findOneAndUpdate({ _id: id, companyId }, { $set: data }, { new: true, runValidators: true });
    if (!budget)
        throw new appError_1.default(404, 'NOT_FOUND', 'Budget not found');
    return budget;
};
exports.updateBudget = updateBudget;
const removeBudget = async (companyId, id) => {
    const budget = await Budget_1.default.findOneAndDelete({ _id: id, companyId });
    if (!budget)
        throw new appError_1.default(404, 'NOT_FOUND', 'Budget not found');
    return { success: true };
};
exports.removeBudget = removeBudget;
const budgetVsActual = async (companyId, { year, month, department }) => {
    const filter = { companyId };
    if (year)
        filter.year = year;
    if (month)
        filter.month = month;
    if (department)
        filter.department = department;
    const budgets = await Budget_1.default.find(filter);
    const expenseFilter = { companyId, status: { $ne: 'REJECTED' } };
    if (year && !month) {
        expenseFilter.date = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };
    }
    if (month && year) {
        expenseFilter.date = { $gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`), $lte: new Date(`${year}-${String(month).padStart(2, '0')}-31`) };
    }
    const expenses = await Expense_1.default.find(expenseFilter);
    const comparison = budgets.map(b => {
        const actual = expenses
            .filter(e => e.category === b.category)
            .reduce((s, e) => s + (e.amount || 0), 0);
        return {
            budget: b.toJSON(),
            actual,
            variance: (b.amount || 0) - actual,
            variancePercentage: (b.amount || 0) > 0 ? ((((b.amount || 0) - actual) / (b.amount || 0)) * 100).toFixed(2) : '0',
        };
    });
    return comparison;
};
exports.budgetVsActual = budgetVsActual;
//# sourceMappingURL=finance.service.js.map