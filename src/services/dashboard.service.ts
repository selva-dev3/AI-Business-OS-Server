import Lead from '../models/Lead';
import Deal from '../models/Deal';
import Activity from '../models/Activity';
import PurchaseOrder from '../models/PurchaseOrder';
import RFQ from '../models/RFQ';
import Product from '../models/Product';
import StockMovement from '../models/StockMovement';
import StockTransfer from '../models/StockTransfer';
import Employee from '../models/Employee';
import LeaveRequest from '../models/LeaveRequest';
import Invoice from '../models/Invoice';
import Expense from '../models/Expense';
import Payment from '../models/Payment';

interface ActivityItem {
  module: string;
  action: string;
  title: string;
  description: string;
  status: string | null;
  refId: string | null;
  refModel: string | null;
  meta: Record<string, unknown>;
  timestamp: Date;
  user: {
    id: string;
    name?: string;
  } | null;
}

interface BuildItemParams {
  module: string;
  action: string;
  title: string;
  description: string;
  status?: string;
  refId?: string;
  refModel?: string;
  meta?: Record<string, unknown>;
  timestamp: Date;
  user?: Record<string, unknown> | null;
}

function buildItem({ module, action, title, description, status, refId, refModel, meta, timestamp, user }: BuildItemParams): ActivityItem {
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
              ? `${(user.firstName as string) || ''} ${(user.lastName as string) || ''}`.trim() || undefined
              : undefined,
        }
      : null,
  };
}

