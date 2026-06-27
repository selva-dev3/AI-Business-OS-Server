export interface PaginateParams {
    page?: number;
    limit?: number;
    skip?: number;
}
export interface PaginationQuery {
    page?: string;
    limit?: string;
    search?: string;
    sort?: string;
    status?: string;
    departmentId?: string;
    designationId?: string;
    employmentType?: string;
    [key: string]: unknown;
}
export interface BuildMetaResult {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
//# sourceMappingURL=pagination.types.d.ts.map