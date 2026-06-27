interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    source?: string;
    ownerId?: string;
    tag?: string;
    stage?: string;
    accountId?: string;
    type?: string;
    leadId?: string;
    dealId?: string;
    contactId?: string;
    assignedToId?: string;
    isCompleted?: string;
    industry?: string;
}
declare const getDashboard: (companyId: string, from: string | undefined, to: string | undefined) => Promise<{
    stats: {
        leads: number;
        contacts: number;
        accounts: number;
        deals: number;
        wonDeals: number;
        lostDeals: number;
        openDeals: number;
    };
    pipeline: {
        stage: string;
        count: number;
        totalValue: number;
    }[];
    recentActivities: (import("mongoose").FlattenMaps<import("../models/Activity").IActivity> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    recentLeads: (import("mongoose").FlattenMaps<import("../models/Lead").ILead> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
declare const listLeads: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/Lead").ILead> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createLead: (companyId: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Lead").ILead> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getLeadById: (companyId: string, id: string) => Promise<any>;
declare const updateLead: (companyId: string, id: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Lead").ILead> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeLead: (companyId: string, id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Lead").ILead, {}, {}> & import("../models/Lead").ILead & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const changeLeadStage: (companyId: string, id: string, status: string) => Promise<import("mongoose").FlattenMaps<import("../models/Lead").ILead> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const convertLead: (companyId: string, _userId: string, leadId: string, body: Record<string, unknown>) => Promise<{
    lead: import("mongoose").FlattenMaps<import("../models/Lead").ILead> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    deal: import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>;
declare const addLeadActivity: (companyId: string, userId: string, leadId: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Activity").IActivity> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listContacts: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/Contact").IContact> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createContact: (companyId: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Contact").IContact> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getContactById: (companyId: string, id: string) => Promise<any>;
declare const updateContact: (companyId: string, id: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Contact").IContact> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeContact: (companyId: string, id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Contact").IContact, {}, {}> & import("../models/Contact").IContact & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const mergeContacts: (companyId: string, primaryId: string, duplicateIds: string[]) => Promise<import("mongoose").FlattenMaps<import("../models/Contact").IContact> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listAccounts: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/Account").IAccount> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createAccount: (companyId: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Account").IAccount> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getAccountById: (companyId: string, id: string) => Promise<any>;
declare const updateAccount: (companyId: string, id: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Account").IAccount> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeAccount: (companyId: string, id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Account").IAccount, {}, {}> & import("../models/Account").IAccount & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listDeals: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createDeal: (companyId: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getDealById: (companyId: string, id: string) => Promise<any>;
declare const updateDeal: (companyId: string, id: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeDeal: (companyId: string, id: string) => Promise<import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const changeDealStage: (companyId: string, id: string, stage: string) => Promise<import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const closeWonDeal: (companyId: string, id: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const closeLostDeal: (companyId: string, id: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getPipeline: (companyId: string) => Promise<{
    pipeline: {
        stage: string;
        deals: (import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        totalValue: number;
        count: number;
    }[];
    summary: {
        totalDeals: number;
        totalValue: number;
        wonValue: number;
    };
}>;
declare const reorderPipeline: (companyId: string, dealId: string, stage: string, position: number) => Promise<import("mongoose").FlattenMaps<import("../models/Deal").IDeal> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listActivities: (companyId: string, query: QueryParams) => Promise<{
    data: (import("mongoose").FlattenMaps<import("../models/Activity").IActivity> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const createActivity: (companyId: string, userId: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Activity").IActivity> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateActivity: (companyId: string, id: string, body: Record<string, unknown>) => Promise<import("mongoose").FlattenMaps<import("../models/Activity").IActivity> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeActivity: (companyId: string, id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Activity").IActivity, {}, {}> & import("../models/Activity").IActivity & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export { getDashboard, listLeads, createLead, getLeadById, updateLead, removeLead, changeLeadStage, convertLead, addLeadActivity, listContacts, createContact, getContactById, updateContact, removeContact, mergeContacts, listAccounts, createAccount, getAccountById, updateAccount, removeAccount, listDeals, createDeal, getDealById, updateDeal, removeDeal, changeDealStage, closeWonDeal, closeLostDeal, getPipeline, reorderPipeline, listActivities, createActivity, updateActivity, removeActivity, };
//# sourceMappingURL=crm.service.d.ts.map