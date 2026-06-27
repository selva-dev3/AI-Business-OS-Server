import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { avatarUpload, handleUploadError } from '../middleware/upload';
import auditLog from '../middleware/auditLogger';
import * as userController from '../controllers/user.controller';
import {
  inviteUserSchema,
  updateUserSchema,
  changeRoleSchema,
  resetUserPasswordSchema,
  updateProfileSchema,
} from '../validators/user.validator';

router.use(authenticate);

router.get('/', userController.list);
router.post('/invite', validate(inviteUserSchema), auditLog('user', 'INVITE', 'user'), userController.invite);
router.get('/:id', userController.getById);
router.patch('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', auditLog('user', 'DEACTIVATE', 'user'), userController.remove);
router.patch('/:id/change-role', validate(changeRoleSchema), auditLog('user', 'CHANGE_ROLE', 'user'), userController.changeRole);
router.post('/:id/reset-password', validate(resetUserPasswordSchema), auditLog('user', 'RESET_PASSWORD', 'user'), userController.resetPassword);

router.patch('/profile/me', validate(updateProfileSchema), userController.updateProfile);
router.post('/profile/avatar', avatarUpload, handleUploadError, userController.uploadAvatar);

export default router;
