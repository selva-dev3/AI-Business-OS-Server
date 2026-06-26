const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../config/logger');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, from = env.smtp.from }) => {
  try {
    const t = getTransporter();
    const info = await t.sendMail({ from, to, subject, html });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

const sendOTPEmail = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
  });
};

const sendInvitationEmail = async (email, companyName, inviterName) => {
  return sendEmail({
    to: email,
    subject: `You've been invited to ${companyName}`,
    html: `<p>${inviterName} has invited you to join ${companyName}.</p><p>Click <a href="${process.env.APP_URL || 'http://localhost:3000'}/auth/accept-invite?email=${email}">here</a> to accept the invitation.</p>`,
  });
};

const sendPasswordResetEmail = async (email, newPassword) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset Successful',
    html: `<p>Your password has been reset by an administrator.</p><p>Your temporary password is: <strong>${newPassword}</strong></p><p>Please change it on your next login.</p>`,
  });
};

module.exports = { sendEmail, sendOTPEmail, sendInvitationEmail, sendPasswordResetEmail };
