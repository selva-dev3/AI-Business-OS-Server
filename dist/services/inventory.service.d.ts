interface QueryParams {
    search?: string;
    categoryId?: string;
    type?: string;
    lowStock?: string;
    page?: string;
    limit?: string;
    productId?: string;
    warehouseId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    productSearch?: string;
}
declare const listProducts: (query: QueryParams, companyId: string) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/Product").IProduct> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createProduct: (data: Record<string, unknown>, companyId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Product").IProduct, {}, {}> & import("../models/Product").IProduct & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getProductById: (id: string, companyId: string) => Promise<any>;
declare const updateProduct: (id: string, data: Record<string, unknown>, companyId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Product").IProduct, {}, {}> & import("../models/Product").IProduct & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeProduct: (id: string, companyId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Product").IProduct, {}, {}> & import("../models/Product").IProduct & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getStockHistory: (productId: string, companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/StockMovement").IStockMovement> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const getLowStock: (companyId: string) => Promise<any>;
declare const listCategories: (companyId: string) => Promise<Record<string, unknown>[]>;
declare const createCategory: (data: Record<string, unknown>, companyId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/ProductCategory").IProductCategory, {}, {}> & import("../models/ProductCategory").IProductCategory & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateCategory: (id: string, data: Record<string, unknown>, companyId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/ProductCategory").IProductCategory, {}, {}> & import("../models/ProductCategory").IProductCategory & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeCategory: (id: string, companyId: string) => Promise<void>;
declare const listWarehouses: (companyId: string) => Promise<any>;
declare const createWarehouse: (data: Record<string, unknown>, companyId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Warehouse").IWarehouse, {}, {}> & import("../models/Warehouse").IWarehouse & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateWarehouse: (id: string, data: Record<string, unknown>, companyId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Warehouse").IWarehouse, {}, {}> & import("../models/Warehouse").IWarehouse & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getWarehouseStock: (warehouseId: string, companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/Stock").IStock> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const getStock: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/Stock").IStock> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const adjustStock: (data: Record<string, unknown>, companyId: string, userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Stock").IStock, {}, {}> & import("../models/Stock").IStock & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getMovements: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/StockMovement").IStockMovement> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createTransfer: (data: Record<string, unknown>, companyId: string, userId: string) => Promise<Omit<import("mongoose").Document<unknown, {}, import("../models/StockTransfer").IStockTransfer, {}, {}> & import("../models/StockTransfer").IStockTransfer & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, never>>;
declare const listTransfers: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/StockTransfer").IStockTransfer> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const approveTransfer: (id: string, companyId: string, userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/StockTransfer").IStockTransfer, {}, {}> & import("../models/StockTransfer").IStockTransfer & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const completeTransfer: (id: string, companyId: string, userId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/StockTransfer").IStockTransfer, {}, {}> & import("../models/StockTransfer").IStockTransfer & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export { listProducts, createProduct, getProductById, updateProduct, removeProduct, getStockHistory, getLowStock, listCategories, createCategory, updateCategory, removeCategory, listWarehouses, createWarehouse, updateWarehouse, getWarehouseStock, getStock, adjustStock, getMovements, createTransfer, listTransfers, approveTransfer, completeTransfer, };
//# sourceMappingURL=inventory.service.d.ts.map