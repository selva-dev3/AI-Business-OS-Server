const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const Ticket = require('../models/Ticket');
const ReportSchedule = require('../models/ReportSchedule');

const getOverview = async (from, to, companyId) => {
  const dateFilter = {};
  if (from || to) {
    dateFilter.createdAt = {};
    if (from) dateFilter.createdAt.$gte = new Date(from);
    if (to) dateFilter.createdAt.$lte = new Date(to);
  }

  const [
    totalInvoices,
    paidInvoices,
    totalRevenue,
    totalExpenses,
    employeeCount,
    totalLeads,
    totalDeals,
    wonDeals,
    openTickets,
    totalProducts,
    lowStockItems,
  ] = await Promise.all([
    Invoice.countDocuments({ companyId, ...dateFilter }),
    Invoice.countDocuments({ companyId, status: 'PAID', ...dateFilter }),
    Invoice.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), status: 'PAID' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Expense.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Employee.countDocuments({ companyId, status: 'ACTIVE' }),
    Lead.countDocuments({ companyId }),
    Deal.countDocuments({ companyId }),
    Deal.countDocuments({ companyId, status: 'WON' }),
    Ticket.countDocuments({ companyId, status: { $in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS'] } }),
    Product.countDocuments({ companyId, isActive: true }),
    Stock.aggregate([
      {
        $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' },
      },
      { $unwind: '$product' },
      {
        $match: {
          $expr: {
            $and: [
              { $lte: ['$quantity', '$product.reorderPoint'] },
              { $gt: ['$product.reorderPoint', 0] },
            ],
          },
        },
      },
      { $count: 'count' },
    ]),
  ]);

  return {
    revenue: {
      total: totalRevenue[0]?.total || 0,
      invoiced: totalInvoices,
      paid: paidInvoices,
    },
    expenses: {
      total: totalExpenses[0]?.total || 0,
    },
    hr: {
      activeEmployees: employeeCount,
    },
    crm: {
      totalLeads,
      totalDeals,
      wonDeals,
      conversionRate: totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100 * 100) / 100 : 0,
    },
    support: {
      openTickets,
    },
    inventory: {
      totalProducts,
      lowStockItems: lowStockItems[0]?.count || 0,
    },
  };
};

const getRevenue = async (period, from, to, companyId) => {
  const match = { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId) };
  if (from || to) {
    match.issueDate = {};
    if (from) match.issueDate.$gte = new Date(from);
    if (to) match.issueDate.$lte = new Date(to);
  }

  let groupId;
  let sortKey;
  if (period === 'monthly') {
    groupId = { year: { $year: '$issueDate' }, month: { $month: '$issueDate' } };
    sortKey = { '_id.year': 1, '_id.month': 1 };
  } else if (period === 'weekly') {
    groupId = { year: { $isoWeekYear: '$issueDate' }, week: { $isoWeek: '$issueDate' } };
    sortKey = { '_id.year': 1, '_id.week': 1 };
  } else {
    groupId = { year: { $year: '$issueDate' } };
    sortKey = { '_id.year': 1 };
  }

  const pipeline = [
    { $match: match },
    { $group: { _id: groupId, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    { $sort: sortKey },
  ];

  const revenueData = await Invoice.aggregate(pipeline);
  const expensesData = await Expense.aggregate([
    { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId) } },
    { $group: { _id: groupId, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: sortKey },
  ]);

  const invoicesByStatus = await Invoice.aggregate([
    { $match: match },
    { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
  ]);

  return { revenueData, expensesData, invoicesByStatus };
};

const getHRMS = async (from, to, companyId) => {
  const dateFilter = {};
  if (from || to) {
    dateFilter.date = {};
    if (from) dateFilter.date.$gte = new Date(from);
    if (to) dateFilter.date.$lte = new Date(to);
  }

  const [totalEmployees, attendanceStats, leaveStats, departmentDistribution] = await Promise.all([
    Employee.countDocuments({ companyId, status: 'ACTIVE' }),
    Attendance.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), ...dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    LeaveRequest.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId) } },
      { $group: { _id: '$status', count: { $sum: 1 }, totalDays: { $sum: '$days' } } },
    ]),
    Employee.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), status: 'ACTIVE' } },
      {
        $lookup: { from: 'departments', localField: 'departmentId', foreignField: '_id', as: 'department' },
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$department.name', count: { $sum: 1 } } },
    ]),
  ]);

  return { totalEmployees, attendanceStats, leaveStats, departmentDistribution };
};

