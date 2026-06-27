import express from 'express';
const router = express.Router();

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import companyRoutes from './company.routes';
import hrmsRoutes from './hrms.routes';
import crmRoutes from './crm.routes';
import inventoryRoutes from './inventory.routes';
import procurementRoutes from './procurement.routes';
import financeRoutes from './finance.routes';
import projectRoutes from './project.routes';
import supportRoutes from './support.routes';
import documentRoutes from './document.routes';
import analyticsRoutes from './analytics.routes';
import settingsRoutes from './settings.routes';
import notificationRoutes from './notification.routes';
import aiRoutes from './ai.routes';
import dashboardRoutes from './dashboard.routes';

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/company', companyRoutes);
router.use('/hrms', hrmsRoutes);
router.use('/crm', crmRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/procurement', procurementRoutes);
router.use('/finance', financeRoutes);
router.use('/projects', projectRoutes);
router.use('/support', supportRoutes);
router.use('/documents', documentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/settings', settingsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ai', aiRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
