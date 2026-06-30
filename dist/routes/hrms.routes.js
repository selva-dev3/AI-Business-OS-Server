"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const auditLogger_1 = __importDefault(require("../middleware/auditLogger"));
const upload_1 = require("../middleware/upload");
const hrmsController = __importStar(require("../controllers/hrms.controller"));
const hrms_validator_1 = require("../validators/hrms.validator");
const rbac_1 = require("../middleware/rbac");
const roleGuard_1 = require("../middleware/roleGuard");
const selfOrAdmin_1 = require("../middleware/selfOrAdmin");
/**
 * @swagger
 * tags:
 *   - name: HRMS
 *     description: Human Resource Management System - Departments, Attendance, Leaves, Payroll, Assets
 *   - name: Employees
 *     description: Employee master, profile, onboarding, offboarding, performance, training, transfers
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         hasNext:
 *           type: boolean
 *         hasPrev:
 *           type: boolean
 *
 *     EmployeeProfile:
 *       type: object
 *       properties:
 *         personalEmail:
 *           type: string
 *         phone:
 *           type: string
 *         alternatePhone:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         bloodGroup:
 *           type: string
 *         maritalStatus:
 *           type: string
 *         avatar:
 *           type: string
 *         address:
 *           type: object
 *         emergencyContact:
 *           type: object
 *         bankDetails:
 *           type: object
 *         panNumber:
 *           type: string
 *         aadharNumber:
 *           type: string
 *
 *     UpdateProfileRequest:
 *       type: object
 *       description: Partial update for employee profile/personal information. At least one field required.
 *       properties:
 *         personalEmail:
 *           type: string
 *           format: email
 *           description: Personal email address
 *           maxLength: 200
 *           example: jane.doe@gmail.com
 *         phone:
 *           type: string
 *           description: Primary contact number
 *           maxLength: 20
 *           example: '+1-555-0100'
 *         alternatePhone:
 *           type: string
 *           description: Alternate contact number
 *           maxLength: 20
 *           example: '+1-555-0101'
 *         dob:
 *           type: string
 *           format: date
 *           description: Date of birth (ISO 8601)
 *           example: '1990-05-15'
 *         gender:
 *           type: string
 *           description: Employee gender
 *           enum: [MALE, FEMALE, OTHER]
 *           example: FEMALE
 *         bloodGroup:
 *           type: string
 *           description: Blood group
 *           maxLength: 10
 *           example: O+
 *         maritalStatus:
 *           type: string
 *           description: Marital status
 *           maxLength: 20
 *           example: Married
 *         avatar:
 *           type: string
 *           format: uri
 *           description: URL to avatar image
 *           example: https://company.com/avatars/jane.jpg
 *         address:
 *           type: object
 *           description: Residential address
 *           properties:
 *             street:
 *               type: string
 *               example: 456 Oak St
 *             city:
 *               type: string
 *               example: New York
 *             state:
 *               type: string
 *               example: NY
 *             country:
 *               type: string
 *               example: USA
 *             zip:
 *               type: string
 *               example: '10001'
 *         emergencyContact:
 *           type: object
 *           description: Emergency contact details
 *           properties:
 *             name:
 *               type: string
 *               example: John Doe
 *             relation:
 *               type: string
 *               example: Spouse
 *             phone:
 *               type: string
 *               example: '+1-555-0200'
 *         bankDetails:
 *           type: object
 *           description: Bank account details
 *           properties:
 *             accountNumber:
 *               type: string
 *               example: '1234567890'
 *             ifscCode:
 *               type: string
 *               example: HDFC0001234
 *             bankName:
 *               type: string
 *               example: HDFC Bank
 *             accountType:
 *               type: string
 *               example: Savings
 *         panNumber:
 *           type: string
 *           description: Permanent Account Number (tax ID)
 *           maxLength: 20
 *           example: ABCDE1234F
 *         aadharNumber:
 *           type: string
 *           description: Aadhaar number
 *           maxLength: 20
 *           example: '123412341234'
 *
 *     UpdateEmployeeStatusRequest:
 *       type: object
 *       description: Payload for activating, deactivating, or terminating an employee
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           description: New employment status
 *           enum: [ACTIVE, INACTIVE, TERMINATED]
 *           example: ACTIVE
 *         exitDate:
 *           type: string
 *           format: date
 *           description: Date of exit (required if terminating)
 *           example: '2024-06-30'
 *         exitReason:
 *           type: string
 *           description: Reason for exit / termination
 *           maxLength: 1000
 *           example: Employee resigned
 *
 *     EmployeeHistory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         changeType:
 *           type: string
 *         oldValue:
 *           type: string
 *         newValue:
 *           type: string
 *         oldDepartmentId:
 *           type: object
 *         newDepartmentId:
 *           type: object
 *         oldDesignationId:
 *           type: object
 *         newDesignationId:
 *           type: object
 *         effectiveDate:
 *           type: string
 *           format: date
 *         changedBy:
 *           type: object
 *         reason:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CheckinRequest:
 *       type: object
 *       description: Request body for marking attendance check-in
 *       required:
 *         - employeeId
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         date:
 *           type: string
 *           format: date
 *           description: Attendance date (defaults to today if omitted)
 *           example: '2024-03-15'
 *         checkIn:
 *           type: string
 *           format: date-time
 *           description: Check-in timestamp (defaults to current time if omitted)
 *           example: '2024-03-15T09:00:00.000Z'
 *         source:
 *           type: string
 *           description: Source of the check-in
 *           enum: [APP, MANUAL, BIOMETRIC]
 *           default: APP
 *           example: APP
 *         notes:
 *           type: string
 *           description: Optional notes for the check-in
 *           maxLength: 1000
 *           example: Checked in from office
 *
 *     CheckoutRequest:
 *       type: object
 *       description: Request body for marking attendance check-out
 *       required:
 *         - employeeId
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         date:
 *           type: string
 *           format: date
 *           description: Attendance date (defaults to today if omitted)
 *           example: '2024-03-15'
 *         checkOut:
 *           type: string
 *           format: date-time
 *           description: Check-out timestamp (defaults to current time if omitted)
 *           example: '2024-03-15T18:00:00.000Z'
 *         notes:
 *           type: string
 *           description: Optional notes for the check-out
 *           maxLength: 1000
 *           example: Checked out after work
 *
 *     RegularizeAttendanceRequest:
 *       type: object
 *       description: Request body for attendance regularization
 *       required:
 *         - employeeId
 *         - date
 *         - reason
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         date:
 *           type: string
 *           format: date
 *           description: Date requiring regularization (ISO 8601)
 *           example: '2024-03-15'
 *         checkIn:
 *           type: string
 *           format: date-time
 *           description: Corrected check-in time
 *           example: '2024-03-15T09:15:00.000Z'
 *         checkOut:
 *           type: string
 *           format: date-time
 *           description: Corrected check-out time
 *           example: '2024-03-15T17:45:00.000Z'
 *         reason:
 *           type: string
 *           description: Reason for regularization
 *           maxLength: 1000
 *           example: Forgot to check in on time
 *
 *     ApproveRejectRegularizationRequest:
 *       type: object
 *       description: Request body for approving or rejecting a regularization request
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           description: Decision status
 *           enum: [APPROVED, REJECTED]
 *           example: APPROVED
 *         comments:
 *           type: string
 *           description: Reviewer comments
 *           maxLength: 1000
 *           example: Request approved
 *
 *     RegularizationRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         companyId:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         checkIn:
 *           type: string
 *           format: date-time
 *         checkOut:
 *           type: string
 *           format: date-time
 *         reason:
 *           type: string
 *         status:
 *           type: string
 *         approvedBy:
 *           type: string
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         comments:
 *           type: string
 *
 *     CreatePerformanceGoalRequest:
 *       type: object
 *       description: Payload for creating a performance goal for an employee
 *       required:
 *         - employeeId
 *         - title
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         title:
 *           type: string
 *           description: Goal title
 *           maxLength: 200
 *           example: Increase customer satisfaction score
 *         description:
 *           type: string
 *           description: Detailed description of the goal
 *           maxLength: 2000
 *           example: Achieve CSAT score of 4.5+ by end of quarter
 *         category:
 *           type: string
 *           description: Goal category
 *           maxLength: 100
 *           example: Quality
 *         startDate:
 *           type: string
 *           format: date
 *           description: Goal start date (ISO 8601)
 *           example: '2024-01-01'
 *         endDate:
 *           type: string
 *           format: date
 *           description: Goal end date (ISO 8601)
 *           example: '2024-03-31'
 *         targetValue:
 *           type: number
 *           description: Numeric target to achieve
 *           example: 4.5
 *         measurementUnit:
 *           type: string
 *           description: Unit for measuring target
 *           maxLength: 50
 *           example: Score (out of 5)
 *         weightage:
 *           type: number
 *           description: Goal weightage percentage (0-100)
 *           minimum: 0
 *           maximum: 100
 *           example: 30
 *         status:
 *           type: string
 *           description: Current status of the goal
 *           enum: [NOT_STARTED, IN_PROGRESS, ACHIEVED, NOT_ACHIEVED]
 *           example: NOT_STARTED
 *         notes:
 *           type: string
 *           description: Additional notes
 *           maxLength: 2000
 *           example: Focus on response time and resolution quality
 *
 *     UpdatePerformanceGoalRequest:
 *       type: object
 *       description: Partial update for an existing performance goal. At least one field required.
 *       properties:
 *         title:
 *           type: string
 *           description: Goal title
 *           maxLength: 200
 *           example: Increase customer satisfaction score
 *         description:
 *           type: string
 *           description: Detailed description of the goal
 *           maxLength: 2000
 *           example: Achieve CSAT score of 4.8+ by end of quarter
 *         category:
 *           type: string
 *           description: Goal category
 *           maxLength: 100
 *           example: Quality
 *         startDate:
 *           type: string
 *           format: date
 *           description: Goal start date (ISO 8601)
 *           example: '2024-01-01'
 *         endDate:
 *           type: string
 *           format: date
 *           description: Goal end date (ISO 8601)
 *           example: '2024-03-31'
 *         targetValue:
 *           type: number
 *           description: Numeric target to achieve
 *           example: 4.8
 *         currentValue:
 *           type: number
 *           description: Current progress value
 *           minimum: 0
 *           example: 4.2
 *         measurementUnit:
 *           type: string
 *           description: Unit for measuring target
 *           maxLength: 50
 *           example: Score (out of 5)
 *         weightage:
 *           type: number
 *           description: Goal weightage percentage (0-100)
 *           minimum: 0
 *           maximum: 100
 *           example: 35
 *         status:
 *           type: string
 *           description: Current status of the goal
 *           enum: [NOT_STARTED, IN_PROGRESS, ACHIEVED, NOT_ACHIEVED]
 *           example: IN_PROGRESS
 *         notes:
 *           type: string
 *           description: Additional notes
 *           maxLength: 2000
 *           example: On track to exceed target
 *
 *     PerformanceGoal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         targetValue:
 *           type: number
 *         currentValue:
 *           type: number
 *         measurementUnit:
 *           type: string
 *         weightage:
 *           type: number
 *         status:
 *           type: string
 *         createdBy:
 *           type: object
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     SubmitAppraisalRequest:
 *       type: object
 *       description: Payload for submitting a performance appraisal
 *       required:
 *         - employeeId
 *         - reviewPeriod
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         reviewPeriod:
 *           type: string
 *           description: Name / identifier of the review period
 *           maxLength: 100
 *           example: Q1 2024
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start of review period (ISO 8601)
 *           example: '2024-01-01'
 *         endDate:
 *           type: string
 *           format: date
 *           description: End of review period (ISO 8601)
 *           example: '2024-03-31'
 *         rating:
 *           type: number
 *           description: Overall rating (1-5)
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         strengths:
 *           type: string
 *           description: Key strengths of the employee
 *           maxLength: 2000
 *           example: Excellent problem-solving and team collaboration
 *         areasOfImprovement:
 *           type: string
 *           description: Areas identified for improvement
 *           maxLength: 2000
 *           example: Could improve documentation practices
 *         overallComments:
 *           type: string
 *           description: Overall reviewer comments
 *           maxLength: 3000
 *           example: Consistently delivers high-quality work
 *         goals:
 *           type: array
 *           description: Goal-wise ratings and comments
 *           items:
 *             type: object
 *             properties:
 *               goalId:
 *                 type: string
 *                 description: MongoDB ObjectId of the goal
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 example: 60d5f484f1a2c8b1f8e4e1e1
 *               rating:
 *                 type: number
 *                 description: Rating for this goal (1-5)
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comments:
 *                 type: string
 *                 description: Comments for this goal
 *                 maxLength: 1000
 *                 example: Goal achieved ahead of schedule
 *
 *     PerformanceAppraisal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         reviewPeriod:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         rating:
 *           type: number
 *         reviewerId:
 *           type: object
 *         reviewDate:
 *           type: string
 *           format: date
 *         strengths:
 *           type: string
 *         areasOfImprovement:
 *           type: string
 *         overallComments:
 *           type: string
 *         status:
 *           type: string
 *         goals:
 *           type: array
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     SubmitFeedbackRequest:
 *       type: object
 *       description: Payload for submitting performance feedback
 *       required:
 *         - employeeId
 *         - rating
 *         - comments
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the target employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         rating:
 *           type: number
 *           description: Rating score (1-5)
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         comments:
 *           type: string
 *           description: Feedback comments
 *           maxLength: 2000
 *           example: Great work on the recent project deliverables
 *         category:
 *           type: string
 *           description: Relationship category of the feedback giver
 *           enum: [PEER, MANAGER, SUBORDINATE, SELF]
 *           default: PEER
 *           example: MANAGER
 *         isAnonymous:
 *           type: boolean
 *           description: Whether the feedback is anonymous
 *           default: false
 *           example: false
 *
 *     PerformanceFeedback:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         fromEmployeeId:
 *           type: object
 *         category:
 *           type: string
 *         rating:
 *           type: number
 *         comments:
 *           type: string
 *         submittedAt:
 *           type: string
 *           format: date-time
 *         isAnonymous:
 *           type: boolean
 *
 *     TrainingCourse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         provider:
 *           type: string
 *         duration:
 *           type: string
 *         mode:
 *           type: string
 *         category:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         isMandatory:
 *           type: boolean
 *         maxParticipants:
 *           type: integer
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     EnrollCourseRequest:
 *       type: object
 *       description: Payload for enrolling an employee in a training course
 *       required:
 *         - courseId
 *         - employeeId
 *       properties:
 *         courseId:
 *           type: string
 *           description: MongoDB ObjectId of the training course
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1e1
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *
 *     CompleteCourseRequest:
 *       type: object
 *       description: Payload for marking a course enrollment as complete
 *       properties:
 *         score:
 *           type: number
 *           description: Score achieved (if applicable)
 *           minimum: 0
 *           example: 92
 *         feedback:
 *           type: string
 *           description: Course feedback
 *           maxLength: 2000
 *           example: Excellent course, well-structured content
 *
 *     TrainingEnrollment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         courseId:
 *           type: object
 *         employeeId:
 *           type: string
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *         completionDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *         score:
 *           type: number
 *         feedback:
 *           type: string
 *
 *     TrainingCertification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         courseId:
 *           type: object
 *         name:
 *           type: string
 *         issuedBy:
 *           type: string
 *         issueDate:
 *           type: string
 *           format: date
 *         expiryDate:
 *           type: string
 *           format: date
 *         certificateUrl:
 *           type: string
 *         credentialId:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *
 *     CreateTransferRequest:
 *       type: object
 *       description: Payload for requesting an employee transfer
 *       required:
 *         - employeeId
 *         - reason
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         toDepartmentId:
 *           type: string
 *           description: MongoDB ObjectId of target department
 *           example: 60d5f484f1a2c8b1f8e4e1b2
 *         toDesignationId:
 *           type: string
 *           description: MongoDB ObjectId of target designation
 *           example: 60d5f484f1a2c8b1f8e4e1c2
 *         toBranchId:
 *           type: string
 *           description: MongoDB ObjectId of target branch
 *           example: 60d5f484f1a2c8b1f8e4e1d2
 *         reason:
 *           type: string
 *           description: Reason for the transfer request
 *           maxLength: 2000
 *           example: Moving to Bangalore office
 *         effectiveDate:
 *           type: string
 *           format: date
 *           description: Proposed effective date (ISO 8601)
 *           example: '2024-05-01'
 *
 *     ApproveRejectTransferRequest:
 *       type: object
 *       description: Request body for approving or rejecting a transfer request
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           description: Decision status
 *           enum: [APPROVED, REJECTED]
 *           example: APPROVED
 *         comments:
 *           type: string
 *           description: Reviewer comments
 *           maxLength: 2000
 *           example: Transfer approved — role change effective from May 1
 *
 *     TransferRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         fromDepartmentId:
 *           type: object
 *         toDepartmentId:
 *           type: object
 *         fromDesignationId:
 *           type: object
 *         toDesignationId:
 *           type: object
 *         fromBranchId:
 *           type: object
 *         toBranchId:
 *           type: object
 *         reason:
 *           type: string
 *         effectiveDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         requestedBy:
 *           type: object
 *         approvedBy:
 *           type: object
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         comments:
 *           type: string
 *
 *     CreatePromotionRequest:
 *       type: object
 *       description: Payload for recording an employee promotion
 *       required:
 *         - employeeId
 *         - toDesignationId
 *         - effectiveDate
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         toDesignationId:
 *           type: string
 *           description: MongoDB ObjectId of the new designation
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1c2
 *         toDepartmentId:
 *           type: string
 *           description: MongoDB ObjectId of the new department (if changed)
 *           example: 60d5f484f1a2c8b1f8e4e1b2
 *         toSalary:
 *           type: number
 *           description: New salary after promotion
 *           minimum: 0
 *           example: 75000
 *         effectiveDate:
 *           type: string
 *           format: date
 *           description: Promotion effective date (ISO 8601)
 *           example: '2024-06-01'
 *         reason:
 *           type: string
 *           description: Reason for promotion
 *           maxLength: 2000
 *           example: Consistent exceptional performance over the last year
 *
 *     Promotion:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         fromDesignationId:
 *           type: object
 *         toDesignationId:
 *           type: object
 *         fromDepartmentId:
 *           type: object
 *         toDepartmentId:
 *           type: object
 *         fromSalary:
 *           type: number
 *         toSalary:
 *           type: number
 *         effectiveDate:
 *           type: string
 *           format: date
 *         reason:
 *           type: string
 *         approvedBy:
 *           type: object
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *         createdBy:
 *           type: object
 *
 *     ResignRequest:
 *       type: object
 *       required:
 *         - resignationDate
 *         - lastWorkingDay
 *         - reason
 *       properties:
 *         resignationDate:
 *           type: string
 *           format: date
 *           description: Date the resignation is submitted (ISO 8601)
 *           example: '2024-06-15'
 *         lastWorkingDay:
 *           type: string
 *           format: date
 *           description: Last working day of the employee (ISO 8601)
 *           example: '2024-07-15'
 *         reason:
 *           type: string
 *           description: Reason for resignation
 *           maxLength: 2000
 *           example: Accepted an offer from another company
 *         remarks:
 *           type: string
 *           description: Additional remarks
 *           maxLength: 2000
 *           example: Will help with knowledge transfer during notice period
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee (auto-filled from authenticated user)
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *
 *     ExitResignation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         resignationDate:
 *           type: string
 *           format: date
 *         lastWorkingDay:
 *           type: string
 *           format: date
 *         reason:
 *           type: string
 *         remarks:
 *           type: string
 *         status:
 *           type: string
 *         approvedBy:
 *           type: object
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         rejectionReason:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     ExitChecklist:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         resignationId:
 *           type: string
 *         tasks:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               isCompleted:
 *                 type: boolean
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *               comments:
 *                 type: string
 *         status:
 *           type: string
 *
 *     UpdateClearanceRequest:
 *       type: object
 *       description: Payload for updating a department clearance status
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           description: Clearance decision
 *           enum: [CLEARED, NOT_CLEARED]
 *           example: CLEARED
 *         comments:
 *           type: string
 *           description: Department clearance comments
 *           maxLength: 1000
 *           example: All assets returned, no dues pending
 *
 *     ExitClearance:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         departmentId:
 *           type: object
 *         clearanceBy:
 *           type: object
 *         clearedAt:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *         comments:
 *           type: string
 *
 *     ExitSettlement:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: string
 *         resignationId:
 *           type: string
 *         noticePeriodDays:
 *           type: number
 *         noticePeriodAmount:
 *           type: number
 *         unpaidLeaves:
 *           type: number
 *         unpaidLeaveDeduction:
 *           type: number
 *         pendingReimbursements:
 *           type: number
 *         bonusAmount:
 *           type: number
 *         otherEarnings:
 *           type: number
 *         otherDeductions:
 *           type: number
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *         approvedBy:
 *           type: object
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         paidAt:
 *           type: string
 *           format: date-time
 *         remarks:
 *           type: string
 *
 *     RequestLetterRequest:
 *       type: object
 *       description: Payload for requesting an official letter
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           description: Type of letter requested
 *           enum: [EXPERIENCE, SALARY, OFFER, RELIEVING, OTHER]
 *           example: EXPERIENCE
 *         content:
 *           type: string
 *           description: Custom content or instructions for the letter
 *           maxLength: 5000
 *           example: Please include details of my tenure from Jan 2020 to Jun 2024
 *         notes:
 *           type: string
 *           description: Additional notes for the HR team
 *           maxLength: 1000
 *           example: Urgent — needed for visa application
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee (auto-filled from authenticated user)
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *
 *     CreateEmployeeRequest:
 *       type: object
 *       description: Payload for creating a new employee
 *       required:
 *         - firstName
 *         - email
 *       properties:
 *         firstName:
 *           type: string
 *           description: Employee's first name
 *           maxLength: 100
 *           example: Jane
 *         lastName:
 *           type: string
 *           description: Employee's last name
 *           maxLength: 100
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Official email address
 *           maxLength: 200
 *           example: jane.doe@company.com
 *         personalEmail:
 *           type: string
 *           format: email
 *           description: Personal email address
 *           maxLength: 200
 *           example: jane@gmail.com
 *         employeeCode:
 *           type: string
 *           description: Unique employee identifier code
 *           maxLength: 50
 *           example: EMP-003
 *         phone:
 *           type: string
 *           description: Primary contact number
 *           maxLength: 20
 *           example: '+1-555-0100'
 *         alternatePhone:
 *           type: string
 *           description: Alternate contact number
 *           maxLength: 20
 *           example: '+1-555-0101'
 *         gender:
 *           type: string
 *           description: Employee gender
 *           enum: [MALE, FEMALE, OTHER]
 *           example: FEMALE
 *         dob:
 *           type: string
 *           format: date
 *           description: Date of birth (ISO 8601)
 *           example: '1990-05-15'
 *         bloodGroup:
 *           type: string
 *           description: Blood group
 *           maxLength: 10
 *           example: O+
 *         maritalStatus:
 *           type: string
 *           description: Marital status
 *           maxLength: 20
 *           example: Married
 *         avatar:
 *           type: string
 *           format: uri
 *           description: URL to avatar image
 *           example: https://company.com/avatars/jane.jpg
 *         employmentType:
 *           type: string
 *           description: Type of employment
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERN]
 *           default: FULL_TIME
 *           example: FULL_TIME
 *         joiningDate:
 *           type: string
 *           format: date
 *           description: Joining date (ISO 8601)
 *           example: '2024-01-15'
 *         dateOfJoining:
 *           type: string
 *           format: date
 *           description: Date of joining (alternative field)
 *           example: '2024-01-15'
 *         confirmationDate:
 *           type: string
 *           format: date
 *           description: Probation confirmation date (ISO 8601)
 *           example: '2024-07-15'
 *         departmentId:
 *           type: string
 *           description: MongoDB ObjectId of the department
 *           example: 60d5f484f1a2c8b1f8e4e1b1
 *         designationId:
 *           type: string
 *           description: MongoDB ObjectId of the designation
 *           example: 60d5f484f1a2c8b1f8e4e1c1
 *         branchId:
 *           type: string
 *           description: MongoDB ObjectId of the branch
 *           example: 60d5f484f1a2c8b1f8e4e1d1
 *         reportingManagerId:
 *           type: string
 *           description: MongoDB ObjectId of the reporting manager
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         managerId:
 *           type: string
 *           description: MongoDB ObjectId of manager (alternative field)
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         address:
 *           type: object
 *           description: Residential address
 *           properties:
 *             street:
 *               type: string
 *               example: 123 Main St
 *             city:
 *               type: string
 *               example: New York
 *             state:
 *               type: string
 *               example: NY
 *             country:
 *               type: string
 *               example: USA
 *             zip:
 *               type: string
 *               example: '10001'
 *         city:
 *           type: string
 *           description: City name
 *           maxLength: 100
 *           example: New York
 *         state:
 *           type: string
 *           description: State name
 *           maxLength: 100
 *           example: NY
 *         country:
 *           type: string
 *           description: Country name
 *           maxLength: 100
 *           example: USA
 *         zipCode:
 *           type: string
 *           description: ZIP / postal code
 *           maxLength: 20
 *           example: '10001'
 *         designation:
 *           type: string
 *           description: Designation title (free text fallback when designationId not used)
 *           maxLength: 200
 *           example: Software Engineer
 *         emergencyContact:
 *           type: object
 *           description: Emergency contact details
 *           properties:
 *             name:
 *               type: string
 *               example: John Doe
 *             relation:
 *               type: string
 *               example: Spouse
 *             phone:
 *               type: string
 *               example: '+1-555-0200'
 *         bankDetails:
 *           type: object
 *           description: Bank account details for salary disbursement
 *           properties:
 *             accountNumber:
 *               type: string
 *               example: '1234567890'
 *             ifscCode:
 *               type: string
 *               example: HDFC0001234
 *             bankName:
 *               type: string
 *               example: HDFC Bank
 *             accountType:
 *               type: string
 *               example: Savings
 *         panNumber:
 *           type: string
 *           description: Permanent Account Number (tax ID)
 *           maxLength: 20
 *           example: ABCDE1234F
 *         aadharNumber:
 *           type: string
 *           description: Aadhaar number
 *           maxLength: 20
 *           example: '123412341234'
 *         status:
 *           type: string
 *           description: Employee status
 *           enum: [ACTIVE, INACTIVE, TERMINATED]
 *           example: ACTIVE
 *
 *     UpdateEmployeeRequest:
 *       type: object
 *       description: Partial update fields for an existing employee. At least one field must be provided.
 *       properties:
 *         firstName:
 *           type: string
 *           description: Employee's first name
 *           maxLength: 100
 *           example: Jane
 *         lastName:
 *           type: string
 *           description: Employee's last name
 *           maxLength: 100
 *           example: Smith
 *         email:
 *           type: string
 *           format: email
 *           description: Official email address
 *           maxLength: 200
 *           example: jane.smith@company.com
 *         personalEmail:
 *           type: string
 *           format: email
 *           description: Personal email address
 *           maxLength: 200
 *           example: jane@gmail.com
 *         phone:
 *           type: string
 *           description: Primary contact number
 *           maxLength: 20
 *           example: '+1-555-0100'
 *         alternatePhone:
 *           type: string
 *           description: Alternate contact number
 *           maxLength: 20
 *           example: '+1-555-0101'
 *         employeeCode:
 *           type: string
 *           description: Unique employee identifier code
 *           maxLength: 50
 *           example: EMP-002
 *         dob:
 *           type: string
 *           format: date
 *           description: Date of birth (ISO 8601)
 *           example: '1990-05-15'
 *         gender:
 *           type: string
 *           description: Employee gender
 *           enum: [MALE, FEMALE, OTHER]
 *           example: FEMALE
 *         bloodGroup:
 *           type: string
 *           description: Blood group
 *           maxLength: 10
 *           example: O+
 *         maritalStatus:
 *           type: string
 *           description: Marital status
 *           maxLength: 20
 *           example: Married
 *         avatar:
 *           type: string
 *           format: uri
 *           description: URL to avatar image
 *           example: https://company.com/avatars/jane.jpg
 *         employmentType:
 *           type: string
 *           description: Type of employment
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERN]
 *           example: FULL_TIME
 *         status:
 *           type: string
 *           description: Current employment status
 *           enum: [ACTIVE, INACTIVE, TERMINATED]
 *           example: ACTIVE
 *         joiningDate:
 *           type: string
 *           format: date
 *           description: Original joining date
 *           example: '2023-01-15'
 *         confirmationDate:
 *           type: string
 *           format: date
 *           description: Date of confirmation after probation
 *           example: '2023-07-15'
 *         exitDate:
 *           type: string
 *           format: date
 *           description: Date of exit / termination
 *           example: '2024-06-30'
 *         exitReason:
 *           type: string
 *           description: Reason for exit / termination
 *           maxLength: 1000
 *           example: Resigned for career growth
 *         departmentId:
 *           type: string
 *           description: MongoDB ObjectId of the department
 *           example: 60d5f484f1a2c8b1f8e4e1b1
 *         designationId:
 *           type: string
 *           description: MongoDB ObjectId of the designation
 *           example: 60d5f484f1a2c8b1f8e4e1c1
 *         branchId:
 *           type: string
 *           description: MongoDB ObjectId of the branch
 *           example: 60d5f484f1a2c8b1f8e4e1d1
 *         reportingManagerId:
 *           type: string
 *           description: MongoDB ObjectId of the reporting manager
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         address:
 *           type: object
 *           description: Residential address
 *           properties:
 *             street:
 *               type: string
 *               example: 456 Oak St
 *             city:
 *               type: string
 *               example: New York
 *             state:
 *               type: string
 *               example: NY
 *             country:
 *               type: string
 *               example: USA
 *             zip:
 *               type: string
 *               example: '10001'
 *         city:
 *           type: string
 *           description: City name
 *           maxLength: 100
 *           example: New York
 *         state:
 *           type: string
 *           description: State name
 *           maxLength: 100
 *           example: NY
 *         country:
 *           type: string
 *           description: Country name
 *           maxLength: 100
 *           example: USA
 *         emergencyContact:
 *           type: object
 *           description: Emergency contact details
 *           properties:
 *             name:
 *               type: string
 *               example: John Smith
 *             relation:
 *               type: string
 *               example: Spouse
 *             phone:
 *               type: string
 *               example: '+1-555-0200'
 *         bankDetails:
 *           type: object
 *           description: Bank account details for salary disbursement
 *           properties:
 *             accountNumber:
 *               type: string
 *               example: '1234567890'
 *             ifscCode:
 *               type: string
 *               example: HDFC0001234
 *             bankName:
 *               type: string
 *               example: HDFC Bank
 *             accountType:
 *               type: string
 *               example: Savings
 *         panNumber:
 *           type: string
 *           description: Permanent Account Number (tax ID)
 *           maxLength: 20
 *           example: ABCDE1234F
 *         aadharNumber:
 *           type: string
 *           description: Aadhaar number
 *           maxLength: 20
 *           example: '123412341234'
 *         managerId:
 *           type: string
 *           description: MongoDB ObjectId of manager
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         designation:
 *           type: string
 *           description: Designation title (free text fallback)
 *           maxLength: 200
 *           example: Senior Developer
 *
 *     CreateDepartmentRequest:
 *       type: object
 *       description: Payload for creating a new department
 *       required:
 *         - name
 *         - code
 *       properties:
 *         name:
 *           type: string
 *           description: Department name
 *           maxLength: 200
 *           example: Engineering
 *         code:
 *           type: string
 *           description: Unique department code
 *           maxLength: 50
 *           example: ENG
 *         description:
 *           type: string
 *           description: Description of the department
 *           maxLength: 1000
 *           example: Software Engineering & Development
 *         parentId:
 *           type: string
 *           description: MongoDB ObjectId of parent department
 *           example: 60d5f484f1a2c8b1f8e4e1b1
 *         headId:
 *           type: string
 *           description: MongoDB ObjectId of department head (employee)
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         branchId:
 *           type: string
 *           description: MongoDB ObjectId of branch
 *           example: 60d5f484f1a2c8b1f8e4e1d1
 *
 *     UpdateDepartmentRequest:
 *       type: object
 *       description: Partial update for an existing department
 *       properties:
 *         name:
 *           type: string
 *           description: Department name
 *           maxLength: 200
 *           example: Engineering
 *         code:
 *           type: string
 *           description: Unique department code
 *           maxLength: 50
 *           example: ENG
 *         description:
 *           type: string
 *           description: Description of the department
 *           maxLength: 1000
 *           example: Software Engineering & Development
 *         parentId:
 *           type: string
 *           description: MongoDB ObjectId of parent department
 *           example: 60d5f484f1a2c8b1f8e4e1b1
 *         headId:
 *           type: string
 *           description: MongoDB ObjectId of department head
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         branchId:
 *           type: string
 *           description: MongoDB ObjectId of branch
 *           example: 60d5f484f1a2c8b1f8e4e1d1
 *         isActive:
 *           type: boolean
 *           description: Whether the department is active
 *           example: true
 *
 *     CreateDesignationRequest:
 *       type: object
 *       description: Payload for creating a new designation
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Designation title
 *           maxLength: 200
 *           example: Senior Software Engineer
 *         level:
 *           type: integer
 *           description: Hierarchical level (lower = junior)
 *           minimum: 0
 *           example: 3
 *         description:
 *           type: string
 *           description: Description of the designation
 *           maxLength: 1000
 *           example: Senior-level engineering role
 *
 *     UpdateDesignationRequest:
 *       type: object
 *       description: Partial update for an existing designation
 *       properties:
 *         name:
 *           type: string
 *           description: Designation title
 *           maxLength: 200
 *           example: Lead Software Engineer
 *         level:
 *           type: integer
 *           description: Hierarchical level
 *           minimum: 0
 *           example: 4
 *         description:
 *           type: string
 *           description: Description of the designation
 *           maxLength: 1000
 *           example: Lead-level engineering role
 *         isActive:
 *           type: boolean
 *           description: Whether the designation is active
 *           example: true
 *
 *     CreateAttendanceRequest:
 *       type: object
 *       description: Payload for creating an attendance record
 *       required:
 *         - employeeId
 *         - date
 *         - status
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         date:
 *           type: string
 *           format: date
 *           description: Attendance date (ISO 8601)
 *           example: '2024-03-15'
 *         checkIn:
 *           type: string
 *           format: date-time
 *           description: Check-in timestamp
 *           example: '2024-03-15T09:00:00.000Z'
 *         checkOut:
 *           type: string
 *           format: date-time
 *           description: Check-out timestamp
 *           example: '2024-03-15T18:00:00.000Z'
 *         status:
 *           type: string
 *           description: Attendance status
 *           enum: [PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE]
 *           example: PRESENT
 *         source:
 *           type: string
 *           description: Source of attendance entry
 *           enum: [APP, MANUAL, BIOMETRIC]
 *           default: MANUAL
 *           example: MANUAL
 *         notes:
 *           type: string
 *           description: Additional notes
 *           maxLength: 1000
 *           example: On-site work at client office
 *
 *     UpdateAttendanceRequest:
 *       type: object
 *       description: Partial update for an attendance record
 *       properties:
 *         checkIn:
 *           type: string
 *           format: date-time
 *           description: Check-in timestamp
 *           example: '2024-03-15T09:15:00.000Z'
 *         checkOut:
 *           type: string
 *           format: date-time
 *           description: Check-out timestamp
 *           example: '2024-03-15T17:45:00.000Z'
 *         status:
 *           type: string
 *           description: Attendance status
 *           enum: [PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE]
 *           example: PRESENT
 *         source:
 *           type: string
 *           description: Source of attendance entry
 *           enum: [APP, MANUAL, BIOMETRIC]
 *           example: BIOMETRIC
 *         notes:
 *           type: string
 *           description: Additional notes
 *           maxLength: 1000
 *           example: Updated check-in time
 *
 *     BulkAttendanceRequest:
 *       type: object
 *       description: Payload for bulk creating attendance records
 *       required:
 *         - date
 *         - entries
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Common attendance date for all entries (ISO 8601)
 *           example: '2024-03-15'
 *         entries:
 *           type: array
 *           description: Array of attendance entries
 *           minItems: 1
 *           items:
 *             type: object
 *             required:
 *               - employeeId
 *               - status
 *             properties:
 *               employeeId:
 *                 type: string
 *                 description: MongoDB ObjectId of the employee
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 example: 60d5f484f1a2c8b1f8e4e1a1
 *               status:
 *                 type: string
 *                 description: Attendance status
 *                 enum: [PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE]
 *                 example: PRESENT
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *                 description: Check-in timestamp
 *                 example: '2024-03-15T09:00:00.000Z'
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *                 description: Check-out timestamp
 *                 example: '2024-03-15T18:00:00.000Z'
 *
 *     CreateLeaveTypeRequest:
 *       type: object
 *       description: Payload for creating a new leave type
 *       required:
 *         - name
 *         - code
 *       properties:
 *         name:
 *           type: string
 *           description: Leave type name
 *           maxLength: 200
 *           example: Annual Leave
 *         code:
 *           type: string
 *           description: Unique leave type code
 *           maxLength: 50
 *           example: ANNUAL
 *         annualAllowance:
 *           type: integer
 *           description: Number of days allowed per year
 *           minimum: 0
 *           default: 0
 *           example: 20
 *         carryForward:
 *           type: boolean
 *           description: Whether unused days carry forward to next year
 *           default: false
 *           example: true
 *         maxCarryForward:
 *           type: integer
 *           description: Maximum days that can be carried forward
 *           minimum: 0
 *           nullable: true
 *           example: 10
 *         isPaid:
 *           type: boolean
 *           description: Whether the leave is paid
 *           default: true
 *           example: true
 *         requiresApproval:
 *           type: boolean
 *           description: Whether leave requires manager approval
 *           default: true
 *           example: true
 *         description:
 *           type: string
 *           description: Description of the leave type
 *           maxLength: 1000
 *           example: Annual vacation leave
 *
 *     UpdateLeaveTypeRequest:
 *       type: object
 *       description: Partial update for an existing leave type
 *       properties:
 *         name:
 *           type: string
 *           description: Leave type name
 *           maxLength: 200
 *           example: Annual Leave
 *         code:
 *           type: string
 *           description: Unique leave type code
 *           maxLength: 50
 *           example: ANNUAL
 *         annualAllowance:
 *           type: integer
 *           description: Number of days allowed per year
 *           minimum: 0
 *           example: 18
 *         carryForward:
 *           type: boolean
 *           description: Whether unused days carry forward
 *           example: true
 *         maxCarryForward:
 *           type: integer
 *           description: Maximum days that can be carried forward
 *           minimum: 0
 *           nullable: true
 *           example: 5
 *         isPaid:
 *           type: boolean
 *           description: Whether the leave is paid
 *           example: true
 *         requiresApproval:
 *           type: boolean
 *           description: Whether leave requires approval
 *           example: true
 *         description:
 *           type: string
 *           description: Description of the leave type
 *           maxLength: 1000
 *           example: Updated annual leave policy
 *         isActive:
 *           type: boolean
 *           description: Whether the leave type is active
 *           example: true
 *
 *     CreateLeaveRequestRequest:
 *       type: object
 *       description: Payload for submitting a leave request
 *       required:
 *         - leaveTypeId
 *         - fromDate
 *         - toDate
 *       properties:
 *         leaveTypeId:
 *           type: string
 *           description: MongoDB ObjectId of the leave type
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1c1
 *         fromDate:
 *           type: string
 *           format: date
 *           description: Start date of leave (ISO 8601)
 *           example: '2024-04-01'
 *         toDate:
 *           type: string
 *           format: date
 *           description: End date of leave (ISO 8601)
 *           example: '2024-04-05'
 *         reason:
 *           type: string
 *           description: Reason for leave
 *           maxLength: 2000
 *           example: Family vacation
 *         attachments:
 *           type: array
 *           description: URLs of supporting documents
 *           items:
 *             type: string
 *             format: uri
 *           default: []
 *           example:
 *             - https://company.com/uploads/leave-doc1.pdf
 *
 *     ApproveRejectLeaveRequest:
 *       type: object
 *       description: Comments for approving or rejecting a leave request
 *       properties:
 *         comments:
 *           type: string
 *           description: Manager comments (reason for approval / rejection)
 *           maxLength: 2000
 *           example: Approved — leave balance sufficient
 *
 *     CreateHolidayRequest:
 *       type: object
 *       description: Payload for creating a new holiday
 *       required:
 *         - name
 *         - date
 *       properties:
 *         name:
 *           type: string
 *           description: Holiday name
 *           maxLength: 200
 *           example: Independence Day
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the holiday (ISO 8601)
 *           example: '2024-08-15'
 *         type:
 *           type: string
 *           description: Type of holiday
 *           enum: [PUBLIC, RESTRICTED, OPTIONAL]
 *           default: PUBLIC
 *           example: PUBLIC
 *         isOptional:
 *           type: boolean
 *           description: Whether the holiday is optional
 *           default: false
 *           example: false
 *         branchId:
 *           type: string
 *           description: MongoDB ObjectId of branch (null = company-wide)
 *           example: 60d5f484f1a2c8b1f8e4e1d1
 *
 *     UpdateHolidayRequest:
 *       type: object
 *       description: Partial update for an existing holiday
 *       properties:
 *         name:
 *           type: string
 *           description: Holiday name
 *           maxLength: 200
 *           example: Republic Day
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the holiday (ISO 8601)
 *           example: '2024-01-26'
 *         type:
 *           type: string
 *           description: Type of holiday
 *           enum: [PUBLIC, RESTRICTED, OPTIONAL]
 *           example: PUBLIC
 *         isOptional:
 *           type: boolean
 *           description: Whether the holiday is optional
 *           example: false
 *         branchId:
 *           type: string
 *           description: MongoDB ObjectId of branch
 *           example: 60d5f484f1a2c8b1f8e4e1d1
 *
 *     RunPayrollRequest:
 *       type: object
 *       description: Payload for running payroll for a specific month and year
 *       required:
 *         - month
 *         - year
 *       properties:
 *         month:
 *           type: integer
 *           description: Month number (1=January, 12=December)
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         year:
 *           type: integer
 *           description: Year
 *           minimum: 1900
 *           maximum: 2100
 *           example: 2024
 *
 *     CreateSalaryStructureRequest:
 *       type: object
 *       description: Payload for creating a new salary structure for an employee
 *       required:
 *         - employeeId
 *         - effectiveFrom
 *         - basicSalary
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         effectiveFrom:
 *           type: string
 *           format: date
 *           description: Date from which this structure is effective (ISO 8601)
 *           example: '2024-04-01'
 *         basicSalary:
 *           type: number
 *           description: Basic salary amount
 *           minimum: 0
 *           example: 50000
 *         hra:
 *           type: number
 *           description: House Rent Allowance
 *           minimum: 0
 *           default: 0
 *           example: 20000
 *         ta:
 *           type: number
 *           description: Travel Allowance
 *           minimum: 0
 *           default: 0
 *           example: 5000
 *         da:
 *           type: number
 *           description: Dearness Allowance
 *           minimum: 0
 *           default: 0
 *           example: 3000
 *         pf:
 *           type: number
 *           description: Provident Fund contribution
 *           minimum: 0
 *           default: 0
 *           example: 6000
 *         esi:
 *           type: number
 *           description: Employee State Insurance contribution
 *           minimum: 0
 *           default: 0
 *           example: 2000
 *         otherAllowances:
 *           type: array
 *           description: List of additional allowances
 *           default: []
 *           items:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 description: Allowance name
 *                 example: Bonus
 *               amount:
 *                 type: number
 *                 description: Allowance amount
 *                 minimum: 0
 *                 example: 10000
 *         deductions:
 *           type: array
 *           description: List of deductions
 *           default: []
 *           items:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 description: Deduction name
 *                 example: Income Tax
 *               amount:
 *                 type: number
 *                 description: Deduction amount
 *                 minimum: 0
 *                 example: 5000
 *
 *     UpdateSalaryStructureRequest:
 *       type: object
 *       description: Partial update for an existing salary structure
 *       properties:
 *         effectiveFrom:
 *           type: string
 *           format: date
 *           description: Date from which this structure is effective (ISO 8601)
 *           example: '2024-05-01'
 *         basicSalary:
 *           type: number
 *           description: Basic salary amount
 *           minimum: 0
 *           example: 55000
 *         hra:
 *           type: number
 *           description: House Rent Allowance
 *           minimum: 0
 *           example: 22000
 *         ta:
 *           type: number
 *           description: Travel Allowance
 *           minimum: 0
 *           example: 5000
 *         da:
 *           type: number
 *           description: Dearness Allowance
 *           minimum: 0
 *           example: 3500
 *         pf:
 *           type: number
 *           description: Provident Fund contribution
 *           minimum: 0
 *           example: 6600
 *         esi:
 *           type: number
 *           description: Employee State Insurance contribution
 *           minimum: 0
 *           example: 2200
 *         otherAllowances:
 *           type: array
 *           description: List of additional allowances
 *           items:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 description: Allowance name
 *                 example: Performance Bonus
 *               amount:
 *                 type: number
 *                 description: Allowance amount
 *                 minimum: 0
 *                 example: 15000
 *         deductions:
 *           type: array
 *           description: List of deductions
 *           items:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 description: Deduction name
 *                 example: Professional Tax
 *               amount:
 *                 type: number
 *                 description: Deduction amount
 *                 minimum: 0
 *                 example: 2000
 *
 *     CreateAssetRequest:
 *       type: object
 *       description: Payload for creating a new asset
 *       required:
 *         - name
 *         - code
 *       properties:
 *         name:
 *           type: string
 *           description: Asset name
 *           maxLength: 200
 *           example: MacBook Pro 16
 *         code:
 *           type: string
 *           description: Unique asset code
 *           maxLength: 50
 *           example: AST-MBP-001
 *         category:
 *           type: string
 *           description: Asset category
 *           maxLength: 100
 *           example: Laptop
 *         brand:
 *           type: string
 *           description: Asset brand
 *           maxLength: 100
 *           example: Apple
 *         model:
 *           type: string
 *           description: Asset model
 *           maxLength: 100
 *           example: MacBook Pro 16 M3
 *         serialNumber:
 *           type: string
 *           description: Serial number
 *           maxLength: 100
 *           example: FGHJK12345
 *         purchaseDate:
 *           type: string
 *           format: date
 *           description: Date of purchase (ISO 8601)
 *           example: '2024-01-15'
 *         purchaseValue:
 *           type: number
 *           description: Purchase value / cost
 *           minimum: 0
 *           example: 2499.99
 *         location:
 *           type: string
 *           description: Physical location of the asset
 *           maxLength: 200
 *           example: Bangalore Office, Floor 3
 *         description:
 *           type: string
 *           description: Additional description
 *           maxLength: 1000
 *           example: Company-issued development laptop
 *
 *     UpdateAssetRequest:
 *       type: object
 *       description: Partial update for an existing asset
 *       properties:
 *         name:
 *           type: string
 *           description: Asset name
 *           maxLength: 200
 *           example: MacBook Pro 16
 *         code:
 *           type: string
 *           description: Unique asset code
 *           maxLength: 50
 *           example: AST-MBP-001
 *         category:
 *           type: string
 *           description: Asset category
 *           maxLength: 100
 *           example: Laptop
 *         brand:
 *           type: string
 *           description: Asset brand
 *           maxLength: 100
 *           example: Apple
 *         model:
 *           type: string
 *           description: Asset model
 *           maxLength: 100
 *           example: MacBook Pro 16 M3
 *         serialNumber:
 *           type: string
 *           description: Serial number
 *           maxLength: 100
 *           example: FGHJK12345
 *         purchaseDate:
 *           type: string
 *           format: date
 *           description: Date of purchase (ISO 8601)
 *           example: '2024-01-15'
 *         purchaseValue:
 *           type: number
 *           description: Purchase value / cost
 *           minimum: 0
 *           example: 2499.99
 *         status:
 *           type: string
 *           description: Asset status
 *           enum: [AVAILABLE, ASSIGNED, MAINTENANCE, RETIRED]
 *           example: AVAILABLE
 *         location:
 *           type: string
 *           description: Physical location of the asset
 *           maxLength: 200
 *           example: Bangalore Office, Floor 3
 *         description:
 *           type: string
 *           description: Additional description
 *           maxLength: 1000
 *           example: Updated asset details
 *
 *     AssignAssetRequest:
 *       type: object
 *       description: Payload for assigning an asset to an employee
 *       required:
 *         - employeeId
 *       properties:
 *         employeeId:
 *           type: string
 *           description: MongoDB ObjectId of the employee
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 60d5f484f1a2c8b1f8e4e1a1
 *         condition:
 *           type: string
 *           description: Condition of the asset at time of assignment
 *           maxLength: 500
 *           example: Good — minor scratches
 *         notes:
 *           type: string
 *           description: Assignment notes
 *           maxLength: 1000
 *           example: Assigned for development work
 *
 *     ReturnAssetRequest:
 *       type: object
 *       description: Payload for returning an asset from an employee
 *       properties:
 *         condition:
 *           type: string
 *           description: Condition of the asset upon return
 *           maxLength: 500
 *           example: Good — normal wear and tear
 *         notes:
 *           type: string
 *           description: Return notes
 *           maxLength: 1000
 *           example: Employee resigned, asset returned
 *
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         employeeCode:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         gender:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         employmentType:
 *           type: string
 *         status:
 *           type: string
 *         joiningDate:
 *           type: string
 *           format: date
 *         department:
 *           type: object
 *         designation:
 *           type: string
 *         manager:
 *           type: object
 *         dateOfJoining:
 *           type: string
 *
 *     Attendance:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: object
 *         date:
 *           type: string
 *           format: date
 *         checkIn:
 *           type: string
 *           format: date-time
 *         checkOut:
 *           type: string
 *           format: date-time
 *         workingHours:
 *           type: number
 *         status:
 *           type: string
 *         source:
 *           type: string
 *         notes:
 *           type: string
 *
 *     Payslip:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeeId:
 *           type: object
 *         payrollId:
 *           type: object
 *         basicSalary:
 *           type: number
 *         hra:
 *           type: number
 *         ta:
 *           type: number
 *         da:
 *           type: number
 *         pf:
 *           type: number
 *         esi:
 *           type: number
 *         tds:
 *           type: number
 *         grossSalary:
 *           type: number
 *         netSalary:
 *           type: number
 *         status:
 *           type: string
 *         deductions:
 *           type: array
 *         otherAllowances:
 *           type: array
 *
 *     Payroll:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         companyId:
 *           type: string
 *         month:
 *           type: integer
 *         year:
 *           type: integer
 *         status:
 *           type: string
 *         totalEmployees:
 *           type: integer
 *         totalAmount:
 *           type: number
 *         processedBy:
 *           type: object
 *         processedAt:
 *           type: string
 *           format: date-time
 *
 *     ApiSuccess:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *         timestamp:
 *           type: string
 *         requestId:
 *           type: string
 *
 *     ApiError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         statusCode:
 *           type: integer
 *         error:
 *           type: string
 *         message:
 *           type: string
 *         path:
 *           type: string
 *         timestamp:
 *           type: string
 *         requestId:
 *           type: string
 *
 *   responses:
 *     BadRequest:
 *       description: Invalid input or bad request
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *     Unauthorized:
 *       description: Unauthorized — missing or invalid token
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *     Forbidden:
 *       description: Forbidden — insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *     Conflict:
 *       description: Resource already exists
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *     InternalError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 */
router.use(auth_1.authenticate);
// Dashboard
/**
 * @swagger
 * /hrms/dashboard:
 *   get:
 *     summary: List dashboard
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/dashboard', hrmsController.getDashboard);
// Employees
/**
 * @swagger
 * /hrms/employees:
 *   get:
 *     summary: List employees
 *     tags: [HRMS, Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword (matches name, email, employee code)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, TERMINATED]
 *         description: Filter by employee status
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department (MongoDB ObjectId)
 *       - in: query
 *         name: designationId
 *         schema:
 *           type: string
 *         description: Filter by designation (MongoDB ObjectId)
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERN]
 *         description: Filter by employment type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/employees', hrmsController.listEmployees);
/**
 * @swagger
 * /hrms/employees:
 *   post:
 *     summary: Create employees
 *     tags: [HRMS, Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *           example:
 *             firstName: Jane
 *             lastName: Doe
 *             email: jane.doe@company.com
 *             phone: '+1-555-0100'
 *             gender: FEMALE
 *             employmentType: FULL_TIME
 *             joiningDate: '2024-01-15'
 *             departmentId: 60d5f484f1a2c8b1f8e4e1b1
 *             designationId: 60d5f484f1a2c8b1f8e4e1c1
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/employees', (0, validate_1.validate)(hrms_validator_1.createEmployeeSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'employee'), hrmsController.createEmployee);
/**
 * @swagger
 * /hrms/employees/export:
 *   get:
 *     summary: List employees export
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, excel]
 *           default: csv
 *         description: Export format
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
/**
 * @swagger
 * /hrms/employees/{id}/activate:
 *   post:
 *     summary: Activate an inactive employee
 *     description: >
 *       Reactivates an employee by setting their status to ACTIVE
 *       and clearing the exitDate. Use this to reinstate terminated
 *       or inactive employees.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee to activate
 *     requestBody:
 *       required: false
 *       description: No request body required — the employee is activated by path ID alone
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: {}
 *           example: {}
 *     responses:
 *       200:
 *         description: Employee activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/employees/:id/activate', (0, rbac_1.checkPermission)('EMPLOYEES', 'UPDATE'), (0, auditLogger_1.default)('EMPLOYEES', 'UPDATE', 'Employee'), hrmsController.activateEmployee);
router.patch('/employees/:id/suspend', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, validate_1.validate)(hrms_validator_1.suspendEmployeeSchema), (0, auditLogger_1.default)('EMPLOYEES', 'SUSPEND', 'Employee'), hrmsController.suspendEmployee);
router.patch('/employees/:id/reinstate', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, validate_1.validate)(hrms_validator_1.reinstateEmployeeSchema), (0, auditLogger_1.default)('EMPLOYEES', 'REINSTATE', 'Employee'), hrmsController.reinstateEmployee);
router.get('/employees/export', hrmsController.exportEmployees);
/**
 * @swagger
 * /hrms/employees/bulk-import:
 *   post:
 *     summary: Create employees bulk import
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             description: Array of employee objects to import in bulk
 *             items:
 *               $ref: '#/components/schemas/CreateEmployeeRequest'
 *           example:
 *             - firstName: Jane
 *               lastName: Doe
 *               email: jane.doe@company.com
 *               phone: '+1-555-0100'
 *               gender: FEMALE
 *               employmentType: FULL_TIME
 *               departmentId: 60d5f484f1a2c8b1f8e4e1b1
 *             - firstName: John
 *               lastName: Smith
 *               email: john.smith@company.com
 *               phone: '+1-555-0101'
 *               gender: MALE
 *               employmentType: FULL_TIME
 *               departmentId: 60d5f484f1a2c8b1f8e4e1b1
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/employees/bulk-import', upload_1.csvUpload, upload_1.handleUploadError, hrmsController.bulkImportEmployees);
/**
 * @swagger
 * /hrms/employees/{id}:
 *   get:
 *     summary: Get employees by ID
 *     tags: [HRMS, Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/employees/:id', hrmsController.getEmployeeById);
/**
 * @swagger
 * /hrms/employees/{id}:
 *   patch:
 *     summary: Update employees
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployeeRequest'
 *           example:
 *             firstName: Jane
 *             lastName: Smith
 *             phone: '+1-555-0200'
 *             departmentId: 60d5f484f1a2c8b1f8e4e1b2
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/employees/:id', (0, validate_1.validate)(hrms_validator_1.updateEmployeeSchema), (0, auditLogger_1.default)('hrms', 'UPDATE', 'employee'), hrmsController.updateEmployee);
/**
 * @swagger
 * /hrms/employees/{id}:
 *   put:
 *     summary: Full update of an employee (replace entire record)
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *           example:
 *             firstName: Jane
 *             lastName: Doe
 *             email: jane.doe@company.com
 *             phone: '+1-555-0100'
 *             gender: FEMALE
 *             employmentType: FULL_TIME
 *             joiningDate: '2024-01-15'
 *             departmentId: 60d5f484f1a2c8b1f8e4e1b1
 *             designationId: 60d5f484f1a2c8b1f8e4e1c1
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Employee'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/employees/:id', (0, validate_1.validate)(hrms_validator_1.createEmployeeSchema), (0, auditLogger_1.default)('hrms', 'UPDATE', 'employee'), hrmsController.fullUpdateEmployee);
/**
 * @swagger
 * /hrms/employees/{id}:
 *   delete:
 *     summary: Delete employees
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
/**
 * @swagger
 * /hrms/employees/{id}/permanent:
 *   delete:
 *     summary: Permanently delete an employee
 *     description: >
 *       Irreversibly removes an employee and all associated records
 *       (attendance, leave, payslips, salary structure, asset assignments).
 *       Only allowed for INACTIVE or TERMINATED employees.
 *       This action cannot be undone.
 *     tags: [HRMS]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee to permanently delete
 *     responses:
 *       200:
 *         description: Employee permanently deleted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: Employee permanently deleted
 *                         employeeId:
 *                           type: string
 *                           example: 6a3f8126aa70fd8046916f9f
 *       400:
 *         description: Cannot delete active employee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/employees/:id/permanent', (0, rbac_1.checkPermission)('EMPLOYEES', 'DELETE'), (0, auditLogger_1.default)('EMPLOYEES', 'DELETE', 'Employee'), hrmsController.hardRemoveEmployee);
router.delete('/employees/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'employee'), hrmsController.removeEmployee);
// Employee Profile
/**
 * @swagger
 * /hrms/employees/{id}/profile:
 *   get:
 *     summary: Get employee personal / profile information
 *     description: Returns personal details such as DOB, gender, blood group, marital status, address, emergency contact, bank details, PAN, Aadhaar.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: Profile data returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/EmployeeProfile'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/employees/:id/profile', hrmsController.getEmployeeProfile);
/**
 * @swagger
 * /hrms/employees/{id}/profile:
 *   patch:
 *     summary: Update employee personal / profile information
 *     description: Update personal details such as DOB, gender, blood group, marital status, address, emergency contact, bank details, PAN, Aadhaar.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           example:
 *             personalEmail: jane.doe@gmail.com
 *             phone: '+1-555-0200'
 *             gender: FEMALE
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/EmployeeProfile'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/employees/:id/profile', (0, validate_1.validate)(hrms_validator_1.updateProfileSchema), (0, auditLogger_1.default)('hrms', 'UPDATE', 'employee_profile'), hrmsController.updateEmployeeProfile);
// Employee Status
/**
 * @swagger
 * /hrms/employees/{id}/status:
 *   patch:
 *     summary: Activate / deactivate / terminate employee
 *     description: Update employee status to ACTIVE, INACTIVE, or TERMINATED. Optionally provide exitDate and exitReason.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployeeStatusRequest'
 *           example:
 *             status: ACTIVE
 *     responses:
 *       200:
 *         description: Employee status updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Employee'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/employees/:id/status', (0, validate_1.validate)(hrms_validator_1.updateEmployeeStatusSchema), (0, auditLogger_1.default)('hrms', 'UPDATE', 'employee_status'), hrmsController.updateEmployeeStatus);
// Employee History
/**
 * @swagger
 * /hrms/employees/{id}/history:
 *   get:
 *     summary: Get role / department change history for an employee
 *     description: Returns a chronological list of all role, department, branch, status, and salary changes.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: History list returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/EmployeeHistory'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/employees/:id/history', hrmsController.getEmployeeHistory);
/**
 * @swagger
 * /hrms/employees/{id}/attendance:
 *   get:
 *     summary: Get employee attendance logs
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Employee MongoDB ObjectId
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 6
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2024
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Attendance records with summary
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/employees/:id/attendance', selfOrAdmin_1.selfOrAdmin, (0, validate_1.validate)(hrms_validator_1.getEmployeeAttendanceSchema), hrmsController.getEmployeeAttendance);
/**
 * @swagger
 * /hrms/employees/{id}/leaves:
 *   get:
 *     summary: Get employee leave requests and balance
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED]
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2024
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Leave requests with balance summary
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/employees/:id/leaves', selfOrAdmin_1.selfOrAdmin, (0, validate_1.validate)(hrms_validator_1.getEmployeeLeavesSchema), hrmsController.getEmployeeLeaves);
/**
 * @swagger
 * /hrms/employees/{id}/payroll:
 *   get:
 *     summary: Get employee payslips
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2024
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, GENERATED, PAID]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Payslip records
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/employees/:id/payroll', selfOrAdmin_1.selfOrAdmin, (0, validate_1.validate)(hrms_validator_1.getEmployeePayrollSchema), hrmsController.getEmployeePayroll);
/**
 * @swagger
 * /hrms/employees/{id}/on-leave:
 *   patch:
 *     summary: Admin initiates leave on behalf of employee
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leaveTypeId
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               leaveTypeId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *               notes:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       200:
 *         description: Leave created and approved
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Date conflict with existing approved leave
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/employees/:id/on-leave', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, validate_1.validate)(hrms_validator_1.initiateLeaveOnBehalfSchema), (0, auditLogger_1.default)('EMPLOYEES', 'UPDATE', 'Employee'), hrmsController.initiateLeaveOnBehalf);
/**
 * @swagger
 * /hrms/employees/{id}/terminate:
 *   patch:
 *     summary: Terminate an employee
 *     tags: [Offboarding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastWorkingDate
 *               - reason
 *             properties:
 *               lastWorkingDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *                 enum: [RESIGNATION, TERMINATION, RETIREMENT, CONTRACT_END, OTHER]
 *               reasonDetails:
 *                 type: string
 *                 maxLength: 2000
 *               exitChecklist:
 *                 type: object
 *                 properties:
 *                   laptopReturned:
 *                     type: boolean
 *                   accessRevoked:
 *                     type: boolean
 *                   fnfSettled:
 *                     type: boolean
 *                   relievingLetterIssued:
 *                     type: boolean
 *                   exitInterviewDone:
 *                     type: boolean
 *               noticePeriodServed:
 *                 type: boolean
 *               finalSalaryProcessed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Employee terminated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/employees/:id/terminate', (0, roleGuard_1.roleGuard)(['admin']), (0, validate_1.validate)(hrms_validator_1.terminateEmployeeSchema), (0, auditLogger_1.default)('EMPLOYEES', 'UPDATE', 'Employee'), hrmsController.terminateEmployee);
/**
 * @swagger
 * /hrms/employees/{id}/assign-role:
 *   patch:
 *     summary: Assign new role, department, or designation
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - effectiveDate
 *               - reason
 *             properties:
 *               designation:
 *                 type: string
 *               departmentId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *               employmentType:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERN]
 *               reportingManagerId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *               effectiveDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *                 enum: [PROMOTION, TRANSFER, RESTRUCTURE, CORRECTION]
 *               notes:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       200:
 *         description: Role assigned and history recorded
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/employees/:id/assign-role', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, validate_1.validate)(hrms_validator_1.assignEmployeeRoleSchema), (0, auditLogger_1.default)('EMPLOYEES', 'UPDATE', 'Employee'), hrmsController.assignEmployeeRole);
/**
 * @swagger
 * /hrms/employees/{id}/reset-password:
 *   post:
 *     summary: Reset employee password or resend invite
 *     tags: [Auth & Access]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [reset_password, resend_invite]
 *               notifyEmployee:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: Reset email sent
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/employees/:id/reset-password', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, validate_1.validate)(hrms_validator_1.resetEmployeePasswordSchema), hrmsController.resetEmployeePassword);
/**
 * @swagger
 * /hrms/employees/{id}/documents:
 *   post:
 *     summary: Upload or link employee document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentType
 *               - documentName
 *             properties:
 *               documentUrl:
 *                 type: string
 *                 format: uri
 *               fileUrl:
 *                 type: string
 *                 format: uri
 *               documentType:
 *                 type: string
 *                 enum: [OFFER_LETTER, ID_PROOF, CERTIFICATE, CONTRACT, NDA, PAYSLIP, OTHER]
 *               documentName:
 *                 type: string
 *                 maxLength: 255
 *               fileSize:
 *                 type: integer
 *               mimeType:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               isConfidential:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Document created
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/employees/:id/documents', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), upload_1.documentUpload, upload_1.handleUploadError, (req, _res, next) => {
    if (req.file) {
        req.body.fileUrl = `/uploads/documents/${req.file.filename}`;
        req.body.fileSize = req.file.size;
        req.body.mimeType = req.file.mimetype;
        if (!req.body.documentName) {
            req.body.documentName = req.file.originalname;
        }
    }
    next();
}, (0, validate_1.validate)(hrms_validator_1.createEmployeeDocumentSchema), (0, auditLogger_1.default)('EMPLOYEES', 'CREATE', 'EmployeeDocument'), hrmsController.createEmployeeDocument);
/**
 * @swagger
 * /hrms/employees/{id}/documents:
 *   get:
 *     summary: List employee documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Documents list
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/employees/:id/documents', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, validate_1.validate)(hrms_validator_1.listEmployeeDocumentsSchema), hrmsController.listEmployeeDocuments);
router.get('/employees/:id/documents/:documentId/download', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager', 'employee']), hrmsController.downloadEmployeeDocument);
/**
 * @swagger
 * /hrms/employees/{id}/notes:
 *   post:
 *     summary: Create HR note on employee
 *     tags: [HR Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - category
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 2000
 *               category:
 *                 type: string
 *                 enum: [PERFORMANCE, DISCIPLINARY, GENERAL, APPRECIATION, COMPLAINT, OTHER]
 *               isPinned:
 *                 type: boolean
 *                 default: false
 *               visibility:
 *                 type: string
 *                 enum: [HR_ONLY, ADMIN_ONLY, HR_AND_ADMIN]
 *                 default: HR_AND_ADMIN
 *     responses:
 *       201:
 *         description: Note created
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/employees/:id/notes', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, validate_1.validate)(hrms_validator_1.createEmployeeNoteSchema), (0, auditLogger_1.default)('EMPLOYEES', 'CREATE', 'EmployeeNote'), hrmsController.createEmployeeNote);
/**
 * @swagger
 * /hrms/employees/{id}/notes:
 *   get:
 *     summary: List HR notes for employee
 *     tags: [HR Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Notes list
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/employees/:id/notes', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, validate_1.validate)(hrms_validator_1.listEmployeeNotesSchema), hrmsController.listEmployeeNotes);
/**
 * @swagger
 * /hrms/employees/{id}/notes/{noteId}:
 *   patch:
 *     summary: Update an HR note
 *     tags: [HR Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 2000
 *               category:
 *                 type: string
 *                 enum: [PERFORMANCE, DISCIPLINARY, GENERAL, APPRECIATION, COMPLAINT, OTHER]
 *               isPinned:
 *                 type: boolean
 *               visibility:
 *                 type: string
 *                 enum: [HR_ONLY, ADMIN_ONLY, HR_AND_ADMIN]
 *     responses:
 *       200:
 *         description: Note updated
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/employees/:id/notes/:noteId', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, validate_1.validate)(hrms_validator_1.updateEmployeeNoteSchema), (0, auditLogger_1.default)('EMPLOYEES', 'UPDATE', 'EmployeeNote'), hrmsController.updateEmployeeNote);
/**
 * @swagger
 * /hrms/employees/{id}/notes/{noteId}:
 *   delete:
 *     summary: Soft-delete an HR note
 *     tags: [HR Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Note deleted
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/employees/:id/notes/:noteId', (0, roleGuard_1.roleGuard)(['admin', 'hr_manager']), (0, auditLogger_1.default)('EMPLOYEES', 'DELETE', 'EmployeeNote'), hrmsController.deleteEmployeeNote);
// Departments
/**
 * @swagger
 * /hrms/departments:
 *   get:
 *     summary: List departments
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or code
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *         description: Filter by parent department ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/departments', hrmsController.listDepartments);
/**
 * @swagger
 * /hrms/departments:
 *   post:
 *     summary: Create departments
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentRequest'
 *           example:
 *             name: Engineering
 *             code: ENG
 *             description: Software Engineering & Development
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/departments', (0, validate_1.validate)(hrms_validator_1.createDepartmentSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'department'), hrmsController.createDepartment);
/**
 * @swagger
 * /hrms/departments/{id}:
 *   patch:
 *     summary: Update departments
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepartmentRequest'
 *           example:
 *             name: Engineering
 *             description: Updated description
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/departments/:id', (0, validate_1.validate)(hrms_validator_1.updateDepartmentSchema), hrmsController.updateDepartment);
/**
 * @swagger
 * /hrms/departments/{id}:
 *   delete:
 *     summary: Delete departments
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/departments/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'department'), hrmsController.removeDepartment);
/**
 * @swagger
 * /hrms/departments/{id}/employees:
 *   get:
 *     summary: Get departments employees by ID
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, TERMINATED]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/departments/:id/employees', hrmsController.listDepartmentEmployees);
// ─── DESIGNATIONS ─────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/designations/all:
 *   get:
 *     summary: List all designations (unpaginated)
 *     description: Returns all active designations for dropdown/select usage
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of designations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.get('/designations/all', hrmsController.listAllDesignations);
/**
 * @swagger
 * /hrms/designations:
 *   get:
 *     summary: List designations with pagination
 *     description: Search, filter, sort, and paginate designations
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or code
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department ObjectId
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: hierarchyOrder
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Paginated designation list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/designations', hrmsController.listDesignations);
/**
 * @swagger
 * /hrms/designations:
 *   post:
 *     summary: Create a designation
 *     description: Create a new designation with name, code, department, and hierarchy details
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDesignationRequest'
 *           example:
 *             name: Senior Software Engineer
 *             designationCode: SSE
 *             description: Senior-level engineering role
 *             level: 3
 *             hierarchyOrder: 30
 *             employmentTypes:
 *               - FULL_TIME
 *             color: "#4F46E5"
 *             departmentId: 60d5f484f1a2c8b1f8e4e1c1
 *             status: ACTIVE
 *     responses:
 *       201:
 *         description: Designation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Designation name or code already exists
 */
