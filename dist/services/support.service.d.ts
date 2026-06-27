import mongoose from 'mongoose';
interface QueryParams {
    status?: string;
    priority?: string;
    categoryId?: string;
    assigneeId?: string;
    reporterId?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
    page?: string;
    limit?: string;
}
declare const list: (companyId: string, query?: QueryParams) => Promise<{
    data: (mongoose.Document<unknown, {}, import("../models/Ticket").ITicket, {}, {}> & import("../models/Ticket").ITicket & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const create: (companyId: string, userId: string, data: Record<string, unknown>) => Promise<(mongoose.Document<unknown, {}, import("../models/Ticket").ITicket, {}, {}> & import("../models/Ticket").ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}) | null>;
declare const getById: (companyId: string, ticketId: string) => Promise<any>;
declare const update: (companyId: string, ticketId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/Ticket").ITicket, {}, {}> & import("../models/Ticket").ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const remove: (companyId: string, ticketId: string) => Promise<{
    success: boolean;
}>;
declare const reply: (companyId: string, userId: string, ticketId: string, data: Record<string, unknown>) => Promise<Omit<mongoose.Document<unknown, {}, import("../models/TicketReply").ITicketReply, {}, {}> & import("../models/TicketReply").ITicketReply & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, never>>;
declare const assign: (companyId: string, userId: string, ticketId: string, assigneeId: string) => Promise<mongoose.Document<unknown, {}, import("../models/Ticket").ITicket, {}, {}> & import("../models/Ticket").ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const changeStatus: (companyId: string, userId: string, ticketId: string, status: string, resolution: string | undefined) => Promise<mongoose.Document<unknown, {}, import("../models/Ticket").ITicket, {}, {}> & import("../models/Ticket").ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const changePriority: (companyId: string, userId: string, ticketId: string, priority: string) => Promise<mongoose.Document<unknown, {}, import("../models/Ticket").ITicket, {}, {}> & import("../models/Ticket").ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const close: (companyId: string, userId: string, ticketId: string, resolution: string | undefined) => Promise<mongoose.Document<unknown, {}, import("../models/Ticket").ITicket, {}, {}> & import("../models/Ticket").ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getAISummary: (companyId: string, ticketId: string) => Promise<{
    overview: {
        ticketNumber: string;
        title: string;
        status: string | undefined;
        priority: string | undefined;
        category: {};
        reporter: {};
        assignee: {};
        created: Date;
        slaDeadline: Date | undefined;
        slaBreached: boolean | undefined;
    };
    conversation: {
        totalReplies: number;
        publicReplies: number;
        internalNotes: number;
        lastActivity: Date;
    };
    metrics: {
        responseTime: number | null;
        resolutionTime: number | null;
    };
}>;
declare const listCategories: (companyId: string) => Promise<(mongoose.Document<unknown, {}, import("../models/TicketCategory").ITicketCategory, {}, {}> & import("../models/TicketCategory").ITicketCategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const createCategory: (companyId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/TicketCategory").ITicketCategory, {}, {}> & import("../models/TicketCategory").ITicketCategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateCategory: (companyId: string, categoryId: string, data: Record<string, unknown>) => Promise<mongoose.Document<unknown, {}, import("../models/TicketCategory").ITicketCategory, {}, {}> & import("../models/TicketCategory").ITicketCategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeCategory: (companyId: string, categoryId: string) => Promise<{
    success: boolean;
}>;
declare const getSummary: (companyId: string) => Promise<{
    totals: {
        total: number;
        open: number;
        resolved: number;
        closed: number;
    };
    byPriority: {
        [x: string]: number;
    };
    byCategory: {
        [x: string]: number;
    };
    sla: {
        total: number;
        breached: number;
        complianceRate: number | null;
        avgResolutionMins: number | null;
    };
}>;
declare const getSLA: (companyId: string) => Promise<{
    overall: {
        total: number;
        breached: number;
        met: number;
        complianceRate: number | null;
    };
    byPriority: {
        priority: string;
        total: number;
        breached: number;
        complianceRate: number | null;
    }[];
    byCategory: {
        categoryId: string;
        total: number;
        breached: number;
        complianceRate: number | null;
    }[];
}>;
declare const getAgentPerformance: (companyId: string) => Promise<{
    agent: {
        name: string;
        email: string;
        avatar: unknown;
    } | {
        name: string;
        email: null;
        avatar: null;
    };
    metrics: {
        totalTickets: number;
        openTickets: number;
        resolvedTickets: number;
        closedTickets: number;
        avgResolutionHours: number | null;
        avgFirstResponseMins: number | null;
    };
}[]>;
export { list, create, getById, update, remove, reply, assign, changeStatus, changePriority, close, getAISummary, listCategories, createCategory, updateCategory, removeCategory, getSummary, getSLA, getAgentPerformance, };
//# sourceMappingURL=support.service.d.ts.map