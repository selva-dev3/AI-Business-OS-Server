const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const PurchaseOrder = require('../models/PurchaseOrder');
const Vendor = require('../models/Vendor');
const RFQ = require('../models/RFQ');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const StockTransfer = require('../models/StockTransfer');
const Employee = require('../models/Employee');
const LeaveRequest = require('../models/LeaveRequest');
const Attendance = require('../models/Attendance');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Payment = require('../models/Payment');

/* ------------------------------------------------------------------ */
/*  Helper: build a unified activity item                              */
/* ------------------------------------------------------------------ */
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
          name:
            user.firstName || user.name
              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
              : undefined,
        }
      : null,
  };
}

/* ================================================================== */
/*  getActivity — aggregates recent activity across 5 modules          */
/* ================================================================== */
const getActivity = async (companyId, { limit = 30, module: filterModule } = {}) => {
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 30, 1), 100);
  const perModule = Math.ceil(parsedLimit / 5) + 2; // fetch a few extra per module, then trim

  const promises = [];

  /* ------ CRM ------ */
  if (!filterModule || filterModule === 'CRM') {
    // Recent leads
    promises.push(
      Lead.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(perModule)
        .populate('ownerId', 'firstName lastName')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'CRM',
              action: d.status === 'NEW' ? 'created' : 'updated',
              title: `Lead: ${d.title}`,
              description: `${d.firstName} ${d.lastName} — ${d.status}`,
              status: d.status,
              refId: d._id,
              refModel: 'Lead',
              meta: { source: d.source, score: d.score },
              timestamp: d.updatedAt,
              user: d.ownerId,
            })
          )
        )
    );

    // Recent deals
    promises.push(
      Deal.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(perModule)
        .populate('ownerId', 'firstName lastName')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'CRM',
              action: d.stage === 'WON' ? 'won' : d.stage === 'LOST' ? 'lost' : 'updated',
              title: `Deal: ${d.title}`,
              description: `Stage ${d.stage} — ₹${(d.value || 0).toLocaleString('en-IN')}`,
              status: d.stage,
              refId: d._id,
              refModel: 'Deal',
              meta: { value: d.value, probability: d.probability },
              timestamp: d.updatedAt,
              user: d.ownerId,
            })
          )
        )
    );

    // Recent CRM activities
    promises.push(
      Activity.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(perModule)
        .populate('createdBy', 'firstName lastName')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'CRM',
              action: d.isCompleted ? 'completed' : 'created',
              title: `${d.type}: ${d.subject}`,
              description: d.description || d.outcome || '',
              status: d.isCompleted ? 'COMPLETED' : 'PENDING',
              refId: d._id,
              refModel: 'Activity',
              timestamp: d.updatedAt,
              user: d.createdBy,
            })
          )
        )
    );
  }

  /* ------ PROCUREMENT ------ */
  if (!filterModule || filterModule === 'PROCUREMENT') {
    // Recent purchase orders
    promises.push(
      PurchaseOrder.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(perModule)
        .populate('vendorId', 'name')
        .populate('createdBy', 'firstName lastName')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'PROCUREMENT',
              action:
                d.status === 'DRAFT'
                  ? 'created'
                  : d.status === 'APPROVED'
                  ? 'approved'
                  : d.status === 'REJECTED'
                  ? 'rejected'
                  : 'updated',
              title: `PO: ${d.poNumber}`,
              description: `Vendor: ${d.vendorId?.name || 'N/A'} — ₹${(d.totalAmount || 0).toLocaleString('en-IN')}`,
              status: d.status,
              refId: d._id,
              refModel: 'PurchaseOrder',
              meta: { totalAmount: d.totalAmount, vendor: d.vendorId?.name },
              timestamp: d.updatedAt,
              user: d.createdBy,
            })
          )
        )
    );

    // Recent RFQs
    promises.push(
      RFQ.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(perModule)
        .populate('createdBy', 'firstName lastName')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'PROCUREMENT',
              action: 'created',
              title: `RFQ: ${d.rfqNumber || d._id}`,
              description: `Status: ${d.status || 'DRAFT'}`,
              status: d.status,
              refId: d._id,
              refModel: 'RFQ',
              timestamp: d.updatedAt,
              user: d.createdBy,
            })
          )
        )
        .catch(() => []) // RFQ may not exist yet
    );
  }

  /* ------ INVENTORY ------ */
  if (!filterModule || filterModule === 'INVENTORY') {
    // Recent stock movements
    promises.push(
      StockMovement.find({ companyId })
        .sort({ createdAt: -1 })
        .limit(perModule)
        .populate('productId', 'name sku')
        .populate('warehouseId', 'name')
        .populate('createdBy', 'firstName lastName')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'INVENTORY',
              action: d.type.toLowerCase().replace('_', ' '),
              title: `Stock ${d.type.replace('_', ' ')}`,
              description: `${d.productId?.name || 'Product'} (${d.productId?.sku || ''}) — Qty: ${d.quantity}`,
              status: d.type,
              refId: d._id,
              refModel: 'StockMovement',
              meta: {
                warehouse: d.warehouseId?.name,
                quantityBefore: d.quantityBefore,
                quantityAfter: d.quantityAfter,
              },
              timestamp: d.createdAt,
              user: d.createdBy,
            })
          )
        )
    );

    // Recent stock transfers
    promises.push(
      StockTransfer.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(perModule)
        .populate('createdBy', 'firstName lastName')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'INVENTORY',
              action: 'transfer',
              title: `Transfer: ${d.transferNumber || d._id}`,
              description: `Status: ${d.status || 'PENDING'}`,
              status: d.status,
              refId: d._id,
              refModel: 'StockTransfer',
              timestamp: d.updatedAt,
              user: d.createdBy,
            })
          )
        )
        .catch(() => [])
    );

    // Recent products added
    promises.push(
      Product.find({ companyId })
        .sort({ createdAt: -1 })
        .limit(perModule)
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'INVENTORY',
              action: 'created',
              title: `Product: ${d.name}`,
              description: `SKU: ${d.sku || 'N/A'} — ₹${(d.sellingPrice || 0).toLocaleString('en-IN')}`,
              status: d.status || 'ACTIVE',
              refId: d._id,
              refModel: 'Product',
              meta: { sku: d.sku, costPrice: d.costPrice, sellingPrice: d.sellingPrice },
              timestamp: d.createdAt,
            })
          )
        )
    );
  }

  /* ------ HRMS ------ */
  if (!filterModule || filterModule === 'HRMS') {
    // Recent employees onboarded
    promises.push(
      Employee.find({ companyId })
        .sort({ createdAt: -1 })
        .limit(perModule)
        .populate('departmentId', 'name')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'HRMS',
              action: d.status === 'TERMINATED' ? 'terminated' : 'onboarded',
              title: `Employee: ${d.firstName} ${d.lastName || ''}`,
              description: `${d.employeeCode} — ${d.departmentId?.name || 'Unassigned'}`,
              status: d.status,
              refId: d._id,
              refModel: 'Employee',
              meta: { employmentType: d.employmentType, department: d.departmentId?.name },
              timestamp: d.createdAt,
            })
          )
        )
    );

    // Recent leave requests
    promises.push(
      LeaveRequest.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(perModule)
        .populate('employeeId', 'firstName lastName employeeCode')
        .populate('leaveTypeId', 'name')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'HRMS',
              action:
                d.status === 'APPROVED'
                  ? 'approved'
                  : d.status === 'REJECTED'
                  ? 'rejected'
                  : 'requested',
              title: `Leave: ${d.leaveTypeId?.name || 'Leave'}`,
              description: `${d.employeeId?.firstName || ''} ${d.employeeId?.lastName || ''} — ${d.days} day(s)`,
              status: d.status,
              refId: d._id,
              refModel: 'LeaveRequest',
              meta: { days: d.days, reason: d.reason },
              timestamp: d.updatedAt,
              user: d.employeeId,
            })
          )
        )
    );
  }

  /* ------ FINANCE ------ */
  if (!filterModule || filterModule === 'FINANCE') {
    // Recent invoices
    promises.push(
      Invoice.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(perModule)
        .populate('accountId', 'name')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'FINANCE',
              action:
                d.status === 'PAID'
                  ? 'paid'
                  : d.status === 'OVERDUE'
                  ? 'overdue'
                  : d.status === 'SENT'
                  ? 'sent'
                  : 'created',
              title: `Invoice: ${d.invoiceNumber}`,
              description: `${d.type} — ₹${(d.totalAmount || 0).toLocaleString('en-IN')}`,
              status: d.status,
              refId: d._id,
              refModel: 'Invoice',
              meta: { totalAmount: d.totalAmount, balanceDue: d.balanceDue, type: d.type },
              timestamp: d.updatedAt,
            })
          )
        )
    );

    // Recent expenses
    promises.push(
      Expense.find({ companyId })
        .sort({ updatedAt: -1 })
        .limit(perModule)
        .populate('employeeId', 'firstName lastName')
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'FINANCE',
              action:
                d.status === 'APPROVED'
                  ? 'approved'
                  : d.status === 'REIMBURSED'
                  ? 'reimbursed'
                  : 'submitted',
              title: `Expense: ${d.title}`,
              description: `${d.category} — ₹${(d.amount || 0).toLocaleString('en-IN')} by ${d.employeeId?.firstName || 'N/A'}`,
              status: d.status,
              refId: d._id,
              refModel: 'Expense',
              meta: { amount: d.amount, category: d.category },
              timestamp: d.updatedAt,
              user: d.employeeId,
            })
          )
        )
    );

    // Recent payments
    promises.push(
      Payment.find({ companyId })
        .sort({ createdAt: -1 })
        .limit(perModule)
        .lean()
        .then((docs) =>
          docs.map((d) =>
            buildItem({
              module: 'FINANCE',
              action: 'recorded',
              title: `Payment: ${d.paymentNumber || d._id}`,
              description: `₹${(d.amount || 0).toLocaleString('en-IN')} — ${d.method || d.paymentMethod || 'N/A'}`,
              status: d.status || 'COMPLETED',
              refId: d._id,
              refModel: 'Payment',
              meta: { amount: d.amount },
              timestamp: d.createdAt,
            })
          )
        )
        .catch(() => [])
    );
  }

  // Run all queries in parallel
  const results = await Promise.all(promises);
  const allActivities = results.flat();

  // Sort by timestamp descending and trim to requested limit
  allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    activities: allActivities.slice(0, parsedLimit),
    total: allActivities.length,
    modules: ['CRM', 'PROCUREMENT', 'INVENTORY', 'HRMS', 'FINANCE'],
  };
};

module.exports = { getActivity };
