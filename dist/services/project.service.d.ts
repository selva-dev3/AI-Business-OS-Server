interface QueryParams {
    status?: string;
    ownerId?: string;
    search?: string;
    page?: string;
    limit?: string;
    assignee?: string;
    priority?: string;
    milestone?: string;
    userId?: string;
    projectId?: string;
    taskId?: string;
    startDate?: string;
    endDate?: string;
}
declare const list: (companyId: string, query: QueryParams) => Promise<{
    projects: (import("mongoose").Document<unknown, {}, import("../models/Project").IProject, {}, {}> & import("../models/Project").IProject & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    total: number;
    page: number;
    limit: number;
}>;
declare const create: (companyId: string, userId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Project").IProject, {}, {}> & import("../models/Project").IProject & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getById: (companyId: string, projectId: string) => Promise<any>;
declare const update: (companyId: string, projectId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Project").IProject, {}, {}> & import("../models/Project").IProject & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const remove: (companyId: string, projectId: string) => Promise<{
    success: boolean;
}>;
declare const addMember: (companyId: string, projectId: string, data: Record<string, unknown>) => Promise<Omit<import("mongoose").Document<unknown, {}, import("../models/ProjectMember").IProjectMember, {}, {}> & import("../models/ProjectMember").IProjectMember & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, never>>;
declare const removeMember: (companyId: string, projectId: string, userId: string) => Promise<{
    success: boolean;
}>;
declare const listTasks: (companyId: string, projectId: string, query: QueryParams) => Promise<{
    tasks: (import("mongoose").Document<unknown, {}, import("../models/Task").ITask, {}, {}> & import("../models/Task").ITask & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    total: number;
    page: number;
    limit: number;
}>;
declare const createTask: (companyId: string, projectId: string, userId: string, data: Record<string, unknown>) => Promise<Omit<import("mongoose").Document<unknown, {}, import("../models/Task").ITask, {}, {}> & import("../models/Task").ITask & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, never>>;
declare const getTaskById: (companyId: string, taskId: string) => Promise<any>;
declare const updateTask: (companyId: string, taskId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Task").ITask, {}, {}> & import("../models/Task").ITask & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeTask: (companyId: string, taskId: string) => Promise<{
    success: boolean;
}>;
declare const moveTask: (companyId: string, taskId: string, data: Record<string, unknown>) => Promise<Omit<import("mongoose").Document<unknown, {}, import("../models/Task").ITask, {}, {}> & import("../models/Task").ITask & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, never>>;
declare const logTime: (companyId: string, taskId: string, userId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Timesheet").ITimesheet, {}, {}> & import("../models/Timesheet").ITimesheet & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const addComment: (companyId: string, taskId: string, userId: string, data: Record<string, unknown>) => Promise<Omit<import("mongoose").Document<unknown, {}, import("../models/TaskComment").ITaskComment, {}, {}> & import("../models/TaskComment").ITaskComment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, never>>;
declare const getComments: (companyId: string, taskId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/TaskComment").ITaskComment, {}, {}> & import("../models/TaskComment").ITaskComment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const listMilestones: (companyId: string, projectId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Milestone").IMilestone, {}, {}> & import("../models/Milestone").IMilestone & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const getMilestoneById: (companyId: string, milestoneId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Milestone").IMilestone, {}, {}> & import("../models/Milestone").IMilestone & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const createMilestone: (companyId: string, projectId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Milestone").IMilestone, {}, {}> & import("../models/Milestone").IMilestone & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateMilestone: (companyId: string, milestoneId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Milestone").IMilestone, {}, {}> & import("../models/Milestone").IMilestone & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeMilestone: (companyId: string, milestoneId: string) => Promise<{
    success: boolean;
}>;
declare const listTimesheets: (companyId: string, query: QueryParams) => Promise<{
    entries: (import("mongoose").Document<unknown, {}, import("../models/Timesheet").ITimesheet, {}, {}> & import("../models/Timesheet").ITimesheet & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    total: number;
    page: number;
    limit: number;
    summary: {
        totalHours?: number;
        billableHours?: number;
    };
}>;
declare const createTimesheet: (companyId: string, userId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Timesheet").ITimesheet, {}, {}> & import("../models/Timesheet").ITimesheet & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getProjectTimesheets: (companyId: string, projectId: string, query: QueryParams) => Promise<{
    entries: (import("mongoose").Document<unknown, {}, import("../models/Timesheet").ITimesheet, {}, {}> & import("../models/Timesheet").ITimesheet & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    total: number;
    page: number;
    limit: number;
    summary: {
        totalHours?: number;
        billableHours?: number;
    };
}>;
declare const getSummary: (companyId: string, projectId: string) => Promise<{
    completion: {
        percent: number;
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            review: number;
            todo: number;
        };
    };
    timeline: {
        start: Date;
        end: Date;
        remaining: number;
    } | null;
    budget: {
        total: number;
    } | null;
    team: {
        totalMembers: number;
    };
    milestones: {
        total: number;
        completed: number;
    };
    timeTracking: {
        totalHours: number;
        billableHours: number;
    };
}>;
export { list, create, getById, update, remove, addMember, removeMember, listTasks, createTask, getTaskById, updateTask, removeTask, moveTask, logTime, addComment, getComments, listMilestones, getMilestoneById, createMilestone, updateMilestone, removeMilestone, listTimesheets, createTimesheet, getProjectTimesheets, getSummary, };
//# sourceMappingURL=project.service.d.ts.map