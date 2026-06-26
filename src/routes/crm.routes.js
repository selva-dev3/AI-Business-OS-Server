const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CRM
 *   description: Customer Relationship Management (Leads, Contacts, Accounts, Deals, Activities)
 */


const crmController = require('../controllers/crm.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createLeadSchema,
  updateLeadSchema,
  changeLeadStageSchema,
  convertLeadSchema,
  createActivitySchema,
  updateActivitySchema,
  createContactSchema,
  updateContactSchema,
  mergeContactsSchema,
  createAccountSchema,
  updateAccountSchema,
  createDealSchema,
  updateDealSchema,
  changeDealStageSchema,
  closeWonDealSchema,
  closeLostDealSchema,
  reorderPipelineSchema,
} = require('../validators/crm.validator');

router.use(authenticate);

// ─── Dashboard ────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /crm/dashboard:
 *   get:
 *     summary: Get dashboard data for Dashboard
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', crmController.getDashboard);

// ─── Leads ────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /crm/leads:
 *   get:
 *     summary: Get Leads
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/leads', crmController.listLeads);
/**
 * @swagger
 * /crm/leads:
 *   post:
 *     summary: Create Leads
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/leads', validate(createLeadSchema), crmController.createLead);
/**
 * @swagger
 * /crm/leads/{id}:
 *   get:
 *     summary: Get Leads
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/leads/:id', crmController.getLead);
/**
 * @swagger
 * /crm/leads/{id}:
 *   patch:
 *     summary: Update Leads
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/leads/:id', validate(updateLeadSchema), crmController.updateLead);
/**
 * @swagger
 * /crm/leads/{id}:
 *   delete:
 *     summary: Delete Leads
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/leads/:id', crmController.deleteLead);
/**
 * @swagger
 * /crm/leads/{id}/stage:
 *   patch:
 *     summary: Update Leads Stage
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/leads/:id/stage', validate(changeLeadStageSchema), crmController.changeLeadStage);
/**
 * @swagger
 * /crm/leads/{id}/convert:
 *   post:
 *     summary: Create Leads Convert
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/leads/:id/convert', validate(convertLeadSchema), crmController.convertLead);
/**
 * @swagger
 * /crm/leads/{id}/activity:
 *   post:
 *     summary: Create Leads Activity
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/leads/:id/activity', validate(createActivitySchema), crmController.addLeadActivity);

// ─── Contacts ─────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /crm/contacts:
 *   get:
 *     summary: Get Contacts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/contacts', crmController.listContacts);
/**
 * @swagger
 * /crm/contacts:
 *   post:
 *     summary: Create Contacts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/contacts', validate(createContactSchema), crmController.createContact);
/**
 * @swagger
 * /crm/contacts/{id}:
 *   get:
 *     summary: Get Contacts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/contacts/:id', crmController.getContact);
/**
 * @swagger
 * /crm/contacts/{id}:
 *   patch:
 *     summary: Update Contacts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/contacts/:id', validate(updateContactSchema), crmController.updateContact);
/**
 * @swagger
 * /crm/contacts/{id}:
 *   delete:
 *     summary: Delete Contacts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/contacts/:id', crmController.deleteContact);
/**
 * @swagger
 * /crm/contacts/merge:
 *   post:
 *     summary: Create Contacts Merge
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/contacts/merge', validate(mergeContactsSchema), crmController.mergeContacts);

// ─── Accounts ─────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /crm/accounts:
 *   get:
 *     summary: Get Accounts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/accounts', crmController.listAccounts);
/**
 * @swagger
 * /crm/accounts:
 *   post:
 *     summary: Create Accounts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/accounts', validate(createAccountSchema), crmController.createAccount);
/**
 * @swagger
 * /crm/accounts/{id}:
 *   get:
 *     summary: Get Accounts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/accounts/:id', crmController.getAccount);
/**
 * @swagger
 * /crm/accounts/{id}:
 *   patch:
 *     summary: Update Accounts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/accounts/:id', validate(updateAccountSchema), crmController.updateAccount);
/**
 * @swagger
 * /crm/accounts/{id}:
 *   delete:
 *     summary: Delete Accounts
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/accounts/:id', crmController.deleteAccount);

// ─── Deals ────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /crm/deals:
 *   get:
 *     summary: Get Deals
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/deals', crmController.listDeals);
/**
 * @swagger
 * /crm/deals:
 *   post:
 *     summary: Create Deals
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/deals', validate(createDealSchema), crmController.createDeal);
/**
 * @swagger
 * /crm/deals/{id}:
 *   get:
 *     summary: Get Deals
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/deals/:id', crmController.getDeal);
/**
 * @swagger
 * /crm/deals/{id}:
 *   patch:
 *     summary: Update Deals
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/deals/:id', validate(updateDealSchema), crmController.updateDeal);
/**
 * @swagger
 * /crm/deals/{id}:
 *   delete:
 *     summary: Delete Deals
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/deals/:id', crmController.deleteDeal);
/**
 * @swagger
 * /crm/deals/{id}/stage:
 *   patch:
 *     summary: Update Deals Stage
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/deals/:id/stage', validate(changeDealStageSchema), crmController.changeDealStage);
/**
 * @swagger
 * /crm/deals/{id}/close-won:
 *   post:
 *     summary: Create Deals Close-won
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/deals/:id/close-won', validate(closeWonDealSchema), crmController.closeWonDeal);
/**
 * @swagger
 * /crm/deals/{id}/close-lost:
 *   post:
 *     summary: Create Deals Close-lost
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/deals/:id/close-lost', validate(closeLostDealSchema), crmController.closeLostDeal);

// ─── Pipeline ─────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /crm/pipeline:
 *   get:
 *     summary: Get Pipeline
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/pipeline', crmController.getPipeline);
/**
 * @swagger
 * /crm/pipeline/reorder:
 *   patch:
 *     summary: Update Pipeline Reorder
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/pipeline/reorder', validate(reorderPipelineSchema), crmController.reorderPipeline);

// ─── Activities ───────────────────────────────────────────────────────────────
/**
 * @swagger
 * /crm/activities:
 *   get:
 *     summary: Get Activities
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/activities', crmController.listActivities);
/**
 * @swagger
 * /crm/activities:
 *   post:
 *     summary: Create Activities
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/activities', validate(createActivitySchema), crmController.createActivity);
/**
 * @swagger
 * /crm/activities/{id}:
 *   patch:
 *     summary: Update Activities
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/activities/:id', validate(updateActivitySchema), crmController.updateActivity);
/**
 * @swagger
 * /crm/activities/{id}:
 *   delete:
 *     summary: Delete Activities
 *     tags: [CRM]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/activities/:id', crmController.deleteActivity);

module.exports = router;