router.post('/designations', (0, validate_1.validate)(hrms_validator_1.createDesignationSchema), (0, rbac_1.checkPermission)('DESIGNATION', 'CREATE'), (0, auditLogger_1.default)('hrms', 'CREATE', 'designation'), hrmsController.createDesignation);
/**
 * @swagger
 * /hrms/designations/{id}:
 *   get:
 *     summary: Get designation by ID
 *     description: Retrieve a single designation with full details
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Designation ObjectId
 *     responses:
 *       200:
 *         description: Designation details
 *       404:
 *         description: Designation not found
 */
router.get('/designations/:id', hrmsController.getDesignationById);
/**
 * @swagger
 * /hrms/designations/{id}:
 *   patch:
 *     summary: Update a designation
 *     description: Partial update of designation fields
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Designation ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDesignationRequest'
 *           example:
 *             name: Lead Software Engineer
 *             level: 4
 *     responses:
 *       200:
 *         description: Designation updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Designation not found
 *       409:
 *         description: Name or code conflict
 */
router.patch('/designations/:id', (0, validate_1.validate)(hrms_validator_1.updateDesignationSchema), (0, rbac_1.checkPermission)('DESIGNATION', 'UPDATE'), hrmsController.updateDesignation);
/**
 * @swagger
 * /hrms/designations/{id}:
 *   delete:
 *     summary: Soft delete a designation
 *     description: Soft delete (sets deletedAt). Use ?force=true to bypass active employee check
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Designation ObjectId
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *         description: Force delete even if employees are assigned
 *     responses:
 *       200:
 *         description: Designation deleted
 *       400:
 *         description: Has active employees (if not forced)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Designation not found
 */
