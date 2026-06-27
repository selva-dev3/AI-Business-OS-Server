"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const company_routes_1 = __importDefault(require("./company.routes"));
const hrms_routes_1 = __importDefault(require("./hrms.routes"));
const crm_routes_1 = __importDefault(require("./crm.routes"));
const inventory_routes_1 = __importDefault(require("./inventory.routes"));
const procurement_routes_1 = __importDefault(require("./procurement.routes"));
const finance_routes_1 = __importDefault(require("./finance.routes"));
const project_routes_1 = __importDefault(require("./project.routes"));
const support_routes_1 = __importDefault(require("./support.routes"));
const document_routes_1 = __importDefault(require("./document.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const settings_routes_1 = __importDefault(require("./settings.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const ai_routes_1 = __importDefault(require("./ai.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/company', company_routes_1.default);
router.use('/hrms', hrms_routes_1.default);
router.use('/crm', crm_routes_1.default);
router.use('/inventory', inventory_routes_1.default);
router.use('/procurement', procurement_routes_1.default);
router.use('/finance', finance_routes_1.default);
router.use('/projects', project_routes_1.default);
router.use('/support', support_routes_1.default);
router.use('/documents', document_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
router.use('/settings', settings_routes_1.default);
router.use('/notifications', notification_routes_1.default);
router.use('/ai', ai_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
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
exports.default = router;
//# sourceMappingURL=index.js.map