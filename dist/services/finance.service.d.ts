declare const listInvoices: (companyId: string, { type, status, accountId, startDate, endDate, search, page, limit }: Record<string, unknown>) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/Invoice").IInvoice, {}, {}> & import("../models/Invoice").IInvoice & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
declare const createInvoice: (companyId: string, data: Record<string, unknown>) => Promise<any>;
declare const getInvoiceById: (companyId: string, id: string) => Promise<any>;
declare const updateInvoice: (companyId: string, id: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Invoice").IInvoice, {}, {}> & import("../models/Invoice").IInvoice & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeInvoice: (companyId: string, id: string) => Promise<{
    success: boolean;
}>;
declare const sendInvoice: (companyId: string, id: string, { to, cc: _cc, subject, message }: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Invoice").IInvoice, {}, {}> & import("../models/Invoice").IInvoice & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const recordPayment: (companyId: string, userId: string, invoiceId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Payment").IPayment, {}, {}> & import("../models/Payment").IPayment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getInvoicePayments: (companyId: string, invoiceId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Payment").IPayment, {}, {}> & import("../models/Payment").IPayment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const getInvoicePDF: (companyId: string, id: string) => Promise<Buffer>;
declare const exportInvoices: (companyId: string, { type, status, startDate, endDate }: Record<string, unknown>) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Invoice").IInvoice, {}, {}> & import("../models/Invoice").IInvoice & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const listExpenses: (companyId: string, { status, category, employeeId, startDate, endDate, search, page, limit }: Record<string, unknown>) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/Expense").IExpense, {}, {}> & import("../models/Expense").IExpense & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
declare const createExpense: (companyId: string, employeeId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Expense").IExpense, {}, {}> & import("../models/Expense").IExpense & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getExpenseById: (companyId: string, id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Expense").IExpense, {}, {}> & import("../models/Expense").IExpense & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateExpense: (companyId: string, id: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Expense").IExpense, {}, {}> & import("../models/Expense").IExpense & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeExpense: (companyId: string, id: string) => Promise<{
    success: boolean;
}>;
declare const approveExpense: (companyId: string, id: string, userId: string, { notes }: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Expense").IExpense, {}, {}> & import("../models/Expense").IExpense & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const rejectExpense: (companyId: string, id: string, userId: string, { notes }: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Expense").IExpense, {}, {}> & import("../models/Expense").IExpense & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const uploadExpenseReceipt: (companyId: string, id: string, file: {
    path: string;
}) => Promise<import("mongoose").Document<unknown, {}, import("../models/Expense").IExpense, {}, {}> & import("../models/Expense").IExpense & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listPayments: (companyId: string, { method, startDate, endDate, page, limit }: Record<string, unknown>) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/Payment").IPayment, {}, {}> & import("../models/Payment").IPayment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
declare const getPaymentById: (companyId: string, id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Payment").IPayment, {}, {}> & import("../models/Payment").IPayment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const profitLoss: (companyId: string, { startDate, endDate }: Record<string, unknown>) => Promise<{
    salesRevenue: number;
    purchaseCost: number;
    totalExpenses: number;
    grossProfit: number;
    netProfit: number;
}>;
declare const balanceSheet: (companyId: string, { asOf }: Record<string, unknown>) => Promise<{
    totalReceivables: number;
    totalPayables: number;
    totalRevenue: number;
    asOf: Date;
}>;
declare const cashFlow: (companyId: string, { startDate, endDate }: Record<string, unknown>) => Promise<{
    inflow: number;
    outflow: number;
    netCashFlow: number;
}>;
declare const taxReport: (companyId: string, { startDate, endDate }: Record<string, unknown>) => Promise<{
    totalTaxableSales: number;
    totalTaxCollected: number;
    totalTaxablePurchases: number;
    totalTaxPaid: number;
    netTaxLiability: number;
}>;
declare const arAging: (companyId: string) => Promise<Record<string, {
    invoice: string;
    account: unknown;
    amount: number;
    dueDate: Date;
    daysOverdue: number;
}[]>>;
declare const apAging: (companyId: string) => Promise<Record<string, {
    invoice: string;
    account: unknown;
    amount: number;
    dueDate: Date;
    daysOverdue: number;
}[]>>;
declare const scheduleReport: (companyId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/ReportSchedule").IReportSchedule, {}, {}> & import("../models/ReportSchedule").IReportSchedule & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listBudgets: (companyId: string, { year, month, department, category, page, limit }: Record<string, unknown>) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/Budget").IBudget, {}, {}> & import("../models/Budget").IBudget & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
declare const createBudget: (companyId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Budget").IBudget, {}, {}> & import("../models/Budget").IBudget & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateBudget: (companyId: string, id: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Budget").IBudget, {}, {}> & import("../models/Budget").IBudget & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeBudget: (companyId: string, id: string) => Promise<{
    success: boolean;
}>;
declare const budgetVsActual: (companyId: string, { year, month, department }: Record<string, unknown>) => Promise<{
    budget: import("mongoose").FlattenMaps<import("../models/Budget").IBudget> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    actual: number;
    variance: number;
    variancePercentage: string;
}[]>;
export { listInvoices, createInvoice, getInvoiceById, updateInvoice, removeInvoice, sendInvoice, recordPayment, getInvoicePayments, getInvoicePDF, exportInvoices, listExpenses, createExpense, getExpenseById, updateExpense, removeExpense, approveExpense, rejectExpense, uploadExpenseReceipt, listPayments, getPaymentById, profitLoss, balanceSheet, cashFlow, taxReport, arAging, apAging, scheduleReport, listBudgets, createBudget, updateBudget, removeBudget, budgetVsActual, };
//# sourceMappingURL=finance.service.d.ts.map