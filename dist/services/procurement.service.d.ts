interface QueryParams {
    search?: string;
    isActive?: boolean;
    tags?: string | string[];
    status?: string;
    vendorId?: string;
    page?: string;
    limit?: string;
}
declare const listVendors: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/Vendor").IVendor, {}, {}> & import("../models/Vendor").IVendor & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createVendor: (companyId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Vendor").IVendor, {}, {}> & import("../models/Vendor").IVendor & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getVendorById: (companyId: string, vendorId: string) => Promise<any>;
declare const updateVendor: (companyId: string, vendorId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Vendor").IVendor, {}, {}> & import("../models/Vendor").IVendor & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeVendor: (companyId: string, vendorId: string) => Promise<{
    success: boolean;
}>;
declare const getVendorPurchaseHistory: (companyId: string, vendorId: string) => Promise<{
    vendor: import("mongoose").Document<unknown, {}, import("../models/Vendor").IVendor, {}, {}> & import("../models/Vendor").IVendor & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    orders: (import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
declare const listRFQs: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/RFQ").IRFQ, {}, {}> & import("../models/RFQ").IRFQ & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createRFQ: (companyId: string, userId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/RFQ").IRFQ, {}, {}> & import("../models/RFQ").IRFQ & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getRFQById: (companyId: string, rfqId: string) => Promise<any>;
declare const updateRFQ: (companyId: string, rfqId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/RFQ").IRFQ, {}, {}> & import("../models/RFQ").IRFQ & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeRFQ: (companyId: string, rfqId: string) => Promise<import("mongodb").DeleteResult>;
declare const sendRFQ: (companyId: string, rfqId: string, { vendorIds, message: _message }: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/RFQ").IRFQ, {}, {}> & import("../models/RFQ").IRFQ & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getRFQQuotes: (companyId: string, rfqId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Quote").IQuote, {}, {}> & import("../models/Quote").IQuote & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const createPOFromQuote: (companyId: string, userId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listPOs: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createPO: (companyId: string, userId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getPOById: (companyId: string, poId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updatePO: (companyId: string, poId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const submitPO: (companyId: string, poId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const approvePO: (companyId: string, poId: string, userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const rejectPO: (companyId: string, poId: string, _reason: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const cancelPO: (companyId: string, poId: string, reason: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const createReceipt: (companyId: string, userId: string, poId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/GoodsReceipt").IGoodsReceipt, {}, {}> & import("../models/GoodsReceipt").IGoodsReceipt & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getReceipts: (companyId: string, poId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/GoodsReceipt").IGoodsReceipt, {}, {}> & import("../models/GoodsReceipt").IGoodsReceipt & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const exportPOs: (companyId: string, query: QueryParams) => Promise<(import("mongoose").Document<unknown, {}, import("../models/PurchaseOrder").IPurchaseOrder, {}, {}> & import("../models/PurchaseOrder").IPurchaseOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
export { listVendors, createVendor, getVendorById, updateVendor, removeVendor, getVendorPurchaseHistory, listRFQs, createRFQ, getRFQById, updateRFQ, removeRFQ, sendRFQ, getRFQQuotes, createPOFromQuote, listPOs, createPO, getPOById, updatePO, submitPO, approvePO, rejectPO, cancelPO, createReceipt, getReceipts, exportPOs, };
//# sourceMappingURL=procurement.service.d.ts.map