router.delete('/designations/:id', (0, rbac_1.checkPermission)('DESIGNATION', 'DELETE'), (0, auditLogger_1.default)('hrms', 'DELETE', 'designation'), hrmsController.removeDesignation);
/**
 * @swagger
 * /hrms/designations/{id}/restore:
 *   post:
 *     summary: Restore a deleted designation
 *     description: Restores a soft-deleted designation by clearing deletedAt
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Designation ObjectId
 *     responses:
 *       200:
 *         description: Designation restored
 *       404:
 *         description: Designation not found or not deleted
 */
router.post('/designations/:id/restore', (0, rbac_1.checkPermission)('DESIGNATION', 'UPDATE'), (0, auditLogger_1.default)('hrms', 'RESTORE', 'designation'), hrmsController.restoreDesignation);
/**
 * @swagger
 * /hrms/designations/bulk/delete:
 *   post:
 *     summary: Bulk delete designations
 *     description: Soft delete multiple designations at once
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of designation ObjectIds
 *               force:
 *                 type: boolean
 *                 description: Force delete if employees are assigned
 *           example:
 *             ids: ["60d5f484f1a2c8b1f8e4e1c1", "60d5f484f1a2c8b1f8e4e1c2"]
 *             force: false
 *     responses:
 *       200:
 *         description: Bulk delete result
 *       400:
 *         description: Has active employees
 *       401:
 *         description: Unauthorized
 */
