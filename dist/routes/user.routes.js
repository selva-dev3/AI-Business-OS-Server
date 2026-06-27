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
const upload_1 = require("../middleware/upload");
const auditLogger_1 = __importDefault(require("../middleware/auditLogger"));
const userController = __importStar(require("../controllers/user.controller"));
const user_validator_1 = require("../validators/user.validator");
router.use(auth_1.authenticate);
router.get('/', userController.list);
router.post('/invite', (0, validate_1.validate)(user_validator_1.inviteUserSchema), (0, auditLogger_1.default)('user', 'INVITE', 'user'), userController.invite);
router.get('/:id', userController.getById);
router.patch('/:id', (0, validate_1.validate)(user_validator_1.updateUserSchema), userController.update);
router.delete('/:id', (0, auditLogger_1.default)('user', 'DEACTIVATE', 'user'), userController.remove);
router.patch('/:id/change-role', (0, validate_1.validate)(user_validator_1.changeRoleSchema), (0, auditLogger_1.default)('user', 'CHANGE_ROLE', 'user'), userController.changeRole);
router.post('/:id/reset-password', (0, validate_1.validate)(user_validator_1.resetUserPasswordSchema), (0, auditLogger_1.default)('user', 'RESET_PASSWORD', 'user'), userController.resetPassword);
router.patch('/profile/me', (0, validate_1.validate)(user_validator_1.updateProfileSchema), userController.updateProfile);
router.post('/profile/avatar', upload_1.avatarUpload, upload_1.handleUploadError, userController.uploadAvatar);
exports.default = router;
//# sourceMappingURL=user.routes.js.map