const getActivity = async (companyId: string, { limit = 30, module: filterModule }: { limit?: number; module?: string } = {}) => {
  const parsedLimit = Math.min(Math.max(parseInt(String(limit), 10) || 30, 1), 100);
  const perModule = Math.ceil(parsedLimit / 5) + 2;

  const promises: Promise<ActivityItem[]>[] = [];

  if (!filterModule || filterModule === 'CRM') {
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
              refId: d._id.toString(),
              refModel: 'Lead',
              meta: { source: d.source, score: d.score },
              timestamp: d.updatedAt as Date,
              user: d.ownerId as unknown as Record<string, unknown> | undefined,
            })
          )
        )
    );

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
              description: `Stage ${d.stage} — ₹${((d.value || 0) as number).toLocaleString('en-IN')}`,
              status: d.stage,
              refId: d._id.toString(),
              refModel: 'Deal',
              meta: { value: d.value, probability: d.probability },
              timestamp: d.updatedAt as Date,
              user: d.ownerId as unknown as Record<string, unknown> | undefined,
            })
          )
        )
    );

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
              action: (d as Record<string, unknown>).isCompleted ? 'completed' : 'created',
              title: `${(d as Record<string, unknown>).type}: ${(d as Record<string, unknown>).subject}`,
              description: (d as Record<string, unknown>).description as string || (d as Record<string, unknown>).outcome as string || '',
              status: (d as Record<string, unknown>).isCompleted ? 'COMPLETED' : 'PENDING',
              refId: d._id.toString(),
              refModel: 'Activity',
              timestamp: d.updatedAt as Date,
              user: (d as Record<string, unknown>).createdBy as Record<string, unknown> | undefined,
            })
          )
        )
    );
  }

  if (!filterModule || filterModule === 'PROCUREMENT') {
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
              description: `Vendor: ${(d.vendorId as unknown as Record<string, unknown> | undefined)?.name || 'N/A'} — ₹${((d.totalAmount || 0) as number).toLocaleString('en-IN')}`,
              status: d.status,
              refId: d._id.toString(),
              refModel: 'PurchaseOrder',
              meta: { totalAmount: d.totalAmount, vendor: (d.vendorId as unknown as Record<string, unknown> | undefined)?.name },
              timestamp: d.updatedAt as Date,
              user: d.createdBy as unknown as Record<string, unknown> | undefined,
            })
          )
        )
    );

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
              title: `RFQ: ${(d as Record<string, unknown>).rfqNumber || d._id}`,
              description: `Status: ${d.status || 'DRAFT'}`,
              status: d.status,
              refId: d._id.toString(),
              refModel: 'RFQ',
              timestamp: d.updatedAt as Date,
              user: d.createdBy as unknown as Record<string, unknown> | undefined,
            })
          )
        )
        .catch(() => [])
    );
  }

  if (!filterModule || filterModule === 'INVENTORY') {
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
              action: (d.type as string).toLowerCase().replace('_', ' '),
              title: `Stock ${(d.type as string).replace('_', ' ')}`,
              description: `${(d.productId as unknown as Record<string, unknown> | undefined)?.name || 'Product'} (${(d.productId as unknown as Record<string, unknown> | undefined)?.sku || ''}) — Qty: ${d.quantity}`,
              status: d.type,
              refId: d._id.toString(),
              refModel: 'StockMovement',
              meta: {
                warehouse: (d.warehouseId as unknown as Record<string, unknown> | undefined)?.name,
                quantityBefore: d.quantityBefore,
                quantityAfter: d.quantityAfter,
              },
              timestamp: d.createdAt as Date,
              user: d.createdBy as unknown as Record<string, unknown> | undefined,
            })
          )
        )
    );

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
              title: `Transfer: ${(d as Record<string, unknown>).transferNumber || d._id}`,
              description: `Status: ${d.status || 'PENDING'}`,
              status: d.status,
              refId: d._id.toString(),
              refModel: 'StockTransfer',
              timestamp: d.updatedAt as Date,
              user: (d as any).createdBy as unknown as Record<string, unknown> | undefined,
            })
          )
        )
        .catch(() => [])
    );

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
              description: `SKU: ${d.sku || 'N/A'} — ₹${((d.sellingPrice || 0) as number).toLocaleString('en-IN')}`,
              status: (d as any).status || 'ACTIVE',
              refId: d._id.toString(),
              refModel: 'Product',
              meta: { sku: d.sku, costPrice: d.costPrice, sellingPrice: d.sellingPrice },
              timestamp: d.createdAt as Date,
            })
          )
        )
    );
  }

  if (!filterModule || filterModule === 'HRMS') {
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
              description: `${d.employeeCode} — ${(d.departmentId as Record<string, unknown> | undefined)?.name || 'Unassigned'}`,
              status: d.status,
              refId: d._id.toString(),
              refModel: 'Employee',
              meta: { employmentType: d.employmentType, department: (d.departmentId as Record<string, unknown> | undefined)?.name },
              timestamp: d.createdAt as Date,
            })
          )
        )
    );

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
              title: `Leave: ${(d.leaveTypeId as unknown as Record<string, unknown> | undefined)?.name || 'Leave'}`,
              description: `${(d.employeeId as unknown as Record<string, unknown> | undefined)?.firstName || ''} ${(d.employeeId as unknown as Record<string, unknown> | undefined)?.lastName || ''} — ${d.days} day(s)`,
              status: d.status,
              refId: d._id.toString(),
              refModel: 'LeaveRequest',
              meta: { days: d.days, reason: d.reason },
              timestamp: d.updatedAt as Date,
              user: d.employeeId as unknown as Record<string, unknown> | undefined,
            })
          )
        )
    );
  }

  if (!filterModule || filterModule === 'FINANCE') {
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
              description: `${d.type} — ₹${((d.totalAmount || 0) as number).toLocaleString('en-IN')}`,
              status: d.status,
              refId: d._id.toString(),
              refModel: 'Invoice',
              meta: { totalAmount: d.totalAmount, balanceDue: d.balanceDue, type: d.type },
              timestamp: d.updatedAt as Date,
            })
          )
        )
    );

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
              description: `${d.category} — ₹${((d.amount || 0) as number).toLocaleString('en-IN')} by ${(d.employeeId as unknown as Record<string, unknown> | undefined)?.firstName || 'N/A'}`,
              status: d.status,
              refId: d._id.toString(),
              refModel: 'Expense',
              meta: { amount: d.amount, category: d.category },
              timestamp: d.updatedAt as Date,
              user: d.employeeId as unknown as Record<string, unknown> | undefined,
            })
          )
        )
    );

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
              title: `Payment: ${(d as Record<string, unknown>).paymentNumber || d._id}`,
              description: `₹${((d.amount || 0) as number).toLocaleString('en-IN')} — ${(d as Record<string, unknown>).method || (d as Record<string, unknown>).paymentMethod || 'N/A'}`,
              status: (d as any).status || 'COMPLETED',
              refId: d._id.toString(),
              refModel: 'Payment',
              meta: { amount: d.amount },
              timestamp: d.createdAt as Date,
            })
          )
        )
        .catch(() => [])
    );
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

export { getActivity };
