const User = require('../models/User');
const AppError = require('../utils/appError');
const {
  generateOTP,
  paginateQuery,
  buildMeta,
  buildSearchQuery,
} = require('../utils/helpers');
const {
  sendInvitationEmail,
  sendPasswordResetEmail,
} = require('../utils/emailService');

class UserService {
  async list(companyId, query) {
    const { page, limit, search, roleId, isActive } = query;
    const { skip, limit: pageLimit, page: pageNum } = paginateQuery(page, limit);

    const filter = { companyId };

    if (search) {
      Object.assign(filter, buildSearchQuery(search, ['firstName', 'lastName', 'email']));
    }

    if (roleId) {
      filter.roleId = roleId;
    }

    if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true' || isActive === true;
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

  async invite(data, companyId, invitedBy) {
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

    const companyName = invitedBy.companyId?.name || 'Company';
    const inviterName = `${invitedBy.firstName} ${invitedBy.lastName}`.trim();
    await sendInvitationEmail(user.email, companyName, inviterName);

    return user;
  }

  async getById(id, companyId) {
    const user = await User.findOne({ _id: id, companyId })
      .populate('roleId', 'name permissions')
      .populate('employee', 'employeeCode department');

    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
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

  async deactivate(id, companyId) {
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

  async changeRole(id, roleId, companyId) {
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

  async resetPassword(id, data, companyId) {
    const user = await User.findOne({ _id: id, companyId }).select('+password');
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    const newPassword = generateOTP(10);
    user.password = newPassword;
    await user.save();

    if (data.sendEmail) {
      await sendPasswordResetEmail(user.email, newPassword);
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

  async uploadAvatar(userId, file) {
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

module.exports = new UserService();
