"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivity = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const Deal_1 = __importDefault(require("../models/Deal"));
const Activity_1 = __importDefault(require("../models/Activity"));
const PurchaseOrder_1 = __importDefault(require("../models/PurchaseOrder"));
const RFQ_1 = __importDefault(require("../models/RFQ"));
const Product_1 = __importDefault(require("../models/Product"));
const StockMovement_1 = __importDefault(require("../models/StockMovement"));
const StockTransfer_1 = __importDefault(require("../models/StockTransfer"));
const Employee_1 = __importDefault(require("../models/Employee"));
const LeaveRequest_1 = __importDefault(require("../models/LeaveRequest"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
const Expense_1 = __importDefault(require("../models/Expense"));
const Payment_1 = __importDefault(require("../models/Payment"));
function buildItem({ module, action, title, description, status, refId, refModel, meta, timestamp, user }) {
    return {
        module,
        action,
        title,
        description,
        status: status || null,
        refId: refId ? String(refId) : null,
        refModel: refModel || null,
        meta: meta || {},
        timestamp,
        user: user
            ? {
                id: String(user._id || user.id || user),
                name: user.firstName || user.name
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined
                    : undefined,
            }
            : null,
    };
}
const getActivity = async (companyId, { limit = 30, module: filterModule } = {}) => {
    const parsedLimit = Math.min(Math.max(parseInt(String(limit), 10) || 30, 1), 100);
    const perModule = Math.ceil(parsedLimit / 5) + 2;
    const promises = [];
    if (!filterModule || filterModule === 'CRM') {
        promises.push(Lead_1.default.find({ companyId })
            .sort({ updatedAt: -1 })
            .limit(perModule)
            .populate('ownerId', 'firstName lastName')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'CRM',
            action: d.status === 'NEW' ? 'created' : 'updated',
            title: `Lead: ${d.title}`,
            description: `${d.firstName} ${d.lastName} — ${d.status}`,
            status: d.status,
            refId: d._id.toString(),
            refModel: 'Lead',
            meta: { source: d.source, score: d.score },
            timestamp: d.updatedAt,
            user: d.ownerId,
        }))));
        promises.push(Deal_1.default.find({ companyId })
            .sort({ updatedAt: -1 })
            .limit(perModule)
            .populate('ownerId', 'firstName lastName')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'CRM',
            action: d.stage === 'WON' ? 'won' : d.stage === 'LOST' ? 'lost' : 'updated',
            title: `Deal: ${d.title}`,
            description: `Stage ${d.stage} — ₹${(d.value || 0).toLocaleString('en-IN')}`,
            status: d.stage,
            refId: d._id.toString(),
            refModel: 'Deal',
            meta: { value: d.value, probability: d.probability },
            timestamp: d.updatedAt,
            user: d.ownerId,
        }))));
        promises.push(Activity_1.default.find({ companyId })
            .sort({ updatedAt: -1 })
            .limit(perModule)
            .populate('createdBy', 'firstName lastName')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'CRM',
            action: d.isCompleted ? 'completed' : 'created',
            title: `${d.type}: ${d.subject}`,
            description: d.description || d.outcome || '',
            status: d.isCompleted ? 'COMPLETED' : 'PENDING',
            refId: d._id.toString(),
            refModel: 'Activity',
            timestamp: d.updatedAt,
            user: d.createdBy,
        }))));
    }
    if (!filterModule || filterModule === 'PROCUREMENT') {
        promises.push(PurchaseOrder_1.default.find({ companyId })
            .sort({ updatedAt: -1 })
            .limit(perModule)
            .populate('vendorId', 'name')
            .populate('createdBy', 'firstName lastName')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'PROCUREMENT',
            action: d.status === 'DRAFT'
                ? 'created'
                : d.status === 'APPROVED'
                    ? 'approved'
                    : d.status === 'REJECTED'
                        ? 'rejected'
                        : 'updated',
            title: `PO: ${d.poNumber}`,
            description: `Vendor: ${d.vendorId?.name || 'N/A'} — ₹${(d.totalAmount || 0).toLocaleString('en-IN')}`,
            status: d.status,
            refId: d._id.toString(),
            refModel: 'PurchaseOrder',
            meta: { totalAmount: d.totalAmount, vendor: d.vendorId?.name },
            timestamp: d.updatedAt,
            user: d.createdBy,
        }))));
        promises.push(RFQ_1.default.find({ companyId })
            .sort({ updatedAt: -1 })
            .limit(perModule)
            .populate('createdBy', 'firstName lastName')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'PROCUREMENT',
            action: 'created',
            title: `RFQ: ${d.rfqNumber || d._id}`,
            description: `Status: ${d.status || 'DRAFT'}`,
            status: d.status,
            refId: d._id.toString(),
            refModel: 'RFQ',
            timestamp: d.updatedAt,
            user: d.createdBy,
        })))
            .catch(() => []));
    }
    if (!filterModule || filterModule === 'INVENTORY') {
        promises.push(StockMovement_1.default.find({ companyId })
            .sort({ createdAt: -1 })
            .limit(perModule)
            .populate('productId', 'name sku')
            .populate('warehouseId', 'name')
            .populate('createdBy', 'firstName lastName')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'INVENTORY',
            action: d.type.toLowerCase().replace('_', ' '),
            title: `Stock ${d.type.replace('_', ' ')}`,
            description: `${d.productId?.name || 'Product'} (${d.productId?.sku || ''}) — Qty: ${d.quantity}`,
            status: d.type,
            refId: d._id.toString(),
            refModel: 'StockMovement',
            meta: {
                warehouse: d.warehouseId?.name,
                quantityBefore: d.quantityBefore,
                quantityAfter: d.quantityAfter,
            },
            timestamp: d.createdAt,
            user: d.createdBy,
        }))));
        promises.push(StockTransfer_1.default.find({ companyId })
            .sort({ updatedAt: -1 })
            .limit(perModule)
            .populate('createdBy', 'firstName lastName')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'INVENTORY',
            action: 'transfer',
            title: `Transfer: ${d.transferNumber || d._id}`,
            description: `Status: ${d.status || 'PENDING'}`,
            status: d.status,
            refId: d._id.toString(),
            refModel: 'StockTransfer',
            timestamp: d.updatedAt,
            user: d.createdBy,
        })))
            .catch(() => []));
        promises.push(Product_1.default.find({ companyId })
            .sort({ createdAt: -1 })
            .limit(perModule)
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'INVENTORY',
            action: 'created',
            title: `Product: ${d.name}`,
            description: `SKU: ${d.sku || 'N/A'} — ₹${(d.sellingPrice || 0).toLocaleString('en-IN')}`,
            status: d.status || 'ACTIVE',
            refId: d._id.toString(),
            refModel: 'Product',
            meta: { sku: d.sku, costPrice: d.costPrice, sellingPrice: d.sellingPrice },
            timestamp: d.createdAt,
        }))));
    }
    if (!filterModule || filterModule === 'HRMS') {
        promises.push(Employee_1.default.find({ companyId })
            .sort({ createdAt: -1 })
            .limit(perModule)
            .populate('departmentId', 'name')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'HRMS',
            action: d.status === 'TERMINATED' ? 'terminated' : 'onboarded',
            title: `Employee: ${d.firstName} ${d.lastName || ''}`,
            description: `${d.employeeCode} — ${d.departmentId?.name || 'Unassigned'}`,
            status: d.status,
            refId: d._id.toString(),
            refModel: 'Employee',
            meta: { employmentType: d.employmentType, department: d.departmentId?.name },
            timestamp: d.createdAt,
        }))));
        promises.push(LeaveRequest_1.default.find({ companyId })
            .sort({ updatedAt: -1 })
            .limit(perModule)
            .populate('employeeId', 'firstName lastName employeeCode')
            .populate('leaveTypeId', 'name')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'HRMS',
            action: d.status === 'APPROVED'
                ? 'approved'
                : d.status === 'REJECTED'
                    ? 'rejected'
                    : 'requested',
            title: `Leave: ${d.leaveTypeId?.name || 'Leave'}`,
            description: `${d.employeeId?.firstName || ''} ${d.employeeId?.lastName || ''} — ${d.days} day(s)`,
            status: d.status,
            refId: d._id.toString(),
            refModel: 'LeaveRequest',
            meta: { days: d.days, reason: d.reason },
            timestamp: d.updatedAt,
            user: d.employeeId,
        }))));
    }
    if (!filterModule || filterModule === 'FINANCE') {
        promises.push(Invoice_1.default.find({ companyId })
            .sort({ updatedAt: -1 })
            .limit(perModule)
            .populate('accountId', 'name')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'FINANCE',
            action: d.status === 'PAID'
                ? 'paid'
                : d.status === 'OVERDUE'
                    ? 'overdue'
                    : d.status === 'SENT'
                        ? 'sent'
                        : 'created',
            title: `Invoice: ${d.invoiceNumber}`,
            description: `${d.type} — ₹${(d.totalAmount || 0).toLocaleString('en-IN')}`,
            status: d.status,
            refId: d._id.toString(),
            refModel: 'Invoice',
            meta: { totalAmount: d.totalAmount, balanceDue: d.balanceDue, type: d.type },
            timestamp: d.updatedAt,
        }))));
        promises.push(Expense_1.default.find({ companyId })
            .sort({ updatedAt: -1 })
            .limit(perModule)
            .populate('employeeId', 'firstName lastName')
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'FINANCE',
            action: d.status === 'APPROVED'
                ? 'approved'
                : d.status === 'REIMBURSED'
                    ? 'reimbursed'
                    : 'submitted',
            title: `Expense: ${d.title}`,
            description: `${d.category} — ₹${(d.amount || 0).toLocaleString('en-IN')} by ${d.employeeId?.firstName || 'N/A'}`,
            status: d.status,
            refId: d._id.toString(),
            refModel: 'Expense',
            meta: { amount: d.amount, category: d.category },
            timestamp: d.updatedAt,
            user: d.employeeId,
        }))));
        promises.push(Payment_1.default.find({ companyId })
            .sort({ createdAt: -1 })
            .limit(perModule)
            .lean()
            .then((docs) => docs.map((d) => buildItem({
            module: 'FINANCE',
            action: 'recorded',
            title: `Payment: ${d.paymentNumber || d._id}`,
            description: `₹${(d.amount || 0).toLocaleString('en-IN')} — ${d.method || d.paymentMethod || 'N/A'}`,
            status: d.status || 'COMPLETED',
            refId: d._id.toString(),
            refModel: 'Payment',
            meta: { amount: d.amount },
            timestamp: d.createdAt,
        })))
            .catch(() => []));
    }
    const results = await Promise.all(promises);
    const allActivities = results.flat();
    allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return {
        activities: allActivities.slice(0, parsedLimit),
        total: allActivities.length,
        modules: ['CRM', 'PROCUREMENT', 'INVENTORY', 'HRMS', 'FINANCE'],
    };
};
exports.getActivity = getActivity;
//# sourceMappingURL=dashboard.service.js.map