router.post('/designations/bulk/delete', (0, validate_1.validate)(hrms_validator_1.bulkDesignationsSchema), (0, rbac_1.checkPermission)('DESIGNATION', 'DELETE'), (0, auditLogger_1.default)('hrms', 'BULK_DELETE', 'designation'), hrmsController.bulkDeleteDesignations);
/**
 * @swagger
 * /hrms/designations/bulk/restore:
 *   post:
 *     summary: Bulk restore designations
 *     description: Restore multiple soft-deleted designations
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             ids: ["60d5f484f1a2c8b1f8e4e1c1"]
 *     responses:
 *       200:
 *         description: Bulk restore result
 *       401:
 *         description: Unauthorized
 */
router.post('/designations/bulk/restore', (0, validate_1.validate)(hrms_validator_1.bulkDesignationsSchema), (0, rbac_1.checkPermission)('DESIGNATION', 'UPDATE'), (0, auditLogger_1.default)('hrms', 'BULK_RESTORE', 'designation'), hrmsController.bulkRestoreDesignations);
/**
 * @swagger
 * /hrms/designations/{id}/status:
 *   patch:
 *     summary: Change designation status
 *     description: Activate or deactivate a designation
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Designation ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *           example:
 *             status: INACTIVE
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Designation not found
 */
