interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    companyName: string;
}
interface Tokens {
    accessToken: string;
    refreshToken: string;
}
declare const register: (data: RegisterData) => Promise<{
    user: import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    company: import("mongoose").Document<unknown, {}, import("../models/Company").ICompany, {}, {}> & import("../models/Company").ICompany & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    tokens: Tokens;
}>;
declare const login: (email: string, password: string) => Promise<{
    user: import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    tokens: Tokens;
}>;
declare const refreshToken: (token: string) => Promise<Tokens>;
declare const logout: (refreshTokenValue: string) => Promise<void>;
declare const forgotPassword: (email: string) => Promise<void>;
declare const resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
declare const changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
declare const generateTokens: (user: Record<string, unknown>) => Promise<Tokens>;
declare const enable2FA: (userId: string) => Promise<{
    qrCode: string;
    secret: string;
}>;
declare const verify2FA: (userId: string, token: string) => Promise<{
    message: string;
}>;
export { register, login, refreshToken, logout, forgotPassword, resetPassword, changePassword, generateTokens, enable2FA, verify2FA, };
//# sourceMappingURL=auth.service.d.ts.map