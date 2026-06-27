"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendInvitationEmail = exports.sendOTPEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../config/logger"));
let transporter = null;
const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer_1.default.createTransport({
            host: env_1.default.smtp.host,
            port: env_1.default.smtp.port,
            secure: env_1.default.smtp.secure,
            auth: {
                user: env_1.default.smtp.user,
                pass: env_1.default.smtp.pass,
            },
        });
    }
    return transporter;
};
const sendEmail = async ({ to, subject, html, from = env_1.default.smtp.from }) => {
    try {
        const t = getTransporter();
        const info = await t.sendMail({ from, to, subject, html });
        logger_1.default.info(`Email sent to ${to}: ${info.messageId}`);
        return info;
    }
    catch (error) {
        logger_1.default.error('Email send error:', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
const sendOTPEmail = async (email, otp) => {
    return sendEmail({
        to: email,
        subject: 'Password Reset OTP',
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
    });
};
exports.sendOTPEmail = sendOTPEmail;
const sendInvitationEmail = async (email, companyName, inviterName) => {
    return sendEmail({
        to: email,
        subject: `You've been invited to ${companyName}`,
        html: `<p>${inviterName} has invited you to join ${companyName}.</p><p>Click <a href="${process.env['APP_URL'] || 'http://localhost:3000'}/auth/accept-invite?email=${email}">here</a> to accept the invitation.</p>`,
    });
};
exports.sendInvitationEmail = sendInvitationEmail;
const sendPasswordResetEmail = async (email, newPassword) => {
    return sendEmail({
        to: email,
        subject: 'Password Reset Successful',
        html: `<p>Your password has been reset by an administrator.</p><p>Your temporary password is: <strong>${newPassword}</strong></p><p>Please change it on your next login.</p>`,
    });
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=emailService.js.map