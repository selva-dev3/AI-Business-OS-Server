import User from '../models/User';
import AppError from '../utils/appError';
import { generateOTP, paginateQuery, buildMeta, buildSearchQuery } from '../utils/helpers';
import { sendInvitationEmail, sendPasswordResetEmail } from '../utils/emailService';

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

class UserService {
  async list(companyId: string, query: ListQuery) {
    const { page, limit, search, roleId, isActive } = query;
    const { skip, limit: pageLimit, page: pageNum } = paginateQuery(page, Number(limit));

    const filter: Record<string, unknown> = { companyId };

    if (search) {
      Object.assign(filter, buildSearchQuery(search, ['firstName', 'lastName', 'email']));
    }

    if (roleId) {
      filter.roleId = roleId;
    }

    if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit)
        .populate('roleId', 'name'),
      User.countDocuments(filter),
    ]);

    const meta = buildMeta(total, pageNum, pageLimit);

    return { data: users, meta };
  }

  async invite(data: InviteData, companyId: string, invitedBy: Record<string, unknown>) {
    const { email, firstName, lastName, roleId } = data;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError(409, 'CONFLICT', 'A user with this email already exists');
    }

    const tempPassword = generateOTP(10);

    const user = await User.create({
      email,
      firstName,
      lastName,
      roleId,
      companyId,
      password: tempPassword,
    });

    const companyName = (invitedBy.companyId as Record<string, unknown> | undefined)?.name || 'Company';
    const inviterName = `${invitedBy.firstName as string} ${invitedBy.lastName as string}`.trim();
    await sendInvitationEmail(user.email as string, companyName as string, inviterName);

    return user;
  }

  async getById(id: string, companyId: string) {
    const user = await User.findOne({ _id: id, companyId })
      .populate('roleId', 'name permissions')
      .populate('employee', 'employeeCode department');

    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    return user;
  }

  async update(id: string, data: UpdateData, companyId: string) {
    const allowedFields = ['firstName', 'lastName', 'phone', 'isActive'];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (data[field as keyof UpdateData] !== undefined) {
        updates[field] = data[field as keyof UpdateData];
      }
    }

    const user = await User.findOneAndUpdate(
      { _id: id, companyId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    return user;
  }

  async deactivate(id: string, companyId: string) {
    const user = await User.findOneAndUpdate(
      { _id: id, companyId },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    return { message: 'User deactivated successfully' };
  }

  async changeRole(id: string, roleId: string, companyId: string) {
    const user = await User.findOneAndUpdate(
      { _id: id, companyId },
      { $set: { roleId } },
      { new: true }
    ).populate('roleId', 'name');

    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    return user;
  }

  async resetPassword(id: string, data: ResetPasswordData, companyId: string) {
    const user = await User.findOne({ _id: id, companyId }).select('+password');
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    const newPassword = generateOTP(10);
    user.password = newPassword;
    await user.save();

    if (data.sendEmail) {
      await sendPasswordResetEmail(user.email as string, newPassword);
    }

    return { message: 'Password reset successfully' };
  }

  async updateProfile(userId: string, data: ProfileUpdateData) {
    const allowedFields = ['firstName', 'lastName', 'phone'];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (data[field as keyof ProfileUpdateData] !== undefined) {
        updates[field] = data[field as keyof ProfileUpdateData];
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    return user;
  }

  async uploadAvatar(userId: string, file: { filename: string }) {
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { avatar: avatarUrl } },
      { new: true }
    );

    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    return { avatar: avatarUrl };
  }
}

export default new UserService();
