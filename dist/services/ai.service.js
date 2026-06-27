"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResume = exports.forecast = exports.extractDocument = exports.generateEmail = exports.summarize = exports.getInsights = exports.chat = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const chat = async (messages, context) => {
    const lastMessage = messages[messages.length - 1]?.content || '';
    let response;
    if (context === 'hr') {
        response = `Based on the HR context, I can help you with employee management, attendance tracking, leave management, and payroll. Regarding "${lastMessage}", I can provide insights from your HR data if you connect your HR module.`;
    }
    else if (context === 'crm') {
        response = `From your CRM perspective, I can assist with lead management, deal tracking, and customer insights. Regarding "${lastMessage}", I can analyze your sales pipeline and suggest next actions.`;
    }
    else if (context === 'finance') {
        response = `In the finance context, I can help with invoice management, expense tracking, and financial reporting. Regarding "${lastMessage}", I can provide revenue analysis and expense optimization suggestions.`;
    }
    else if (context === 'inventory') {
        response = `For inventory management, I can help with stock tracking, reorder recommendations, and warehouse optimization. Regarding "${lastMessage}", I can analyze your stock levels and suggest reorder quantities.`;
    }
    else if (context === 'support') {
        response = `In the support context, I can assist with ticket management, response templates, and customer satisfaction analysis. Regarding "${lastMessage}", I can help prioritize and categorize support tickets.`;
    }
    else {
        response = `I'm your AI assistant for AI Business OS. I can help you with various business operations including HR, CRM, Finance, Inventory, and Support. You asked: "${lastMessage}". How can I assist you further?`;
    }
    return {
        message: {
            role: 'assistant',
            content: response,
        },
        usage: {
            promptTokens: messages.length * 50,
            completionTokens: Math.round(response.length / 4),
            totalTokens: messages.length * 50 + Math.round(response.length / 4),
        },
    };
};
exports.chat = chat;
const getInsights = async (module, _data) => {
    const insights = [];
    if (module === 'revenue' || module === 'finance') {
        insights.push({
            type: 'trend',
            title: 'Revenue Pattern',
            description: 'Your revenue shows a consistent growth pattern over the last quarter.',
            confidence: 82,
            recommendation: 'Consider increasing marketing spend to capitalize on the upward trend.',
        });
        insights.push({
            type: 'anomaly',
            title: 'Unusual Transaction',
            description: 'Detected an unusually large transaction that may require review.',
            confidence: 65,
            recommendation: 'Review large transactions for potential errors or fraud.',
        });
    }
    else if (module === 'hr') {
        insights.push({
            type: 'pattern',
            title: 'Attendance Pattern',
            description: 'Friday afternoons show the highest absenteeism rates.',
            confidence: 78,
            recommendation: 'Consider flexible Friday schedules to reduce absenteeism.',
        });
        insights.push({
            type: 'insight',
            title: 'Leave Trends',
            description: 'Leave requests peak during school holiday seasons.',
            confidence: 85,
            recommendation: 'Plan staffing accordingly during peak leave periods.',
        });
    }
    else if (module === 'crm') {
        insights.push({
            type: 'insight',
            title: 'Conversion Opportunity',
            description: 'Leads from referral sources have 40% higher conversion rates.',
            confidence: 88,
            recommendation: 'Expand your referral program to increase high-quality leads.',
        });
        insights.push({
            type: 'warning',
            title: 'Stale Deals',
            description: 'Several deals in negotiation stage have had no activity for 2+ weeks.',
            confidence: 72,
            recommendation: 'Follow up on stale deals to re-engage or close them.',
        });
    }
    else if (module === 'inventory') {
        insights.push({
            type: 'optimization',
            title: 'Stock Optimization',
            description: '5 products have excess inventory that has not moved in 90 days.',
            confidence: 90,
            recommendation: 'Consider running promotions on slow-moving inventory.',
        });
        insights.push({
            type: 'alert',
            title: 'Reorder Alert',
            description: '3 products are approaching their reorder points.',
            confidence: 85,
            recommendation: 'Place reorder requests for products nearing minimum stock levels.',
        });
    }
    else if (module === 'support') {
        insights.push({
            type: 'pattern',
            title: 'Common Issues',
            description: 'Billing-related tickets account for 35% of all support requests.',
            confidence: 80,
            recommendation: 'Create a comprehensive FAQ and knowledge base for billing issues.',
        });
        insights.push({
            type: 'insight',
            title: 'Response Time Impact',
            description: 'Tickets responded to within 1 hour have 90% satisfaction rate.',
            confidence: 92,
            recommendation: 'Aim for first response within 1 hour to maximize satisfaction.',
        });
    }
    else {
        insights.push({
            type: 'info',
            title: 'Analysis Complete',
            description: `Analyzed data for module: ${module}. No significant patterns detected.`,
            confidence: 50,
            recommendation: 'Provide more data for deeper analysis.',
        });
    }
    return insights;
};
exports.getInsights = getInsights;
const summarize = async (entityType, entityId) => {
    const summaries = {
        lead: {
            summary: `Lead #${entityId} is a qualified lead with high engagement. Multiple touchpoints recorded including email opens and website visits. Estimated value based on similar leads in your pipeline suggests a moderate to high conversion probability.`,
            keyPoints: [
                'High engagement level with marketing materials',
                'Multiple touchpoints across channels',
                'Fits ideal customer profile',
            ],
            sentiment: 'positive',
            confidence: 76,
        },
        deal: {
            summary: `Deal #${entityId} is currently in active negotiation. The deal involves a mid-sized opportunity with a decision-making timeline of approximately 2-3 weeks. Key stakeholders have been identified and engaged.`,
            keyPoints: [
                'Active negotiation stage',
                'Decision timeline: 2-3 weeks',
                'Key stakeholders engaged',
            ],
            sentiment: 'neutral',
            confidence: 72,
        },
        employee: {
            summary: `Employee #${entityId} has a consistent performance record with above-average attendance. Current role alignment matches their skill set. Recent contributions show positive impact on team metrics.`,
            keyPoints: [
                'Above-average attendance record',
                'Good role alignment',
                'Positive team impact',
            ],
            sentiment: 'positive',
            confidence: 80,
        },
        ticket: {
            summary: `Support ticket #${entityId} involves a technical issue that has been escalated. The customer has a history of similar issues. Current SLA is within acceptable limits but requires attention.`,
            keyPoints: [
                'Technical issue - escalated',
                'Similar issues in customer history',
                'SLA within limits',
            ],
            sentiment: 'neutral',
            confidence: 68,
        },
        document: {
            summary: `Document #${entityId} contains key business information. The document has been accessed by multiple team members and has version history available. Content relevance is high for current projects.`,
            keyPoints: [
                'Accessed by multiple team members',
                'Multiple versions available',
                'High relevance to current projects',
            ],
            sentiment: 'positive',
            confidence: 75,
        },
    };
    return summaries[entityType] || {
        summary: `Entity #${entityId} of type ${entityType} has been analyzed. Available data is limited for comprehensive summarization.`,
        keyPoints: ['Limited data available'],
        sentiment: 'neutral',
        confidence: 45,
    };
};
exports.summarize = summarize;
const generateEmail = async (data) => {
    const { type, recipient, subject, keyPoints, tone } = data;
    const templates = {
        follow_up: {
            subject: subject || 'Following Up on Our Conversation',
            body: `Dear Recipient,\n\nI hope this message finds you well. I wanted to follow up on our recent conversation regarding ${subject || 'the discussed matter'}.\n\n${keyPoints.length > 0 ? `Key points to discuss:\n${keyPoints.map((kp) => `- ${kp}`).join('\n')}\n\n` : ''}Please let me know if you have any questions or if there are any updates you'd like to share.\n\nLooking forward to hearing from you.\n\nBest regards,\nAI Business OS`,
        },
        proposal: {
            subject: subject || 'Proposal',
            body: `Dear Recipient,\n\nWe are pleased to present the following proposal for your consideration.\n\n${keyPoints.length > 0 ? `Key highlights:\n${keyPoints.map((kp) => `- ${kp}`).join('\n')}\n\n` : ''}We believe this proposal addresses your requirements effectively and look forward to your feedback.\n\nPlease review and let us know if you have any questions.\n\nBest regards,\nAI Business OS`,
        },
        welcome: {
            subject: subject || 'Welcome to AI Business OS',
            body: `Dear Recipient,\n\nWelcome to AI Business OS! We are excited to have you on board.\n\n${keyPoints.length > 0 ? `Here's what you can expect:\n${keyPoints.map((kp) => `- ${kp}`).join('\n')}\n\n` : ''}If you need any assistance getting started, please don't hesitate to reach out to our support team.\n\nBest regards,\nThe AI Business OS Team`,
        },
        reminder: {
            subject: subject || 'Reminder',
            body: `Dear Recipient,\n\nThis is a friendly reminder regarding ${subject || 'the pending matter'}.\n\n${keyPoints.length > 0 ? `Details:\n${keyPoints.map((kp) => `- ${kp}`).join('\n')}\n\n` : ''}Please take the necessary action at your earliest convenience.\n\nBest regards,\nAI Business OS`,
        },
        custom: {
            subject: subject || 'Message from AI Business OS',
            body: `Dear Recipient,\n\n${keyPoints.length > 0 ? keyPoints.join('\n\n') : 'This is a message from AI Business OS.'}\n\nBest regards,\nAI Business OS`,
        },
    };
    const template = (templates[type] || templates.custom);
    return {
        to: recipient,
        subject: template.subject,
        body: template.body,
        tone,
        generatedAt: new Date().toISOString(),
    };
};
exports.generateEmail = generateEmail;
const extractDocument = async (file) => {
    if (!file)
        throw new appError_1.default(400, 'BAD_REQUEST', 'File is required');
    const ext = file.originalname.split('.').pop()?.toLowerCase() || '';
    const ocrData = {
        fileName: file.originalname,
        fileSize: file.size,
        fileType: ext,
        processedAt: new Date().toISOString(),
        text: `[OCR PARSING] This document has been processed using AI-powered OCR.\n\nDocument: ${file.originalname}\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${ext.toUpperCase()}\n\nExtracted content would appear here. For production, integrate with a document parsing service like AWS Textract or Google Document AI.`,
        metadata: {
            pages: Math.max(1, Math.floor(file.size / 50000)),
            language: 'en',
            confidence: 85.5,
        },
        fields: {},
    };
    return ocrData;
};
exports.extractDocument = extractDocument;
const forecast = async (historicalData, periods) => {
    if (historicalData.length < 2) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'At least 2 data points required for forecasting');
    }
    const values = historicalData.map((d) => d.value);
    const x = values.map((_, i) => i);
    const n = values.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, _, i) => a + i * values[i], 0);
    const sumXX = x.reduce((a, _, i) => a + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const futureData = [];
    for (let i = 1; i <= periods; i++) {
        const predictedValue = Math.max(0, intercept + slope * (n - 1 + i));
        futureData.push({
            period: `Period ${n + i}`,
            forecast: Math.round(predictedValue * 100) / 100,
        });
    }
    const fittedValues = x.map((i) => intercept + slope * i);
    const residuals = values.map((y, i) => y - fittedValues[i]);
    const ssRes = residuals.reduce((a, r) => a + r * r, 0);
    const ssTot = values.reduce((a, y) => a + (y - sumY / n) ** 2, 0);
    const rSquared = n > 1 ? 1 - ssRes / ssTot : 0;
    return {
        label: historicalData[0]?.period || 'Forecast',
        historicalData: historicalData.map((d) => ({ ...d })),
        forecastData: futureData,
        model: {
            type: 'linear_regression',
            slope: Math.round(slope * 10000) / 10000,
            intercept: Math.round(intercept * 10000) / 10000,
            rSquared: Math.round(Math.max(0, rSquared) * 10000) / 10000,
        },
        confidence: Math.round(Math.max(0, rSquared) * 100),
        generatedAt: new Date().toISOString(),
    };
};
exports.forecast = forecast;
const parseResume = async (file) => {
    if (!file)
        throw new appError_1.default(400, 'BAD_REQUEST', 'Resume file is required');
    const resumeData = {
        fileName: file.originalname,
        processedAt: new Date().toISOString(),
        parsedData: {
            personalInfo: {
                fullName: '[Extracted Name]',
                email: '[Extracted Email]',
                phone: '[Extracted Phone]',
                location: '[Extracted Location]',
                linkedIn: '[Extracted LinkedIn URL]',
            },
            skills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'],
            experience: [
                {
                    company: '[Company Name]',
                    title: '[Job Title]',
                    from: 'YYYY-MM',
                    to: 'YYYY-MM',
                    description: '[Job description and achievements]',
                },
            ],
            education: [
                {
                    institution: '[Institution Name]',
                    degree: '[Degree]',
                    field: '[Field of Study]',
                    from: 'YYYY',
                    to: 'YYYY',
                },
            ],
            certifications: ['[Certification Name]'],
            languages: ['English'],
            totalYearsOfExperience: 5,
            summary: '[Extracted professional summary]',
        },
        confidence: 82.5,
    };
    return resumeData;
};
exports.parseResume = parseResume;
//# sourceMappingURL=ai.service.js.map