router.patch('/designations/:id/status', (0, validate_1.validate)(hrms_validator_1.changeDesignationStatusSchema), (0, rbac_1.checkPermission)('DESIGNATION', 'UPDATE'), hrmsController.changeDesignationStatus);
/**
 * @swagger
 * /hrms/designations/export/csv:
 *   get:
 *     summary: Export designations as CSV
 *     description: Download designations list as CSV file
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/designations/export/csv', (0, rbac_1.checkPermission)('DESIGNATION', 'EXPORT'), hrmsController.exportDesignationsCSV);
/**
 * @swagger
 * /hrms/designations/export/excel:
 *   get:
 *     summary: Export designations as Excel
 *     description: Download designations list as Excel (.xlsx) file
 *     tags: [HRMS — Designations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Excel file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/designations/export/excel', (0, rbac_1.checkPermission)('DESIGNATION', 'EXPORT'), hrmsController.exportDesignationsExcel);
// Attendance
/**
 * @swagger
 * /hrms/attendance:
 *   get:
 *     summary: List attendance
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by employee (MongoDB ObjectId)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date (ISO 8601)
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date range (ISO 8601)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date range (ISO 8601)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE]
 *         description: Filter by attendance status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: date
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/attendance', hrmsController.listAttendance);
/**
 * @swagger
 * /hrms/attendance:
 *   post:
 *     summary: Create attendance
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             date: '2024-03-15'
 *             checkIn: '2024-03-15T09:00:00.000Z'
 *             checkOut: '2024-03-15T18:00:00.000Z'
 *             status: PRESENT
 *             source: MANUAL
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/attendance', (0, validate_1.validate)(hrms_validator_1.createAttendanceSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'attendance'), hrmsController.createAttendance);
/**
 * @swagger
 * /hrms/attendance/{id}:
 *   patch:
 *     summary: Update attendance
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAttendanceRequest'
 *           example:
 *             checkIn: '2024-03-15T09:15:00.000Z'
 *             checkOut: '2024-03-15T17:45:00.000Z'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
/**
 * @swagger
 * /hrms/attendance/bulk:
 *   post:
 *     summary: Create attendance bulk
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkAttendanceRequest'
 *           example:
 *             date: '2024-03-15'
 *             entries:
 *               - employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *                 status: PRESENT
 *                 checkIn: '2024-03-15T09:00:00.000Z'
 *               - employeeId: 60d5f484f1a2c8b1f8e4e1a2
 *                 status: ABSENT
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/attendance/bulk', (0, validate_1.validate)(hrms_validator_1.bulkAttendanceSchema), hrmsController.bulkCreateAttendance);
/**
 * @swagger
 * /hrms/attendance/summary:
 *   get:
 *     summary: List attendance summary
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by employee (optional, defaults to all)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year (e.g. 2024)
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/attendance/summary', hrmsController.getAttendanceSummary);
/**
 * @swagger
 * /hrms/attendance/export:
 *   get:
 *     summary: List attendance export
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/attendance/export', hrmsController.exportAttendance);
// Attendance - Checkin / Checkout
/**
 * @swagger
 * /hrms/attendance/checkin:
 *   post:
 *     summary: Mark attendance check-in
 *     description: Records check-in for an employee. If employeeId is omitted, uses the authenticated user's employee record.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckinRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             date: '2024-03-15'
 *             checkIn: '2024-03-15T09:00:00.000Z'
 *             source: APP
 *     responses:
 *       200:
 *         description: Check-in recorded
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Attendance'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Already checked in today
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/attendance/checkin', (0, validate_1.validate)(hrms_validator_1.checkinSchema), (0, auditLogger_1.default)('attendance', 'CHECKIN', 'attendance'), hrmsController.checkin);
/**
 * @swagger
 * /hrms/attendance/checkout:
 *   post:
 *     summary: Mark attendance check-out
 *     description: Records check-out for an employee. Requires an existing check-in for today.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             date: '2024-03-15'
 *             checkOut: '2024-03-15T18:00:00.000Z'
 *     responses:
 *       200:
 *         description: Check-out recorded
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Attendance'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: No check-in found for today
 *       409:
 *         description: Already checked out today
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/attendance/checkout', (0, validate_1.validate)(hrms_validator_1.checkoutSchema), (0, auditLogger_1.default)('attendance', 'CHECKOUT', 'attendance'), hrmsController.checkout);
// Attendance - Regularization
/**
 * @swagger
 * /hrms/attendance/regularize:
 *   post:
 *     summary: Submit an attendance regularization request
 *     description: Request to correct attendance for a past date (e.g. forgot to check in/out).
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegularizeAttendanceRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             date: '2024-03-15'
 *             checkIn: '2024-03-15T09:15:00.000Z'
 *             checkOut: '2024-03-15T17:45:00.000Z'
 *             reason: Forgot to check in on time
 *     responses:
 *       201:
 *         description: Regularization request created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RegularizationRequest'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: A pending request already exists for this date
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/attendance/regularization', hrmsController.listRegularizations);
router.get('/attendance/regularize', hrmsController.listRegularizations);
router.post('/attendance/regularize', (0, validate_1.validate)(hrms_validator_1.regularizeAttendanceSchema), (0, auditLogger_1.default)('attendance', 'REGULARIZE', 'attendance'), hrmsController.createRegularization);
/**
 * @swagger
 * /hrms/attendance/regularize/{id}:
 *   patch:
 *     summary: Approve or reject an attendance regularization request
 *     description: Manager can approve or reject a pending regularization request. Approved requests update the actual attendance record.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the regularization request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveRejectRegularizationRequest'
 *           example:
 *             status: APPROVED
 *             comments: Request approved
 *     responses:
 *       200:
 *         description: Regularization request processed
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RegularizationRequest'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/attendance/regularize/:id', (0, validate_1.validate)(hrms_validator_1.approveRejectRegularizationSchema), (0, auditLogger_1.default)('attendance', 'APPROVE', 'regularization'), hrmsController.approveRejectRegularization);
// Dynamic routes placed after static routes to prevent greedy matching
router.patch('/attendance/:id', (0, validate_1.validate)(hrms_validator_1.updateAttendanceSchema), hrmsController.updateAttendance);
router.get('/attendance/:id', hrmsController.getAttendanceById);
// Leave Types
/**
 * @swagger
 * /hrms/leave-types:
 *   get:
 *     summary: List leave types
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/leave-types', hrmsController.listLeaveTypes);
/**
 * @swagger
 * /hrms/leave-types:
 *   post:
 *     summary: Create leave types
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeaveTypeRequest'
 *           example:
 *             name: Annual Leave
 *             code: ANNUAL
 *             annualAllowance: 20
 *             carryForward: true
 *             maxCarryForward: 10
 *             isPaid: true
 *             requiresApproval: true
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/leave-types', (0, validate_1.validate)(hrms_validator_1.createLeaveTypeSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'leave_type'), hrmsController.createLeaveType);
/**
 * @swagger
 * /hrms/leave-types/{id}:
 *   patch:
 *     summary: Update leave types
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLeaveTypeRequest'
 *           example:
 *             annualAllowance: 18
 *             maxCarryForward: 5
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/leave-types/:id', (0, validate_1.validate)(hrms_validator_1.updateLeaveTypeSchema), hrmsController.updateLeaveType);
/**
 * @swagger
 * /hrms/leave-types/{id}:
 *   delete:
 *     summary: Delete leave types
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/leave-types/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'leave_type'), hrmsController.removeLeaveType);
// Leave Requests
/**
 * @swagger
 * /hrms/leave-requests:
 *   get:
 *     summary: List leave requests
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by employee
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED]
 *         description: Filter by leave status
 *       - in: query
 *         name: leaveTypeId
 *         schema:
 *           type: string
 *         description: Filter by leave type
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date range
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date range
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/leave-requests', hrmsController.listLeaveRequests);
/**
 * @swagger
 * /hrms/leave-requests:
 *   post:
 *     summary: Create leave requests
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeaveRequestRequest'
 *           example:
 *             leaveTypeId: 60d5f484f1a2c8b1f8e4e1c1
 *             fromDate: '2024-04-01'
 *             toDate: '2024-04-05'
 *             reason: Family vacation
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/leave-requests', (0, validate_1.validate)(hrms_validator_1.createLeaveRequestSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'leave_request'), hrmsController.createLeaveRequest);
/**
 * @swagger
 * /hrms/leave-requests/{id}/approve:
 *   post:
 *     summary: Approve a leave request
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveRejectLeaveRequest'
 *           example:
 *             comments: Approved — leave balance sufficient
 *     responses:
 *       200:
 *         description: Leave request approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/leave-requests/:id/approve', (0, validate_1.validate)(hrms_validator_1.approveRejectLeaveSchema), (0, auditLogger_1.default)('hrms', 'APPROVE', 'leave_request'), hrmsController.approveLeaveRequest);
/**
 * @swagger
 * /hrms/leave-requests/{id}/reject:
 *   post:
 *     summary: Reject a leave request
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveRejectLeaveRequest'
 *           example:
 *             comments: Approved — leave balance sufficient
 *     responses:
 *       200:
 *         description: Leave request rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/leave-requests/:id/reject', (0, validate_1.validate)(hrms_validator_1.approveRejectLeaveSchema), (0, auditLogger_1.default)('hrms', 'REJECT', 'leave_request'), hrmsController.rejectLeaveRequest);
/**
 * @swagger
 * /hrms/leave-requests/{id}:
 *   get:
 *     summary: Get leave requests by ID
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/leave-requests/:id', hrmsController.getLeaveRequestById);
/**
 * @swagger
 * /hrms/leave-requests/{id}:
 *   delete:
 *     summary: Delete leave requests
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/leave-requests/:id', hrmsController.removeLeaveRequest);
// Leave Balance & Calendar
/**
 * @swagger
 * /hrms/leave-balance:
 *   get:
 *     summary: List leave balance
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by employee (optional, defaults to authenticated user)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/leave-balance', hrmsController.getLeaveBalance);
/**
 * @swagger
 * /hrms/leave-calendar:
 *   get:
 *     summary: List leave calendar
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year (e.g. 2024)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (optional, defaults to current)
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/leave-calendar', hrmsController.getLeaveCalendar);
// Holidays
/**
 * @swagger
 * /hrms/holidays:
 *   get:
 *     summary: List holidays
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (e.g. 2024)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PUBLIC, RESTRICTED, OPTIONAL]
 *         description: Filter by holiday type
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         description: Filter by branch
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/holidays', hrmsController.listHolidays);
/**
 * @swagger
 * /hrms/holidays:
 *   post:
 *     summary: Create holidays
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHolidayRequest'
 *           example:
 *             name: Independence Day
 *             date: '2024-08-15'
 *             type: PUBLIC
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/holidays', (0, validate_1.validate)(hrms_validator_1.createHolidaySchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'holiday'), hrmsController.createHoliday);
/**
 * @swagger
 * /hrms/holidays/{id}:
 *   patch:
 *     summary: Update holidays
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateHolidayRequest'
 *           example:
 *             name: Republic Day
 *             date: '2024-01-26'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/holidays/:id', (0, validate_1.validate)(hrms_validator_1.updateHolidaySchema), hrmsController.updateHoliday);
/**
 * @swagger
 * /hrms/holidays/{id}:
 *   delete:
 *     summary: Delete holidays
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/holidays/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'holiday'), hrmsController.removeHoliday);
// Payroll
/**
 * @swagger
 * /hrms/payroll:
 *   get:
 *     summary: List payroll
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filter by month
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (e.g. 2024)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PROCESSED, CANCELLED]
 *         description: Filter by payroll status
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/payroll', hrmsController.listPayroll);
/**
 * @swagger
 * /hrms/payroll/run:
 *   post:
 *     summary: Run payroll for a month/year
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RunPayrollRequest'
 *           example:
 *             month: 3
 *             year: 2024
 *     responses:
 *       201:
 *         description: Payroll run created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/payroll/run', (0, validate_1.validate)(hrms_validator_1.runPayrollSchema), (0, auditLogger_1.default)('hrms', 'RUN', 'payroll'), hrmsController.runPayroll);
/**
 * @swagger
 * /hrms/payroll/payslip/{id}:
 *   get:
 *     summary: Get payroll payslip by ID
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/payroll/payslip/:id', hrmsController.getPayslip);
/**
 * @swagger
 * /hrms/payroll/export:
 *   get:
 *     summary: List payroll export
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/payroll/export', hrmsController.exportPayslips);
/**
 * @swagger
 * /hrms/payroll/payslip/export:
 *   post:
 *     summary: Export payroll payslips
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: integer
 *                 description: Month for filtering payslips (1-12)
 *                 example: 3
 *               year:
 *                 type: integer
 *                 description: Year for filtering payslips
 *                 example: 2024
 *               employeeId:
 *                 type: string
 *                 description: Filter by employee (optional)
 *                 example: 60d5f484f1a2c8b1f8e4e1a1
 *           example:
 *             month: 3
 *             year: 2024
 *     responses:
 *       201:
 *         description: Export initiated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/payroll/payslip/export', hrmsController.exportPayslips);
/**
 * @swagger
 * /hrms/payroll/{runId}:
 *   get:
 *     summary: Get payroll by ID
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema:
 *           type: string
 *         description: The payroll run ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/payroll/:runId', hrmsController.getPayrollById);
// Payroll - Employee specific
/**
 * @swagger
 * /hrms/payroll/{employeeId}/payslips:
 *   get:
 *     summary: Get all payslips for an employee
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: Payslips returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payslip'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/payroll/:employeeId/payslips', hrmsController.getEmployeePayslips);
/**
 * @swagger
 * /hrms/payroll/payslip/{month}/{year}:
 *   get:
 *     summary: Get payslips for a specific month and year
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12)
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g. 2025)
 *     responses:
 *       200:
 *         description: Payslips returned for the period
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         payroll:
 *                           $ref: '#/components/schemas/Payroll'
 *                         payslips:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Payslip'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/payroll/payslip/:month/:year', hrmsController.getPayslipByMonthYear);
/**
 * @swagger
 * /hrms/payroll/{employeeId}/tax:
 *   get:
 *     summary: Get tax details for an employee
 *     description: Returns PAN, monthly/annual gross/net, YTD figures, and per-month PF/ESI contributions.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: Tax details returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         employeeId:
 *                           type: string
 *                         panNumber:
 *                           type: string
 *                         monthlyGross:
 *                           type: number
 *                         monthlyNet:
 *                           type: number
 *                         annualGross:
 *                           type: number
 *                         annualNet:
 *                           type: number
 *                         ytdGross:
 *                           type: number
 *                         ytdDeductions:
 *                           type: number
 *                         ytdNet:
 *                           type: number
 *                         pfPerMonth:
 *                           type: number
 *                         esiPerMonth:
 *                           type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/payroll/:employeeId/tax', hrmsController.getEmployeeTaxDetails);
/**
 * @swagger
 * /hrms/payroll/{employeeId}/deductions:
 *   get:
 *     summary: Get deductions list for an employee
 *     description: Returns PF, ESI, TDS per month and annual figures, plus any custom deductions from the salary structure.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: Deductions list returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         pf:
 *                           type: object
 *                           properties:
 *                             perMonth:
 *                               type: number
 *                             annual:
 *                               type: number
 *                         esi:
 *                           type: object
 *                           properties:
 *                             perMonth:
 *                               type: number
 *                             annual:
 *                               type: number
 *                         tds:
 *                           type: object
 *                           properties:
 *                             perMonth:
 *                               type: number
 *                             annual:
 *                               type: number
 *                         customDeductions:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               perMonth:
 *                                 type: number
 *                               annual:
 *                                 type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/payroll/:employeeId/deductions', hrmsController.getEmployeeDeductions);
// Salary Structure
/**
 * @swagger
 * /hrms/salary-structure/{employeeId}:
 *   get:
 *     summary: Get salary structure by ID
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The employeeId parameter
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/salary-structure/:employeeId', hrmsController.getSalaryStructure);
/**
 * @swagger
 * /hrms/salary-structure:
 *   post:
 *     summary: Create salary structure
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSalaryStructureRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             effectiveFrom: '2024-04-01'
 *             basicSalary: 50000
 *             hra: 20000
 *             ta: 5000
 *             pf: 6000
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/salary-structure', (0, validate_1.validate)(hrms_validator_1.createSalaryStructureSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'salary_structure'), hrmsController.createSalaryStructure);
/**
 * @swagger
 * /hrms/salary-structure/{employeeId}:
 *   patch:
 *     summary: Update salary structure
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The employeeId parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSalaryStructureRequest'
 *           example:
 *             basicSalary: 55000
 *             hra: 22000
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/salary-structure/:employeeId', (0, validate_1.validate)(hrms_validator_1.updateSalaryStructureSchema), hrmsController.updateSalaryStructure);
// ─── PERFORMANCE ────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/performance/{employeeId}/goals:
 *   get:
 *     summary: List performance goals for an employee
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [NOT_STARTED, IN_PROGRESS, ACHIEVED, NOT_ACHIEVED]
 *         description: Filter by goal status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Goals list returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/PerformanceGoal'
 *                         meta:
 *                           $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/performance/:employeeId/goals', hrmsController.listPerformanceGoals);
/**
 * @swagger
 * /hrms/performance/goals:
 *   post:
 *     summary: Create a performance goal for an employee
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePerformanceGoalRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             title: Increase customer satisfaction score
 *             targetValue: 4.5
 *             weightage: 30
 *             startDate: '2024-01-01'
 *             endDate: '2024-03-31'
 *     responses:
 *       201:
 *         description: Goal created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PerformanceGoal'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/performance/goals', (0, validate_1.validate)(hrms_validator_1.createPerformanceGoalSchema), (0, auditLogger_1.default)('performance', 'CREATE', 'goal'), hrmsController.createPerformanceGoal);
/**
 * @swagger
 * /hrms/performance/goals/{id}:
 *   patch:
 *     summary: Update a performance goal
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the goal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePerformanceGoalRequest'
 *           example:
 *             title: Increase customer satisfaction score
 *             currentValue: 4.2
 *             status: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Goal updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PerformanceGoal'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/performance/goals/:id', (0, validate_1.validate)(hrms_validator_1.updatePerformanceGoalSchema), (0, auditLogger_1.default)('performance', 'UPDATE', 'goal'), hrmsController.updatePerformanceGoal);
/**
 * @swagger
 * /hrms/performance/appraisal:
 *   post:
 *     summary: Submit a performance appraisal for an employee
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitAppraisalRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             reviewPeriod: Q1 2024
 *             rating: 4
 *             strengths: Excellent problem-solving
 *     responses:
 *       201:
 *         description: Appraisal submitted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PerformanceAppraisal'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/performance/appraisal', (0, validate_1.validate)(hrms_validator_1.submitAppraisalSchema), (0, auditLogger_1.default)('performance', 'SUBMIT', 'appraisal'), hrmsController.submitAppraisal);
/**
 * @swagger
 * /hrms/performance/appraisal/{employeeId}:
 *   get:
 *     summary: Get appraisal history for an employee
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: Appraisal history returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PerformanceAppraisal'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/performance/appraisal/:employeeId', hrmsController.getAppraisalHistory);
/**
 * @swagger
 * /hrms/performance/feedback:
 *   post:
 *     summary: Submit performance feedback for an employee
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitFeedbackRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             rating: 4
 *             comments: Great work on the recent project
 *             category: MANAGER
 *     responses:
 *       201:
 *         description: Feedback submitted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PerformanceFeedback'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/performance/feedback', (0, validate_1.validate)(hrms_validator_1.submitFeedbackSchema), (0, auditLogger_1.default)('performance', 'SUBMIT', 'feedback'), hrmsController.submitFeedback);
// ─── TRAINING ───────────────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/training/courses:
 *   get:
 *     summary: List available training courses
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by course category
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [ONLINE, OFFLINE, HYBRID]
 *         description: Filter by delivery mode
 *       - in: query
 *         name: isMandatory
 *         schema:
 *           type: boolean
 *         description: Filter by mandatory status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title
 *     responses:
 *       200:
 *         description: Courses list returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TrainingCourse'
 *                         meta:
 *                           $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/training/courses', hrmsController.listTrainingCourses);
/**
 * @swagger
 * /hrms/training/enroll:
 *   post:
 *     summary: Enroll an employee in a course
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollCourseRequest'
 *           example:
 *             courseId: 60d5f484f1a2c8b1f8e4e1e1
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *     responses:
 *       201:
 *         description: Enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TrainingEnrollment'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Already enrolled
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/training/enroll', (0, validate_1.validate)(hrms_validator_1.enrollCourseSchema), (0, auditLogger_1.default)('training', 'ENROLL', 'enrollment'), hrmsController.enrollCourse);
/**
 * @swagger
 * /hrms/training/{enrollmentId}/complete:
 *   patch:
 *     summary: Mark a course enrollment as complete
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the enrollment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteCourseRequest'
 *           example:
 *             score: 92
 *             feedback: Excellent course
 *     responses:
 *       200:
 *         description: Course marked complete
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TrainingEnrollment'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/training/:enrollmentId/complete', (0, validate_1.validate)(hrms_validator_1.completeCourseSchema), (0, auditLogger_1.default)('training', 'COMPLETE', 'enrollment'), hrmsController.completeCourse);
/**
 * @swagger
 * /hrms/training/{employeeId}/history:
 *   get:
 *     summary: Get training history for an employee
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: Training history returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TrainingEnrollment'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/training/:employeeId/history', hrmsController.getTrainingHistory);
/**
 * @swagger
 * /hrms/training/{employeeId}/certifications:
 *   get:
 *     summary: Get certifications for an employee
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: Certifications returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TrainingCertification'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/training/:employeeId/certifications', hrmsController.getTrainingCertifications);
// ─── TRANSFERS & PROMOTIONS ─────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/transfers:
 *   post:
 *     summary: Raise a transfer request for an employee
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransferRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             toDepartmentId: 60d5f484f1a2c8b1f8e4e1b2
 *             reason: Moving to Bangalore office
 *     responses:
 *       201:
 *         description: Transfer request created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TransferRequest'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/transfers', (0, validate_1.validate)(hrms_validator_1.createTransferSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'transfer'), hrmsController.createTransferRequest);
/**
 * @swagger
 * /hrms/transfers/{id}/approve:
 *   patch:
 *     summary: Approve or reject a transfer request
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the transfer request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveRejectTransferRequest'
 *           example:
 *             status: APPROVED
 *             comments: Transfer approved
 *     responses:
 *       200:
 *         description: Transfer request processed
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TransferRequest'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/transfers/:id/approve', (0, validate_1.validate)(hrms_validator_1.approveRejectTransferSchema), (0, auditLogger_1.default)('hrms', 'APPROVE', 'transfer'), hrmsController.approveRejectTransfer);
/**
 * @swagger
 * /hrms/promotions:
 *   post:
 *     summary: Create a promotion record
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePromotionRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             toDesignationId: 60d5f484f1a2c8b1f8e4e1c2
 *             effectiveDate: '2024-06-01'
 *             reason: Consistent exceptional performance
 *     responses:
 *       201:
 *         description: Promotion created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Promotion'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/promotions', (0, validate_1.validate)(hrms_validator_1.createPromotionSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'promotion'), hrmsController.createPromotion);
// ─── EXIT / OFFBOARDING ─────────────────────────────────────────────────────
/**
 * @swagger
 * /hrms/exit/resign:
 *   post:
 *     summary: Submit a resignation
 *     description: Employee submits resignation with resignationDate, lastWorkingDay, and reason.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResignRequest'
 *           example:
 *             resignationDate: '2024-06-15'
 *             lastWorkingDay: '2024-07-15'
 *             reason: Accepted an offer from another company
 *     responses:
 *       201:
 *         description: Resignation submitted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ExitResignation'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: A pending resignation already exists
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/exit/resign', (0, validate_1.validate)(hrms_validator_1.resignSchema), (0, auditLogger_1.default)('exit', 'RESIGN', 'resignation'), hrmsController.submitResignation);
/**
 * @swagger
 * /hrms/exit/{employeeId}/checklist:
 *   get:
 *     summary: Get exit checklist for an employee
 *     description: Returns the exit checklist with department-wise clearance tasks. Auto-creates if not yet exists.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: Exit checklist returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ExitChecklist'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/exit/:employeeId/checklist', hrmsController.getExitChecklist);
/**
 * @swagger
 * /hrms/exit/{employeeId}/clearance/{departmentId}:
 *   patch:
 *     summary: Update department clearance for an employee
 *     description: Marks a department clearance as cleared or not cleared for an exiting employee.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the department
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClearanceRequest'
 *           example:
 *             status: CLEARED
 *             comments: All assets returned
 *     responses:
 *       200:
 *         description: Clearance updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ExitClearance'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/exit/:employeeId/clearance/:departmentId', (0, validate_1.validate)(hrms_validator_1.updateClearanceSchema), (0, auditLogger_1.default)('exit', 'CLEAR', 'clearance'), hrmsController.updateClearance);
/**
 * @swagger
 * /hrms/exit/{employeeId}/fnf:
 *   get:
 *     summary: Get full & final settlement for an employee
 *     description: Returns the FnF settlement including notice period pay, leave encashment, reimbursements, and bonus.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the employee
 *     responses:
 *       200:
 *         description: FnF settlement returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ExitSettlement'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/exit/:employeeId/fnf', hrmsController.getFnF);
// ─── DOCUMENTS — REQUEST LETTER ─────────────────────────────────────────────
/**
 * @swagger
 * /hrms/documents/request-letter:
 *   post:
 *     summary: Request a letter (experience, salary, offer, relieving, etc.)
 *     description: Generates a request for an official letter. The authenticated user's employee record is used.
 *     tags: [HRMS, Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestLetterRequest'
 *           example:
 *             type: EXPERIENCE
 *             content: Please include details of my tenure
 *             notes: Urgent — needed for visa application
 *     responses:
 *       201:
 *         description: Letter request submitted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         employeeId:
 *                           type: string
 *                         type:
 *                           type: string
 *                         content:
 *                           type: string
 *                         notes:
 *                           type: string
 *                         generatedAt:
 *                           type: string
 *                           format: date-time
 *                         message:
 *                           type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/documents/request-letter', (0, validate_1.validate)(hrms_validator_1.requestLetterSchema), (0, auditLogger_1.default)('document', 'REQUEST', 'letter'), hrmsController.requestLetter);
// Assets
/**
 * @swagger
 * /hrms/assets:
 *   get:
 *     summary: List assets
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, code, or serial number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, ASSIGNED, MAINTENANCE, RETIRED]
 *         description: Filter by asset status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by assigned employee
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/assets', hrmsController.listAssets);
/**
 * @swagger
 * /hrms/assets:
 *   post:
 *     summary: Create assets
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAssetRequest'
 *           example:
 *             name: MacBook Pro 16
 *             code: AST-MBP-001
 *             category: Laptop
 *             brand: Apple
 *             serialNumber: FGHJK12345
 *             purchaseValue: 2499.99
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/assets', (0, validate_1.validate)(hrms_validator_1.createAssetSchema), (0, auditLogger_1.default)('hrms', 'CREATE', 'asset'), hrmsController.createAsset);
/**
 * @swagger
 * /hrms/assets/{id}:
 *   patch:
 *     summary: Update assets
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAssetRequest'
 *           example:
 *             name: MacBook Pro 16
 *             status: ASSIGNED
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/assets/:id', (0, validate_1.validate)(hrms_validator_1.updateAssetSchema), hrmsController.updateAsset);
/**
 * @swagger
 * /hrms/assets/{id}:
 *   delete:
 *     summary: Delete assets
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/assets/:id', (0, auditLogger_1.default)('hrms', 'DELETE', 'asset'), hrmsController.removeAsset);
/**
 * @swagger
 * /hrms/assets/{id}/assign:
 *   post:
 *     summary: Create assets assign
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignAssetRequest'
 *           example:
 *             employeeId: 60d5f484f1a2c8b1f8e4e1a1
 *             condition: Good condition
 *             notes: Assigned for development work
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/assets/:id/assign', (0, validate_1.validate)(hrms_validator_1.assignAssetSchema), (0, auditLogger_1.default)('hrms', 'ASSIGN', 'asset'), hrmsController.assignAsset);
/**
 * @swagger
 * /hrms/assets/{id}/return:
 *   post:
 *     summary: Create assets return
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReturnAssetRequest'
 *           example:
 *             condition: Good — normal wear and tear
 *             notes: Employee resigned, asset returned
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/assets/:id/return', (0, validate_1.validate)(hrms_validator_1.returnAssetSchema), hrmsController.returnAsset);
// Reports
/**
 * @swagger
 * /hrms/reports/attendance:
 *   get:
 *     summary: List reports attendance
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/reports/attendance', hrmsController.getAttendanceReport);
/**
 * @swagger
 * /hrms/reports/leave:
 *   get:
 *     summary: List reports leave
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start of period
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End of period
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: leaveTypeId
 *         schema:
 *           type: string
 *         description: Filter by leave type
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/reports/leave', hrmsController.getLeaveReport);
/**
 * @swagger
 * /hrms/reports/payroll:
 *   get:
 *     summary: List reports payroll
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/reports/payroll', hrmsController.getPayrollReport);
/**
 * @swagger
 * /hrms/reports/headcount:
 *   get:
 *     summary: List reports headcount
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERN]
 *         description: Filter by employment type
 *       - in: query
 *         name: asOnDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Snapshot date (defaults to today)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/reports/headcount', hrmsController.getHeadcountReport);
/**
 * @swagger
 * /hrms/reports/attrition:
 *   get:
 *     summary: List reports attrition
 *     tags: [HRMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start of period
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End of period
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid input or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/reports/attrition', hrmsController.getAttritionReport);
exports.default = router;
//# sourceMappingURL=hrms.routes.js.map