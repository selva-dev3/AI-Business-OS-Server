interface ActivityItem {
    module: string;
    action: string;
    title: string;
    description: string;
    status: string | null;
    refId: string | null;
    refModel: string | null;
    meta: Record<string, unknown>;
    timestamp: Date;
    user: {
        id: string;
        name?: string;
    } | null;
}
declare const getActivity: (companyId: string, { limit, module: filterModule }?: {
    limit?: number;
    module?: string;
}) => Promise<{
    activities: ActivityItem[];
    total: number;
    modules: string[];
}>;
export { getActivity };
//# sourceMappingURL=dashboard.service.d.ts.map