interface ListQuery {
    page?: string;
    limit?: string;
    search?: string;
    roleId?: string;
    isActive?: string;
}
interface InviteData {
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
}
interface UpdateData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    isActive?: boolean;
}
interface ProfileUpdateData {
    firstName?: string;
    lastName?: string;
    phone?: string;
}
interface ResetPasswordData {
    sendEmail?: boolean;
}
declare class UserService {
    list(companyId: string, query: ListQuery): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: import("../types").BuildMetaResult;
    }>;
    invite(data: InviteData, companyId: string, invitedBy: Record<string, unknown>): Promise<import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getById(id: string, companyId: string): Promise<import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, data: UpdateData, companyId: string): Promise<import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deactivate(id: string, companyId: string): Promise<{
        message: string;
    }>;
    changeRole(id: string, roleId: string, companyId: string): Promise<import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    resetPassword(id: string, data: ResetPasswordData, companyId: string): Promise<{
        message: string;
    }>;
    updateProfile(userId: string, data: ProfileUpdateData): Promise<import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    uploadAvatar(userId: string, file: {
        filename: string;
    }): Promise<{
        avatar: string;
    }>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map