const getCRM = async (from, to, companyId) => {
  const dateFilter = {};
  if (from || to) {
    dateFilter.createdAt = {};
    if (from) dateFilter.createdAt.$gte = new Date(from);
    if (to) dateFilter.createdAt.$lte = new Date(to);
  }

  const [leadsByStatus, dealsByStage, dealsByStatus, conversionRate] = await Promise.all([
    Lead.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), ...dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Deal.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), ...dateFilter } },
      { $group: { _id: '$stage', count: { $sum: 1 }, totalValue: { $sum: '$value' } } },
    ]),
    Deal.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), ...dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$finalValue' } } },
    ]),
    (async () => {
      const totalLeads = await Lead.countDocuments({ companyId });
      const wonDeals = await Deal.countDocuments({ companyId, status: 'WON' });
      return totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100 * 100) / 100 : 0;
    })(),
  ]);

  return { leadsByStatus, dealsByStage, dealsByStatus, conversionRate };
};

const getInventory = async (warehouseId, companyId) => {
  const match = { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId) };
  if (warehouseId) match.warehouseId = require('mongoose').Types.ObjectId.createFromHexString(warehouseId);

  const [stockByWarehouse, lowStock, categoryDistribution] = await Promise.all([
    Stock.aggregate([
      { $match: match },
      {
        $lookup: { from: 'warehouses', localField: 'warehouseId', foreignField: '_id', as: 'warehouse' },
      },
      { $unwind: { path: '$warehouse', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$warehouse.name',
          totalQty: { $sum: '$quantity' },
          reservedQty: { $sum: '$reservedQty' },
          productCount: { $sum: 1 },
        },
      },
    ]),
    Stock.aggregate([
      { $match: match },
      {
        $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' },
      },
      { $unwind: '$product' },
      {
        $match: {
          $expr: {
            $and: [
              { $lte: ['$quantity', '$product.reorderPoint'] },
              { $gt: ['$product.reorderPoint', 0] },
            ],
          },
        },
      },
      { $count: 'count' },
    ]),
    Product.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), isActive: true } },
      {
        $lookup: { from: 'productcategories', localField: 'categoryId', foreignField: '_id', as: 'category' },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$category.name', count: { $sum: 1 } } },
    ]),
  ]);

  return { stockByWarehouse, lowStock: lowStock[0]?.count || 0, categoryDistribution };
};

const getSupport = async (from, to, companyId) => {
  const dateFilter = {};
  if (from || to) {
    dateFilter.createdAt = {};
    if (from) dateFilter.createdAt.$gte = new Date(from);
    if (to) dateFilter.createdAt.$lte = new Date(to);
  }

  const [ticketsByStatus, ticketsByPriority, avgResolutionTime] = await Promise.all([
    Ticket.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), ...dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Ticket.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), ...dateFilter } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Ticket.aggregate([
      {
        $match: {
          companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId),
          status: 'RESOLVED',
          resolvedAt: { $exists: true },
          createdAt: { $exists: true },
        },
      },
      {
        $project: {
          resolutionTime: {
            $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 3600000],
          },
        },
      },
      { $group: { _id: null, avgHours: { $avg: '$resolutionTime' } } },
    ]),
  ]);

  return {
    ticketsByStatus,
    ticketsByPriority,
    avgResolutionTime: Math.round((avgResolutionTime[0]?.avgHours || 0) * 100) / 100,
  };
};

