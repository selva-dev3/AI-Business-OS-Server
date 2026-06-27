export interface JwtPayload {
    userId: string;
    companyId: string;
    roleId: string;
    iat: number;
    exp: number;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: Record<string, unknown>;
}
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    password: string;
}
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface ForgotPasswordRequest {
    email: string;
}
export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
export interface Verify2FARequest {
    token: string;
}
//# sourceMappingURL=auth.types.d.ts.map