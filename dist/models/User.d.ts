import mongoose, { Document, Types } from 'mongoose';
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
    isActive?: boolean;
    isEmailVerified?: boolean;
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    companyId?: Types.ObjectId;
    roleId?: Types.ObjectId;
    lastLoginAt?: Date;
    refreshToken?: string;
    resetPasswordOtp?: string;
    resetPasswordOtpExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map