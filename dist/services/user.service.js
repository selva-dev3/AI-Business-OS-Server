"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const emailService_1 = require("../utils/emailService");
class UserService {
    async list(companyId, query) {
        const { page, limit, search, roleId, isActive } = query;
        const { skip, limit: pageLimit, page: pageNum } = (0, helpers_1.paginateQuery)(page, Number(limit));
        const filter = { companyId };
        if (search) {
            Object.assign(filter, (0, helpers_1.buildSearchQuery)(search, ['firstName', 'lastName', 'email']));
        }
        if (roleId) {
            filter.roleId = roleId;
        }
        if (isActive !== undefined && isActive !== '') {
            filter.isActive = isActive === 'true';
        }
        const [users, total] = await Promise.all([
            User_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageLimit)
                .populate('roleId', 'name'),
            User_1.default.countDocuments(filter),
        ]);
        const meta = (0, helpers_1.buildMeta)(total, pageNum, pageLimit);
        return { data: users, meta };
    }
    async invite(data, companyId, invitedBy) {
        const { email, firstName, lastName, roleId } = data;
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            throw new appError_1.default(409, 'CONFLICT', 'A user with this email already exists');
        }
        const tempPassword = (0, helpers_1.generateOTP)(10);
        const user = await User_1.default.create({
            email,
            firstName,
            lastName,
            roleId,
            companyId,
            password: tempPassword,
        });
        const companyName = invitedBy.companyId?.name || 'Company';
        const inviterName = `${invitedBy.firstName} ${invitedBy.lastName}`.trim();
        await (0, emailService_1.sendInvitationEmail)(user.email, companyName, inviterName);
        return user;
    }
    async getById(id, companyId) {
        const user = await User_1.default.findOne({ _id: id, companyId })
            .populate('roleId', 'name permissions')
            .populate('employee', 'employeeCode department');
        if (!user) {
            throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
        }
        return user;
    }
    async update(id, data, companyId) {
        const allowedFields = ['firstName', 'lastName', 'phone', 'isActive'];
        const updates = {};
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        }
        const user = await User_1.default.findOneAndUpdate({ _id: id, companyId }, { $set: updates }, { new: true, runValidators: true });
        if (!user) {
            throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
        }
        return user;
    }
    async deactivate(id, companyId) {
        const user = await User_1.default.findOneAndUpdate({ _id: id, companyId }, { $set: { isActive: false } }, { new: true });
        if (!user) {
            throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
        }
        return { message: 'User deactivated successfully' };
    }
    async changeRole(id, roleId, companyId) {
        const user = await User_1.default.findOneAndUpdate({ _id: id, companyId }, { $set: { roleId } }, { new: true }).populate('roleId', 'name');
        if (!user) {
            throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
        }
        return user;
    }
    async resetPassword(id, data, companyId) {
        const user = await User_1.default.findOne({ _id: id, companyId }).select('+password');
        if (!user) {
            throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
        }
        const newPassword = (0, helpers_1.generateOTP)(10);
        user.password = newPassword;
        await user.save();
        if (data.sendEmail) {
            await (0, emailService_1.sendPasswordResetEmail)(user.email, newPassword);
        }
        return { message: 'Password reset successfully' };
    }
    async updateProfile(userId, data) {
        const allowedFields = ['firstName', 'lastName', 'phone'];
        const updates = {};
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        }
        const user = await User_1.default.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true });
        if (!user) {
            throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
        }
        return user;
    }
    async uploadAvatar(userId, file) {
        const avatarUrl = `/uploads/avatars/${file.filename}`;
        const user = await User_1.default.findByIdAndUpdate(userId, { $set: { avatar: avatarUrl } }, { new: true });
        if (!user) {
            throw new appError_1.default(404, 'NOT_FOUND', 'User not found');
        }
        return { avatar: avatarUrl };
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map