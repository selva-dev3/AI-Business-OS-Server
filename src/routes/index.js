const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const companyRoutes = require('./company.routes');
const hrmsRoutes = require('./hrms.routes');
const crmRoutes = require('./crm.routes');
const inventoryRoutes = require('./inventory.routes');
const procurementRoutes = require('./procurement.routes');
const financeRoutes = require('./finance.routes');
const projectRoutes = require('./project.routes');
const supportRoutes = require('./support.routes');
const documentRoutes = require('./document.routes');
const analyticsRoutes = require('./analytics.routes');
const settingsRoutes = require('./settings.routes');
const notificationRoutes = require('./notification.routes');
const aiRoutes = require('./ai.routes');

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

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;
