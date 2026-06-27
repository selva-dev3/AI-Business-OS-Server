import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import auditLog from '../middleware/auditLogger';
import * as notificationController from '../controllers/notification.controller';

router.use(authenticate);

router.get('/', notificationController.list);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', auditLog('notification', 'DELETE', 'notification'), notificationController.remove);

export default router;
