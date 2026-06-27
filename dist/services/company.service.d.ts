declare const get: (companyId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Company").ICompany, {}, {}> & import("../models/Company").ICompany & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const update: (companyId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Company").ICompany, {}, {}> & import("../models/Company").ICompany & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const uploadLogo: (companyId: string, file: {
    path: string;
}) => Promise<{
    logo: string;
}>;
declare const getSettings: (companyId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/CompanySettings").ICompanySettings, {}, {}> & import("../models/CompanySettings").ICompanySettings & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateSettings: (companyId: string, data: Record<string, unknown>) => Promise<{
    success: boolean;
}>;
declare const listBranches: (companyId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Branch").IBranch, {}, {}> & import("../models/Branch").IBranch & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const createBranch: (companyId: string, data: {
    code: string;
} & Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Branch").IBranch, {}, {}> & import("../models/Branch").IBranch & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateBranch: (companyId: string, branchId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Branch").IBranch, {}, {}> & import("../models/Branch").IBranch & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const deleteBranch: (companyId: string, branchId: string) => Promise<{
    success: boolean;
}>;
export { get, update, uploadLogo, getSettings, updateSettings, listBranches, createBranch, updateBranch, deleteBranch, };
//# sourceMappingURL=company.service.d.ts.map