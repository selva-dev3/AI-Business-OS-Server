import mongoose from 'mongoose';
declare const getOverview: (from: string | undefined, to: string | undefined, companyId: string) => Promise<{
    revenue: {
        total: number;
        invoiced: number;
        paid: number;
    };
    expenses: {
        total: number;
    };
    hr: {
        activeEmployees: number;
    };
    crm: {
        totalLeads: number;
        totalDeals: number;
        wonDeals: number;
        conversionRate: number;
    };
    support: {
        openTickets: number;
    };
    inventory: {
        totalProducts: number;
        lowStockItems: number;
    };
}>;
declare const getRevenue: (period: string, from: string | undefined, to: string | undefined, companyId: string) => Promise<{
    revenueData: any[];
    expensesData: any[];
    invoicesByStatus: any[];
}>;
declare const getHRMS: (from: string | undefined, to: string | undefined, companyId: string) => Promise<{
    totalEmployees: number;
    attendanceStats: any[];
    leaveStats: any[];
    departmentDistribution: any[];
}>;
declare const getCRM: (from: string | undefined, to: string | undefined, companyId: string) => Promise<{
    leadsByStatus: any[];
    dealsByStage: any[];
    dealsByStatus: any[];
    conversionRate: number;
}>;
declare const getInventory: (warehouseId: string | undefined, companyId: string) => Promise<{
    stockByWarehouse: any[];
    lowStock: number;
    categoryDistribution: any[];
}>;
declare const getSupport: (from: string | undefined, to: string | undefined, companyId: string) => Promise<{
    ticketsByStatus: any[];
    ticketsByPriority: any[];
    avgResolutionTime: number;
}>;
declare const getFinance: (from: string | undefined, to: string | undefined, companyId: string) => Promise<{
    revenueByStatus: any[];
    expensesByCategory: any[];
    monthlyTrend: any[];
}>;
declare const getAIInsights: (module: string, data: Record<string, unknown>) => Promise<{
    type: string;
    title: string;
    description: string;
    confidence: number;
}[]>;
declare const scheduleReport: (data: Record<string, unknown>, companyId: string) => Promise<mongoose.Document<unknown, {}, import("../models/ReportSchedule").IReportSchedule, {}, {}> & import("../models/ReportSchedule").IReportSchedule & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
export { getOverview, getRevenue, getHRMS, getCRM, getInventory, getSupport, getFinance, getAIInsights, scheduleReport, };
//# sourceMappingURL=analytics.service.d.ts.map