const getFinance = async (from, to, companyId) => {
  const dateFilter = {};
  if (from || to) {
    dateFilter.date = {};
    if (from) dateFilter.date.$gte = new Date(from);
    if (to) dateFilter.date.$lte = new Date(to);
  }

  const [revenueByStatus, expensesByCategory, monthlyTrend] = await Promise.all([
    Invoice.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId) } },
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
    ]),
    Expense.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId), ...dateFilter } },
      { $group: { _id: '$category', count: { $sum: 1 }, total: { $sum: '$amount' } } },
    ]),
    Invoice.aggregate([
      { $match: { companyId: require('mongoose').Types.ObjectId.createFromHexString(companyId) } },
      {
        $group: {
          _id: { year: { $year: '$issueDate' }, month: { $month: '$issueDate' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  return { revenueByStatus, expensesByCategory, monthlyTrend };
};

const getAIInsights = async (module, data) => {
  const insights = [];

  if (module === 'revenue') {
    const values = data.values || [];
    if (values.length > 1) {
      const trend = values[values.length - 1] - values[0];
      insights.push({
        type: trend >= 0 ? 'positive' : 'negative',
        title: trend >= 0 ? 'Revenue Growth' : 'Revenue Decline',
        description: `Revenue has ${trend >= 0 ? 'increased' : 'decreased'} by ${Math.abs(trend).toFixed(2)} over the period.`,
        confidence: 85,
      });
    }
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    insights.push({
      type: 'info',
      title: 'Average Revenue',
      description: `Average revenue per period is ${avg.toFixed(2)}.`,
      confidence: 90,
    });
  } else if (module === 'hr') {
    const attendanceRate = data.attendanceRate || 0;
    if (attendanceRate < 80) {
      insights.push({
        type: 'warning',
        title: 'Low Attendance Rate',
        description: `Attendance rate is ${attendanceRate}%, which is below the recommended 80% threshold.`,
        confidence: 80,
      });
    }
    if (data.turnoverRate && data.turnoverRate > 15) {
      insights.push({
        type: 'negative',
        title: 'High Employee Turnover',
        description: `Employee turnover rate is ${data.turnoverRate}%, consider reviewing retention strategies.`,
        confidence: 75,
      });
    }
  } else if (module === 'crm') {
    const conversionRate = data.conversionRate || 0;
    if (conversionRate < 10) {
      insights.push({
        type: 'negative',
        title: 'Low Conversion Rate',
        description: `Lead-to-deal conversion rate is ${conversionRate}%, which is below industry average.`,
        confidence: 70,
      });
    }
    if (data.pipelineValue > 0) {
      insights.push({
        type: 'positive',
        title: 'Pipeline Health',
        description: `Total pipeline value is ${data.pipelineValue}. Focus on closing deals in advanced stages.`,
        confidence: 85,
      });
    }
  } else if (module === 'inventory') {
    if (data.lowStockCount > 0) {
      insights.push({
        type: 'warning',
        title: 'Low Stock Alert',
        description: `${data.lowStockCount} products are below reorder point. Consider restocking soon.`,
        confidence: 95,
      });
    }
    if (data.turnoverRatio && data.turnoverRatio < 2) {
      insights.push({
        type: 'info',
        title: 'Inventory Turnover',
        description: `Inventory turnover ratio is ${data.turnoverRatio}, indicating slow-moving stock.`,
        confidence: 70,
      });
    }
  } else if (module === 'support') {
    const avgResolution = data.avgResolutionHours || 0;
    if (avgResolution > 48) {
      insights.push({
        type: 'negative',
        title: 'Slow Resolution Time',
        description: `Average ticket resolution time is ${avgResolution} hours, exceeding the 48-hour target.`,
        confidence: 80,
      });
    }
    if (data.openTickets > data.resolvedTickets) {
      insights.push({
        type: 'warning',
        title: 'Ticket Backlog',
        description: 'Open tickets outnumber resolved tickets. Consider allocating more resources.',
        confidence: 75,
      });
    }
  } else if (module === 'finance') {
    const profitMargin = data.profitMargin || 0;
    if (profitMargin < 10) {
      insights.push({
        type: 'negative',
        title: 'Low Profit Margin',
        description: `Profit margin is ${profitMargin}%, which is below the healthy 10-20% range.`,
        confidence: 80,
      });
    }
    if (data.expenseGrowth > data.revenueGrowth) {
      insights.push({
        type: 'warning',
        title: 'Expense Growth Exceeding Revenue',
        description: 'Expenses are growing faster than revenue. Review cost optimization opportunities.',
        confidence: 75,
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'No Significant Patterns',
      description: 'No significant patterns detected in the provided data.',
      confidence: 50,
    });
  }

  return insights;
};

const scheduleReport = async (data, companyId) => {
  const schedule = await ReportSchedule.create({
    ...data,
    companyId,
    nextRunAt: calculateNextRun(data.frequency, data.dayOfWeek, data.time),
    isActive: true,
  });
  return schedule;
};

const calculateNextRun = (frequency, dayOfWeek, time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  let next = new Date(now);
  next.setHours(hours, minutes, 0, 0);

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  if (frequency === 'WEEKLY' && dayOfWeek !== undefined) {
    const currentDay = next.getDay();
    const diff = (dayOfWeek - currentDay + 7) % 7;
    if (diff === 0 && next <= now) {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + diff);
    }
  } else if (frequency === 'MONTHLY') {
    next.setMonth(next.getMonth() + 1);
  }

  return next;
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
